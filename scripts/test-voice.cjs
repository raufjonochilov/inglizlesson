const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { Readable } = require('node:stream');
const ts = require('typescript');
const calls = [];
let failText = '';
class FakeTTS {
  async setMetadata(voice) { this.voice = voice; }
  toStream(text, prosody) {
    calls.push({ voice: this.voice, text, prosody });
    return { audioStream: new Readable({ read() {
      if (text.includes(failText) && failText) this.destroy(new Error('Synthesis unavailable'));
      else { this.push(Buffer.from('audio')); this.push(null); }
    } }) };
  }
  close() {}
}
function load(file) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = mod.require.bind(mod);
  mod.require = id => {
    if (id === 'msedge-tts') return { MsEdgeTTS: FakeTTS, OUTPUT_FORMAT: { AUDIO_24KHZ_96KBITRATE_MONO_MP3: 'mp3' } };
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`);
    if (id.startsWith('./')) return load(path.resolve(path.dirname(filename), `${id}.ts`));
    return originalRequire(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText, filename);
  return mod.exports;
}
(async () => {
  const { splitSpeechSegments, normalizeSpeechText, isUzbekText } = load('src/lib/voice-text.ts');
  assert.equal(isUzbekText("Who's walking the dog's puppy?"), false);
  assert.equal(normalizeSpeechText("I’m sure it’s fine."), "I'm sure it's fine.");
  const mixed = splitSpeechSegments('Salom! "I am ready." Bu gap yaxshi. "Don’t give up." Yaxshi! "Hello!"');
  assert.deepEqual(mixed.map(s => s.lang), ['uz', 'en', 'uz', 'en', 'uz', 'en']);
  assert.ok(mixed.some(s => s.text === "Don't give up."));
  assert.deepEqual(splitSpeechSegments("Bu misol: 'I don't know.' Yaxshi!").map(s => s.lang), ['uz','en','uz']);
  const long = 'Learning takes practice. '.repeat(90).trim();
  const chunks = splitSpeechSegments(long, 'en');
  assert.equal(chunks.map(s => s.text).join(' '), long);
  assert.ok(chunks.every(s => s.text.length <= 420));
  assert.equal(normalizeSpeechText('**Salom!** [MOOD: laughing]'), 'Salom!');
  // Explicit Uzbek is authoritative, even when no keyword matches or a quote
  // looks English. Mixed explanations still read quoted English in English.
  assert.ok(splitSpeechSegments('Muvaffaqiyat tirishqoqlikdan boshlanadi. "Am I ready?"', 'uz').every(s => s.lang === 'uz'));
  assert.deepEqual(splitSpeechSegments('Muvaffaqiyat tirishqoqlikdan boshlanadi. "I am ready."', 'uz-mixed').map(s => s.lang), ['uz', 'en']);
  assert.equal(normalizeSpeechText('Oʻqituvchi g‘ishtdan qurilgan maktabda taʼlim beradi.'), "O'qituvchi g'ishtdan qurilgan maktabda ta'lim beradi.");
  // Exercise real route planning, cache separation and missing-segment handling.
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.AZURE_SPEECH_REGION;
  delete process.env.GEMINI_API_KEY;
  const route = load('src/app/api/tts/route.ts');
  const post = body => route.POST(new Request('http://test/api/tts', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }));
  let response = await post({ text:'Hello, welcome!', lang:'en-GB', gender:'female', rate:0.8 });
  assert.equal(response.status, 200);
  assert.equal(calls.at(-1).voice, 'en-GB-SoniaNeural');
  assert.equal(calls.at(-1).prosody.rate, '-20%');
  const count = calls.length;
  response = await post({ text:'Hello, welcome!', lang:'en-GB', gender:'female', rate:0.8 });
  assert.equal(calls.length, count);
  await post({ text:'Hello, welcome!', lang:'en-AU', gender:'male', rate:1 });
  assert.equal(calls.at(-1).voice, 'en-AU-WilliamNeural');
  response = await post({ text:'Salom! "Hello there!" Yaxshi!', accent:'en-GB', gender:'female' });
  assert.equal(response.status, 200);
  assert.deepEqual(calls.slice(-3).map(c => c.voice), ['uz-UZ-MadinaNeural','en-GB-SoniaNeural','uz-UZ-MadinaNeural']);
  response = await post({ text:'Muvaffaqiyat tirishqoqlikdan boshlanadi.', lang:'uz-UZ', accent:'en-US', pitch:1.3, rate:1.15 });
  assert.equal(response.status,200);
  assert.equal(calls.at(-1).voice,'uz-UZ-SardorNeural');
  assert.equal(calls.at(-1).prosody.pitch,'+0Hz');
  assert.equal(calls.at(-1).prosody.rate,'-5%');
  response = await post({ text:'Muvaffaqiyat tirishqoqlikdan boshlanadi. "I am ready."', lang:'uz-mixed', uzbekRate:0.85, rate:1.15, pitch:1.2 });
  assert.equal(response.status,200);
  assert.deepEqual(calls.slice(-2).map(c => c.prosody.rate), ['-15%', '+15%']);
  failText = 'missing';
  response = await post({ text:'Hello! The missing phrase. Goodbye!', lang:'en-US' });
  assert.equal(response.status, 502);
  assert.equal((await post({text:'a'.repeat(5001)})).status, 413);
  // The official provider uses a server key, SSML escaping and the same voice plan.
  process.env.AZURE_SPEECH_KEY = 'test-key';
  process.env.AZURE_SPEECH_REGION = 'eastus';
  let azureRequest;
  global.fetch = async (url, request) => {
    azureRequest = { url, request };
    return new Response(Buffer.from('audio'), {headers:{'Content-Type':'audio/mpeg'}});
  };
  response = await post({text:'A < B & C.',lang:'en-GB',gender:'female'});
  assert.equal(response.status,200);
  assert.equal(azureRequest.url,'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1');
  assert.ok(azureRequest.request.body.includes('A &lt; B &amp; C.'));
  assert.ok(azureRequest.request.body.includes('en-GB-SoniaNeural'));
  assert.equal(azureRequest.request.headers['Ocp-Apim-Subscription-Key'],'test-key');
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.AZURE_SPEECH_REGION;
  // Gemini is a different provider, returns WAV, and never speaks the style
  // instructions as transcript text. Fallback must identify the actual provider.
  process.env.GEMINI_API_KEY = 'test-gemini-key';
  const wav = Buffer.alloc(48);
  wav.write('RIFF', 0); wav.writeUInt32LE(40, 4); wav.write('WAVE', 8);
  let geminiRequest;
  let geminiCalls = 0;
  global.fetch = async (url, request) => {
    geminiCalls++;
    geminiRequest = { url, request, body: JSON.parse(request.body) };
    return new Response(JSON.stringify({ steps: [{ type:'model_output', content:[{type:'audio', mime_type:'audio/wav', data:wav.toString('base64')}] }] }), {headers:{'Content-Type':'application/json'}});
  };
  const geminiInput = { text:'Salom! "Hello there!"', lang:'uz-mixed', provider:'gemini' };
  response = await post(geminiInput);
  assert.equal(response.status,200);
  assert.equal(response.headers.get('Content-Type'),'audio/wav');
  assert.equal(response.headers.get('X-TTS-Source'),'gemini');
  assert.equal(response.headers.get('X-TTS-Voice'),'Charon');
  assert.equal(geminiRequest.request.headers['x-goog-api-key'],'test-gemini-key');
  assert.equal(geminiRequest.body.input[0].content[0].text,geminiInput.text);
  assert.ok(geminiRequest.body.input[0].content[0].annotations[0].style.includes('native speaker from Uzbekistan'));
  await post(geminiInput);
  assert.equal(geminiCalls,1);
  response = await post({...geminiInput,gender:'female'});
  assert.equal(response.headers.get('X-TTS-Voice'),'Kore');
  const successfulGeminiFetch = global.fetch;
  let transientAttempts = 0;
  global.fetch = async (...args) => ++transientAttempts === 1
    ? new Response('{}', { status: 429 }) : successfulGeminiFetch(...args);
  response = await post({...geminiInput,text:'Qayta urinish sinovi.'});
  assert.equal(transientAttempts, 2);
  assert.equal(response.headers.get('X-TTS-Source'), 'gemini');
  let limitedAttempts = 0;
  global.fetch = async () => { limitedAttempts++; return new Response('{}',{status:429,headers:{'Retry-After':'60'}}); };
  response = await post({...geminiInput,text:'Boshqa sinov.'});
  assert.equal(response.status,200);
  assert.equal(response.headers.get('X-TTS-Source'),'microsoft-neural');
  assert.equal(response.headers.get('X-TTS-Fallback'),'gemini-unavailable');
  assert.ok((await response.arrayBuffer()).byteLength > 0);
  response = await post(geminiInput);
  assert.equal(response.headers.get('X-TTS-Source'),'gemini', 'Cached audio must bypass cooldown');
  response = await post({...geminiInput,text:'The missing phrase.'});
  assert.equal(response.status,502, 'Both providers failing must report an error');
  assert.equal(limitedAttempts,1,'Respect Retry-After instead of sending more requests');
  // Local Uzbek speech stays on loopback and never silently calls a cloud API.
  let localRequest;
  global.fetch = async (url, request) => {
    localRequest = {url, body:JSON.parse(request.body)};
    return new Response(wav, {headers:{'Content-Type':'audio/wav'}});
  };
  response = await post({provider:'local',text:'Salom, mahalliy ovoz!',lang:'uz-UZ',uzbekRate:1.1});
  assert.equal(response.status,200);
  assert.equal(response.headers.get('X-TTS-Source'),'navoiy-local');
  assert.equal(localRequest.url,'http://127.0.0.1:8765/tts');
  assert.equal(localRequest.body.speed,1.1);
  global.fetch = async () => { throw Error('Local server stopped'); };
  response = await post({provider:'local',text:'Salom!',lang:'uz-UZ'});
  assert.equal(response.status,503);
  delete process.env.GEMINI_API_KEY;
  // A stopped request must never trigger a late browser fallback or start audio.
  let resolveFetch;
  let spoken = 0;
  global.window = { dispatchEvent() {}, speechSynthesis: { cancel() {}, getVoices: () => [{lang:'en-US',name:'Natural'}], speak() { spoken++; } } };
  global.localStorage = { getItem: () => null };
  global.CustomEvent = class { constructor(type, options) { this.detail=options.detail; } };
  global.fetch = () => new Promise(resolve => { resolveFetch = resolve; });
  const speech = load('src/lib/speech.ts');
  speech.speakText('Hello there!');
  speech.stopSpeaking();
  resolveFetch({ok:false});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(spoken, 0);
  // Existing Gemini preferences must migrate to Microsoft; speed is applied
  // by the synthesizer once, with natural pitch.
  global.localStorage = { getItem: () => JSON.stringify({provider:'gemini',speed:1,uzbekSpeed:1}) };
  let playedAudio;
  let playbackRequest;
  global.Audio = class {
    constructor() { playedAudio = this; }
    async play() {}
    pause() {}
    removeAttribute() {}
    load() {}
  };
  global.fetch = async (_, request) => {
    playbackRequest = JSON.parse(request.body);
    return { ok: true, headers: new Headers(), blob: async () => new Blob(['audio']) };
  };
  speech.playBusterSpeech('Salom, navbatdagi savol!');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(playbackRequest.provider, 'microsoft');
  assert.equal(playbackRequest.rate, 1.15);
  assert.equal(playbackRequest.uzbekRate, 1.15);
  assert.equal(playedAudio.playbackRate, 1);
  assert.equal(playedAudio.preservesPitch, true);
  speech.stopSpeaking();
  global.localStorage = { getItem: () => JSON.stringify({engine:'browser-natural',provider:'microsoft',voiceSetupVersion:1}) };
  playbackRequest = undefined;
  speech.playBusterSpeech('Salom, bugungi dars!');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(playbackRequest.provider, 'microsoft', 'Missing Uzbek browser voice must use server synthesis');
  assert.equal(playbackRequest.voice, 'buster');
  speech.stopSpeaking();
  console.log('Voice regression checks passed: language, contractions, long text, voices, speed, cache, incomplete audio, cancellation, missing browser voice.');
})().catch(error => { console.error(error); process.exitCode=1; });
