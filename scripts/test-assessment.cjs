const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Run the actual route handlers with a deterministic AI stub; no paid requests.
let answer;
function load(file) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = id => {
    if (id === '@/lib/gemini') return { callGeminiApi: async () => {
      if (answer instanceof Error) throw answer;
      return answer;
    } };
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`);
    return originalRequire(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText, filename);
  return mod.exports;
}
async function post(handler, body) {
  return handler(new Request('http://localhost/api/test', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }));
}
(async () => {
  answer = new Error('AI unavailable');
  for (const [route, body] of [
    ['analyze', { sentence: 'She are happy' }],
    ['ielts', { transcript: 'word '.repeat(41), question: 'Describe your home' }]
  ]) {
    const response = await post(load(`src/app/api/${route}/route.ts`).POST, body);
    assert.equal(response.status, 503);
    const data = await response.json();
    assert.ok(data.error);
    assert.equal(data.overallBand, undefined);
    assert.equal(data.isCorrect, undefined);
  }
  const chat = load('src/app/api/chat/route.ts').POST;
  const body = { lessonId: 'lesson-1', messages: [{ role: 'user', content: 'I is student' }] };
  let response = await post(chat, body);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).passed, false);
  for (const passed of [false, true]) {
    answer = JSON.stringify({ reply: 'Teacher feedback', passed });
    response = await post(chat, body);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).passed, passed);
  }
  answer = '{"reply":"Invalid assessment","passed":"true"}';
  response = await post(chat, body);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).passed, false);
  console.log('Assessment regression checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
