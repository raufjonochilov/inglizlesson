const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),assert=require('node:assert/strict');
let cursor=0,dirty=false,effects=[],tree;const hooks=[],storage=new Map();
const react={useState(initial){const i=cursor++;if(!hooks[i])hooks[i]={value:initial};return[hooks[i].value,v=>{const n=typeof v==='function'?v(hooks[i].value):v;if(!Object.is(n,hooks[i].value)){hooks[i].value=n;dirty=true;}}];},useMemo(fn){cursor++;return fn();},useEffect(fn,deps){const i=cursor++,prev=hooks[i];if(!prev||deps.some((d,j)=>!Object.is(d,prev.deps[j]))){hooks[i]={deps};effects.push(fn);}}};
global.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
global.setInterval=()=>0;global.clearInterval=()=>{};
function load(file){const filename=path.resolve(file),m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const req=m.require.bind(m);m.require=id=>id==='react'?react:id==='react/jsx-runtime'?{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}:id==='@/lib/speech'?{stopSpeaking(){},speakText(){},SoundFX:{playSuccess(){}}}:id.startsWith('@/')?load('src/'+id.slice(2)+'.ts'):req(id);m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText,filename);return m.exports;}
const Component=load('src/components/VocabBuilder.tsx').default;
function render(){let limit=12;do{cursor=0;dirty=false;effects=[];tree=Component({soundEnabled:false,onActivity(){}});effects.forEach(fn=>fn());assert.ok(limit-->0);}while(dirty);}
function nodes(n=tree){if(!n||typeof n!=='object')return[];if(Array.isArray(n))return n.flatMap(nodes);return[n,...nodes(n.props?.children??null)];}
function text(n){if(Array.isArray(n))return n.map(text).join('');if(n&&typeof n==='object')return text(n.props?.children);return String(n??'');}
function click(label){const button=nodes().find(n=>n.type==='button'&&(text(n)+(n.props['aria-label']||'')).includes(label));assert.ok(button,label);button.props.onClick();render();}
render();assert.ok(text(tree).includes('Agree'));click('Ma’nosini ochish');assert.ok(text(tree).includes('Rozi'));click('Eslab qoldim');assert.ok(JSON.parse(storage.get('lingua_mastered_words')).includes('ess-1-1'));assert.ok(JSON.parse(storage.get('lingua_vocab_reviews'))['ess-1-1'].due>Date.now());assert.equal(JSON.parse(storage.get('lingua_vocab_daily')).ids.length,1);
click('Yozib topish');let input=nodes().find(n=>n.type==='input'&&n.props['aria-label']==='Inglizcha javob');input.props.onChange({target:{value:'wrong'}});render();nodes().find(n=>n.type==='form').props.onSubmit({preventDefault(){}});render();assert.ok(text(tree).includes('To‘g‘ri javob: Attack'));click('Keyingi');

assert.ok(text(tree).includes('Tub')); console.log('Vocabulary checks passed: reveal, persistence, spaced review, daily progress, incorrect answer, navigation.');
