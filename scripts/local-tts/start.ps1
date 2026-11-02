$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '../..')
$env:HF_HUB_OFFLINE = '1'
$env:TRANSFORMERS_OFFLINE = '1'
$env:PYTHONUTF8 = '1'
$env:HF_HOME = Join-Path (Get-Location) '.local-tts/hf-cache'
$env:MODELSCOPE_CACHE = Join-Path (Get-Location) '.local-tts/modelscope-cache'
$env:MPLCONFIGDIR = Join-Path (Get-Location) '.local-tts/matplotlib-cache'
& .local-tts/venv/Scripts/python.exe scripts/local-tts/server.py
exit $LASTEXITCODE
