# Automated Local APK Builder for LinguaPulse AI
$ErrorActionPreference = "Stop"

$baseDir = Get-Location
$toolsDir = Join-Path $baseDir "tools"
$jdkZip = Join-Path $toolsDir "jdk.zip"
$cmdlineZip = Join-Path $toolsDir "cmdline-tools.zip"
$jdkDir = Join-Path $toolsDir "jdk17"
$androidSdkDir = Join-Path $toolsDir "android-sdk"

Write-Host "=== 1. Extracting JDK 17 ===" -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $jdkDir "bin\java.exe"))) {
    $tempJdkExtract = Join-Path $toolsDir "jdk_temp"
    if (Test-Path $tempJdkExtract) { Remove-Item -Recurse -Force $tempJdkExtract }
    Expand-Archive -Path $jdkZip -DestinationPath $tempJdkExtract -Force
    $innerJdk = Get-ChildItem -Path $tempJdkExtract -Directory | Select-Object -First 1
    if (Test-Path $jdkDir) { Remove-Item -Recurse -Force $jdkDir }
    Move-Item -Path $innerJdk.FullName -Destination $jdkDir -Force
    Remove-Item -Recurse -Force $tempJdkExtract
}
Write-Host "JDK 17 ready at: $jdkDir" -ForegroundColor Green

Write-Host "=== 2. Extracting Android SDK Commandline Tools ===" -ForegroundColor Cyan
$cmdlineLatestDir = Join-Path $androidSdkDir "cmdline-tools\latest"
if (-not (Test-Path (Join-Path $cmdlineLatestDir "bin\sdkmanager.bat"))) {
    $tempCmdExtract = Join-Path $toolsDir "cmd_temp"
    if (Test-Path $tempCmdExtract) { Remove-Item -Recurse -Force $tempCmdExtract }
    Expand-Archive -Path $cmdlineZip -DestinationPath $tempCmdExtract -Force
    $innerCmd = Join-Path $tempCmdExtract "cmdline-tools"
    if (-not (Test-Path (Split-Path $cmdlineLatestDir))) {
        New-Item -ItemType Directory -Path (Split-Path $cmdlineLatestDir) -Force | Out-Null
    }
    if (Test-Path $cmdlineLatestDir) { Remove-Item -Recurse -Force $cmdlineLatestDir }
    Move-Item -Path $innerCmd -Destination $cmdlineLatestDir -Force
    Remove-Item -Recurse -Force $tempCmdExtract
}
Write-Host "Android cmdline-tools ready at: $cmdlineLatestDir" -ForegroundColor Green

Write-Host "=== 3. Setting Environment Variables ===" -ForegroundColor Cyan
$env:JAVA_HOME = $jdkDir
$env:ANDROID_HOME = $androidSdkDir
$env:ANDROID_SDK_ROOT = $androidSdkDir
$env:PATH = "$jdkDir\bin;$cmdlineLatestDir\bin;$androidSdkDir\platform-tools;$env:PATH"

& "$jdkDir\bin\java.exe" -version

Write-Host "=== 4. Accepting Android SDK Licenses & Installing Build Tools ===" -ForegroundColor Cyan
$sdkManagerBat = Join-Path $cmdlineLatestDir "bin\sdkmanager.bat"

# Auto-accept licenses
$licensesDir = Join-Path $androidSdkDir "licenses"
if (-not (Test-Path $licensesDir)) {
    New-Item -ItemType Directory -Path $licensesDir -Force | Out-Null
}
# Accept Google licenses hashes directly
Set-Content -Path (Join-Path $licensesDir "android-sdk-license") -Value @"
24333f8a63b6825ea9c5514f83c2829b004d1fee
8933bad161af4178b1185d1a37fbf41ea5269c55
d56f5187479451eabf01fb78af6dfcb131a6481e
"@ -Force
Set-Content -Path (Join-Path $licensesDir "android-sdk-preview-license") -Value @"
84831b9409646a479e30bf45b004fa2d42b29dd7
"@ -Force

Write-Host "Installing platforms;android-34 and build-tools;34.0.0..." -ForegroundColor Yellow
$proc = Start-Process -FilePath $sdkManagerBat -ArgumentList '"platforms;android-34" "build-tools;34.0.0" "platform-tools" --sdk_root="' + $androidSdkDir + '"' -NoNewWindow -PassThru -Wait

Write-Host "=== 5. Building Android APK via Gradle ===" -ForegroundColor Cyan
$androidDir = Join-Path $baseDir "android"
Set-Location $androidDir

# Create local.properties with sdk.dir
$escapedSdkDir = $androidSdkDir -replace '\\', '\\'
Set-Content -Path (Join-Path $androidDir "local.properties") -Value "sdk.dir=$escapedSdkDir`n" -Force

$gradleBat = Join-Path $androidDir "gradlew.bat"
& $gradleBat assembleDebug

Set-Location $baseDir

$sourceApk = Join-Path $androidDir "app\build\outputs\apk\debug\app-debug.apk"
$targetApk = Join-Path $baseDir "LinguaPulse-AI.apk"

if (Test-Path $sourceApk) {
    Copy-Item -Path $sourceApk -Destination $targetApk -Force
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "SUCCESS! APK YARATILDI:" -ForegroundColor Green
    Write-Host $targetApk -ForegroundColor Yellow
    Write-Host "Fayl hajmi: $((Get-Item $targetApk).Length / 1MB) MB" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Error "APK fayli hosil qilinmadi."
}
