const fs=require('node:fs'),path=require('node:path');
const {pipeline}=require('node:stream/promises');const {Readable}=require('node:stream');
const root=path.resolve(__dirname,'../../.local-tts/chatterbox');
async function download(repo,rev,files){for(const file of files){const target=path.join(root,file);if(fs.existsSync(target))continue;fs.mkdirSync(path.dirname(target),{recursive:true});console.log('Downloading '+file);const r=await fetch(`https://huggingface.co/${repo}/resolve/${rev}/${file}`);if(!r.ok)throw Error(file+': '+r.status);await pipeline(Readable.fromWeb(r.body),fs.createWriteStream(target+'.partial'));fs.renameSync(target+'.partial',target);}}
Promise.all([
 download('Abduqayum/uzbek-tts-natural-speech-chatterbox','4fe29a7261cdce1faeaaaaa6b885397bbf1f9833',['t3_finetuned_merged.safetensors','tokenizer.json','reference_voice.wav','inference.py','README.md']),
 download('ResembleAI/chatterbox','5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18',['s3gen.safetensors','ve.safetensors'])
]).then(()=>console.log('Chatterbox models ready.')).catch(e=>{console.error(e.message);process.exitCode=1;});
