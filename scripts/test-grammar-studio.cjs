const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),assert=require('node:assert/strict');
let cursor=0,dirty=false,effects=[],tree;const hooks=[],storage=new Map();
const react={useRef(){cursor++;return {current:null};},useState(initial){const i=cursor++;if(!hooks[i])hooks[i]={value:initial};return[hooks[i].value,v=>{const n=typeof v==='function'?v(hooks[i].value):v;if(!Object.is(n,hooks[i].value)){hooks[i].value=n;dirty=true;}}];},useMemo(fn){cursor++;return fn();},useEffect(fn,deps){const i=cursor++,prev=hooks[i];if(!prev||deps.some((d,j)=>!Object.is(d,prev.deps[j]))){hooks[i]={deps};effects.push(fn);}}};
global.document={body:{style:{overflow:''}}}; global.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
global.setInterval=()=>0;global.clearInterval=()=>{};
function load(file){const filename=path.resolve(file),m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const req=m.require.bind(m);m.require=id=>id==='react'?react:id==='react/jsx-runtime'?{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}:id==='@/lib/speech'?{stopSpeaking(){},speakText(){},SoundFX:{playSuccess(){}}}:id.startsWith('@/')?load('src/'+id.slice(2)+'.ts'):req(id);m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText,filename);return m.exports;}
const Component=load('src/components/GrammarDoctor.tsx').default;
function render(){let limit=12;do{cursor=0;dirty=false;effects=[];tree=Component({soundEnabled:false,onActivity(){}});effects.forEach(fn=>fn());assert.ok(limit-->0);}while(dirty);}
function nodes(n=tree){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children??null)];}
function text(n){if(Array.isArray(n))return n.map(text).join('');if(n&&typeof n==='object')return text(n.props?.children);return String(n??'');}
function click(label){const button=nodes().find(n=>n.type==='button'&&(text(n)+(n.props['aria-label']||'')).includes(label));assert.ok(button,label);button.props.onClick();render();}
render();assert.ok(text(tree).includes('28 ta mavzu'));
let select=nodes().find(n=>n.type==='select');select.props.onChange({target:{value:'Murphy Red (Essential)'}});render();assert.ok(nodes().filter(n=>n.type==='article').length>0);assert.ok(nodes().filter(n=>n.type==='article').every(n=>text(n).includes('Murphy')));
select=nodes().find(n=>n.type==='select');select.props.onChange({target:{value:'All'}});render();
click('Darsni boshlash');assert.ok(nodes().some(n=>n.type==='dialog'));
const curriculum=load('src/lib/data/grammar-curriculum.ts');const topic=curriculum.GRAMMAR_TOPICS_LIST[0];
for(const q of topic.practice){const button=nodes().find(n=>n.type==='button'&&text(n)===q.correctAnswer);assert.ok(button);assert.equal(button.props.disabled,false);button.props.onClick();render();}
assert.ok(text(tree).includes((topic.practice.length*10)+' ball'));assert.ok(text(tree).includes('Ajoyib!'));
click('Darsni yopish');assert.ok(!nodes().some(n=>n.type==='dialog'));
let input=nodes().find(n=>n.type==='input');input.props.onChange({target:{value:'no-such-topic-xyz'}});render();assert.ok(text(tree).includes('Mavzu topilmadi'));click('Filtrlarni tozalash');assert.equal(nodes().filter(n=>n.type==='article').length,28);
console.log('Grammar checks passed: book filtering, independent quiz answers, score, lesson close, search and reset.');