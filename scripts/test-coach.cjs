const fs = require('fs');
const Module = require('module');
const ts = require('typescript');
const assert = require('node:assert/strict');
const path = require('path');
const hooks = []; let cursor = 0, effects = [], dirty = false, tree;
const spoken = [];
const react = {
  createElement(type, props, ...children) { return { type, props: props || {}, children }; },
  useState(initial) { const i = cursor++; if (!hooks[i]) hooks[i] = {value:initial}; return [hooks[i].value, value => { const next = typeof value === 'function' ? value(hooks[i].value) : value; if (!Object.is(next, hooks[i].value)) { hooks[i].value = next; dirty = true; } }]; },
  useRef(value) { const i = cursor++; return (hooks[i] ||= { current:value }); },
  useMemo(fn) { cursor++; return fn(); },
  useEffect(fn, deps) { const i = cursor++; const prev = hooks[i]; if (!prev || deps.some((d,j) => !Object.is(d, prev.deps[j]))) { hooks[i] = {deps, cleanup:prev?.cleanup}; effects.push(() => { hooks[i].cleanup?.(); hooks[i].cleanup = fn(); }); } }
};
global.window = { addEventListener() {}, removeEventListener() {} };
const filename = path.resolve('src/components/SarcasticCoach.tsx');
const mod = new Module(filename, module); mod.filename = filename; mod.paths = module.paths;
const originalRequire = mod.require.bind(mod);
mod.require = id => id === 'react' ? react : id === '@/lib/speech' ? {
  playBusterSpeech(text) { spoken.push(text); }, stopSpeaking() {}, playEnglishNative() {},
  SoundFX: { playClick() {}, playSuccess() {}, playBuzzer() {} }
} : originalRequire(id);
mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8') + '\nexport { BUILTIN_CHALLENGES, CATEGORIES };', { compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020, jsx:ts.JsxEmit.React, esModuleInterop:true} }).outputText, filename);
const {default:Coach, BUILTIN_CHALLENGES:questions, CATEGORIES:categories} = mod.exports;
function render() { let limit=10; do { dirty=false; cursor=0; effects=[]; tree=Coach({apiKey:'',soundEnabled:true,onActivity(){}}); effects.forEach(fn=>fn()); assert.ok(limit-- > 0); } while(dirty); }
function nodes(node=tree) { if (!node || typeof node !== 'object') return []; if (Array.isArray(node)) return node.flatMap(n=>nodes(n)); return [node,...node.children.flatMap(n=>nodes(n))]; }
function clickHandler(name) { const node=nodes().find(n=>n.type==='button' && n.props.onClick?.name===name); assert.ok(node, name); node.props.onClick(); render(); }
function text(node) { if (Array.isArray(node)) return node.map(text).join(''); return typeof node==='object' && node ? text(node.children) : String(node??''); }
(async()=>{
  render();
  assert.ok(spoken.at(-1).includes(questions[0].question));
  for (const q of questions) {
    assert.ok(spoken.at(-1).includes(q.question), q.id);
    const before=spoken.length;
    const answer=nodes().find(n=>n.type==='button' && n.props.className==='flex items-center gap-2.5 flex-1 text-left');
    answer.props.onClick(); render();
    assert.equal(spoken.length,before+1);
    assert.equal(spoken.at(-1),q.correctIndex===0?q.praiseRight:q.roastWrong);
    clickHandler('handleNextChallenge');
  }
  for (const category of categories) {
    const button=nodes().find(n=>n.type==='button' && text(n).includes(category.label));
    button.props.onClick(); render();
    const first=category.key==='all'?questions[0]:questions.find(q=>q.categoryKey===category.key);
    assert.ok(spoken.at(-1).includes(first.question));
  }
  const toggle=()=>nodes().find(n=>n.type==='button' && n.props.title?.includes('Avto-Ovozni'));
  toggle().props.onClick(); render(); const muted=spoken.length;
  clickHandler('handleNextChallenge'); assert.equal(spoken.length,muted);
  toggle().props.onClick(); render(); assert.equal(spoken.length,muted+1);
  nodes().find(n=>n.type==='button' && text(n).includes('Erkin Bahs')).props.onClick(); render();
  nodes().find(n=>n.type==='input' && n.props.onChange).props.onChange({target:{value:'I am ready'}}); render();
  let resolve; global.fetch=()=>new Promise(r=>{resolve=r;});
  const before=spoken.length;
  const pending=nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}}); render();
  assert.equal(spoken.length,before,'Thinking text must stay silent');
  resolve({ok:true,json:async()=>({reply:'Yaxshi javob! [MOOD: surprised]'})});
  await pending; render();
  assert.equal(spoken.length,before+1);
  assert.equal(spoken.at(-1),'Yaxshi javob! [MOOD: surprised]');
  console.log(`Coach checks passed: all ${questions.length} questions, answers, categories, mute and speech after AI completion.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
