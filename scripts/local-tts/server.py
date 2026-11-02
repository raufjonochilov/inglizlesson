"""Local Uzbek TTS; binds only to loopback and keeps one GPU model in memory."""
from pathlib import Path
import gc, hashlib, io, json, re, sys, threading, time
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / '.local-tts'
SOURCE = DATA / 'source' / 'CosyVoice-074ca6dc9e80a2f424f1f74b48bdd7d3fea531cc'
MATCHA = DATA / 'source' / 'Matcha-TTS-dd9105b34bf2be2230f4aa1e4769fb586a3c824e'
BASE = DATA / 'models' / 'base'
NAVOIY = DATA / 'models' / 'navoiy'
sys.path[:0] = [str(SOURCE), str(MATCHA), str(NAVOIY)]
import torch
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from hyperpyyaml import load_hyperpyyaml
from cosyvoice.cli.cosyvoice import CosyVoice2
from uztts.normalize import normalize

# Only inference components are needed; avoid loading training datasets and GAN.
yaml_path = BASE / 'cosyvoice2.yaml'
yaml_source = BASE / 'cosyvoice2.full.yaml'
if not yaml_source.exists():
    yaml_source.write_bytes(yaml_path.read_bytes())
yaml_text = yaml_source.read_text(encoding='utf-8')
main = yaml_text.split('hifigan:')[0]
tokenizer = re.search(r'^get_tokenizer:.*?(?=^tokenize:)', yaml_text, re.M | re.S).group(0)
features = re.search(r'^feat_extractor:.*?(?=^compute_fbank:)', yaml_text, re.M | re.S).group(0)
yaml_path.write_text(main + tokenizer + features, encoding='utf-8')

if not torch.cuda.is_available():
    raise RuntimeError('CUDA GPU is unavailable.')
torch.set_num_threads(4)
model = CosyVoice2(str(BASE), load_jit=False, load_trt=False, fp16=True)
state = torch.load(NAVOIY / 'emotion_600h_joint.pt', map_location='cpu', weights_only=True)
while isinstance(state, dict):
    nested = next((state[k] for k in ('state_dict', 'model', 'llm') if isinstance(state.get(k), dict)), None)
    if nested is None: break
    state = nested
result = model.model.llm.load_state_dict(state, strict=False)
if result.missing_keys:
    raise RuntimeError(f'Checkpoint missing weights: {result.missing_keys}')
if result.unexpected_keys:
    print(f'Unused training checkpoint weights: {result.unexpected_keys}', flush=True)
del state
model.model.llm.eval()
gc.collect()
torch.cuda.empty_cache()
reference = SOURCE / 'asset' / 'zero_shot_prompt.wav'
emotions = json.loads((NAVOIY / 'emotions_40h.json').read_text(encoding='utf-8'))
instruction = next(e['instruct'] for e in emotions if '[calm]' in e['tag']).strip() + '<|endofprompt|>'
lock = threading.Lock()
cache = DATA / 'audio-cache'
cache.mkdir(exist_ok=True)
app = FastAPI(docs_url=None, redoc_url=None)

class SpeechInput(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    speed: float = Field(default=1, ge=0.8, le=1.2)

@app.get('/health')
def health():
    return {'ready':True, 'provider':'navoiy-local', 'device':torch.cuda.get_device_name(0)}

@app.post('/tts')
def speak(request: SpeechInput):
    text = normalize(request.text, mode='infer')
    if not text.strip(): raise HTTPException(400, 'Empty text')
    digest = hashlib.sha256(json.dumps([text, request.speed, 'navoiy-v1']).encode()).hexdigest()
    target = cache / (digest + '.wav')
    with lock:
        if target.exists(): return Response(target.read_bytes(), media_type='audio/wav')
        try:
            torch.manual_seed(1986)
            chunks = []
            with torch.inference_mode():
                for part in model.inference_instruct2(text, instruction, str(reference), stream=False, speed=request.speed, text_frontend=False):
                    chunks.append(part['tts_speech'].detach().cpu())
            if not chunks: raise RuntimeError('No audio generated')
            waveform = torch.cat(chunks, dim=1).squeeze().float().numpy()
            buffer = io.BytesIO()
            sf.write(buffer, waveform, 24000, format='WAV', subtype='PCM_16')
            data = buffer.getvalue()
            target.write_bytes(data)
            files = sorted(cache.glob('*.wav'), key=lambda p:p.stat().st_mtime)
            total = sum(p.stat().st_size for p in files)
            for old in files:
                if total <= 256 * 1024 * 1024: break
                total -= old.stat().st_size
                old.unlink()
            return Response(data, media_type='audio/wav')
        except Exception:
            import traceback
            traceback.print_exc()
            torch.cuda.empty_cache()
            raise HTTPException(503, 'Local speech generation failed')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8765)
