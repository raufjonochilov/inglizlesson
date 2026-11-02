const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../../.local-tts');
(async()=>{
  fs.mkdirSync(root,{recursive:true});
  for(const [name,url] of [
    ['uv.zip','https://github.com/astral-sh/uv/releases/latest/download/uv-x86_64-pc-windows-msvc.zip'],
    ['cosyvoice.zip','https://codeload.github.com/FunAudioLLM/CosyVoice/zip/074ca6dc9e80a2f424f1f74b48bdd7d3fea531cc'],
    ['matcha.zip','https://codeload.github.com/shivammehta25/Matcha-TTS/zip/dd9105b34bf2be2230f4aa1e4769fb586a3c824e']
  ]) {
    const target=path.join(root,name);
    if(fs.existsSync(target)) continue;
    const r=await fetch(url);if(!r.ok)throw Error(`${name}: ${r.status}`);
    fs.writeFileSync(target+'.partial',Buffer.from(await r.arrayBuffer()));
    fs.renameSync(target+'.partial',target);
  }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
