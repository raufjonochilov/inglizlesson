const fs = require('node:fs');
const path = require('node:path');
const {pipeline} = require('node:stream/promises');
const {Readable} = require('node:stream');
const root = path.resolve(__dirname, '../../.local-tts/models');
async function download(repo, revision, folder, allow) {
  const response = await fetch(`https://huggingface.co/api/models/${repo}/tree/${revision}?recursive=true`);
  if (!response.ok) throw Error(`Model inventory: ${response.status}`);
  for (const item of await response.json()) {
    if (item.type !== 'file' || !allow(item.path)) continue;
    const target = path.resolve(root, folder, item.path);
    if (!target.startsWith(root + path.sep)) throw Error('Unsafe model path');
    if (fs.existsSync(target) && fs.statSync(target).size === item.size) continue;
    fs.mkdirSync(path.dirname(target), {recursive:true});
    console.log(`Downloading ${folder}/${item.path} (${Math.round(item.size/1024/1024)} MB)`);
    const data = await fetch(`https://huggingface.co/${repo}/resolve/${revision}/${item.path}`);
    if (!data.ok) throw Error(`Download ${item.path}: ${data.status}`);
    await pipeline(Readable.fromWeb(data.body), fs.createWriteStream(target+'.partial'));
    if (fs.statSync(target+'.partial').size !== item.size) throw Error('Incomplete download: '+item.path);
    fs.renameSync(target+'.partial', target);
  }
}
Promise.all([
  download('aisha-org/navoiy-tts','912e6bb6663f11e5dec5de830ca06ea8dd4c985f','navoiy',p=>p.endsWith('.py')||['emotion_600h_joint.pt','emotions_40h.json','LICENSE','NOTICE'].includes(p)),
  download('FunAudioLLM/CosyVoice2-0.5B','eec1ae6c79877dbd9379285cf8789c9e0879293d','base',p=>p.startsWith('CosyVoice-BlankEN/')||['campplus.onnx','cosyvoice2.yaml','flow.pt','hift.pt','llm.pt','speech_tokenizer_v2.onnx'].includes(p))
]).then(()=>console.log('Model files ready.')).catch(e=>{console.error(e.message);process.exitCode=1;});
