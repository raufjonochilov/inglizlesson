// Optional network smoke test: exercise the real TTS route and provider, without
// a browser or an AI stub. Does not load local secrets or call Gemini.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function load(file) {
  const filename = path.resolve(__dirname, '..', file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = id => id.startsWith('@/')
    ? load(`src/${id.slice(2)}.ts`)
    : originalRequire(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
  return mod.exports;
}

(async () => {
  const { POST } = load('src/app/api/tts/route.ts');
  const cases = [
    { name: 'Explicit native Uzbek', text: 'Muvaffaqiyat tirishqoqlikdan boshlanadi. O‘qituvchi g‘ayrat bilan ta’lim beradi.', lang:'uz-UZ', voices: ['uz-UZ-SardorNeural'] },
    { name: 'Uzbek male', text: 'Salom! Bugun ingliz tilini birga o‘rganamiz.', gender: 'male', voices: ['uz-UZ-SardorNeural'] },
    { name: 'Uzbek female', text: 'Salom! Bugun ingliz tilini birga o‘rganamiz.', gender: 'female', voices: ['uz-UZ-MadinaNeural'] },
    { name: 'British English', text: 'Take your time and enjoy learning English.', lang: 'en-GB', voices: ['en-GB-RyanNeural'] },
    { name: 'American English', text: 'A little practice every day makes a real difference.', lang: 'en-US', gender: 'female', voices: ['en-US-JennyNeural'] },
    { name: 'Mixed Uzbek and English', text: 'Bugungi iboramiz: "Take your time." Bu — shoshilmang, degani.', lang:'uz-mixed', accent: 'en-GB', voices: ['uz-UZ-SardorNeural', 'en-GB-RyanNeural'] },
  ];
  for (const { name, voices, ...body } of cases) {
    const response = await POST(new Request('http://test/api/tts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, provider: 'microsoft' }),
    }));
    assert.equal(response.status, 200, `${name}: provider did not return audio`);
    assert.equal(response.headers.get('Content-Type'), 'audio/mpeg');
    const data = Buffer.from(await response.arrayBuffer());
    assert.ok(data.length > 1000, `${name}: missing audio`);
    assert.ok(data.subarray(0, 512).some((byte, index) => byte === 0xff && (data[index + 1] & 0xe0) === 0xe0), `${name}: missing MPEG frame`);
    for (const voice of voices) assert.ok(response.headers.get('X-TTS-Voice').includes(voice));
    console.log(`${name}: OK (${data.length} bytes)`);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
