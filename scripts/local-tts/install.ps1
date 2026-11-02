$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '../..')
$env:UV_CACHE_DIR = Join-Path (Get-Location) '.local-tts/cache'
$env:UV_PYTHON_INSTALL_DIR = Join-Path (Get-Location) '.local-tts/python'
node scripts/local-tts/bootstrap.cjs
if ($LASTEXITCODE -ne 0) { throw 'Runtime download failed' }
if (!(Test-Path .local-tts/tools/uv.exe)) {
    Expand-Archive -LiteralPath .local-tts/uv.zip -DestinationPath .local-tts/tools -Force
}
if (!(Test-Path .local-tts/source/CosyVoice-074ca6dc9e80a2f424f1f74b48bdd7d3fea531cc/cosyvoice)) {
    Expand-Archive -LiteralPath .local-tts/cosyvoice.zip -DestinationPath .local-tts/source -Force
}
if (!(Test-Path .local-tts/source/Matcha-TTS-dd9105b34bf2be2230f4aa1e4769fb586a3c824e/matcha)) {
    Expand-Archive -LiteralPath .local-tts/matcha.zip -DestinationPath .local-tts/source -Force
}
& .local-tts/tools/uv.exe python install 3.10 --no-bin
if ($LASTEXITCODE -ne 0) { throw 'Python installation failed' }
& .local-tts/tools/uv.exe venv .local-tts/venv --python 3.10 --allow-existing
& .local-tts/tools/uv.exe pip install --python .local-tts/venv/Scripts/python.exe torch==2.5.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cu121
if ($LASTEXITCODE -ne 0) { throw 'CUDA dependency installation failed' }
& .local-tts/tools/uv.exe pip install --python .local-tts/venv/Scripts/python.exe -r scripts/local-tts/requirements.txt
if ($LASTEXITCODE -ne 0) { throw 'Speech dependency installation failed' }
node scripts/local-tts/download.cjs
if ($LASTEXITCODE -ne 0) { throw 'Model download failed' }
