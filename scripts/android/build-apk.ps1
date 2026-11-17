<#
.SYNOPSIS
    Builds the native Android APK/AAB for Mindset Machine.
.DESCRIPTION
    Runs Vite production build, synchronizes web assets to Android Capacitor shell,
    and runs Gradle build to assemble debug or release APKs.
#>
param (
    [ValidateSet("debug", "release")]
    [string]$Mode = "debug",
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RootDir = Resolve-Path "$ScriptDir\..\.."

# Auto-configure JAVA_HOME and ANDROID_HOME if not defined
if (-not $env:JAVA_HOME -and (Test-Path "C:\Software\Java\Temurin-21\jdk-21.0.12.1+1")) {
    $env:JAVA_HOME = "C:\Software\Java\Temurin-21\jdk-21.0.12.1+1"
    $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
}
if (-not $env:ANDROID_HOME -and (Test-Path "C:\Software\Android\Sdk")) {
    $env:ANDROID_HOME = "C:\Software\Android\Sdk"
}

Write-Host "[BUILD] Starting Mindset Machine Android Build ($Mode)..." -ForegroundColor Cyan
Set-Location $RootDir

# 1. Frontend Build
Write-Host "[1/3] Building production web distribution..." -ForegroundColor Yellow
npm run build-only
if ($LASTEXITCODE -ne 0) {
    Write-Error "Web build failed with exit code $LASTEXITCODE"
}

# 2. Sync to Capacitor Android container
Write-Host "[2/3] Syncing web distribution into Capacitor Android platform..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Error "Capacitor sync failed with exit code $LASTEXITCODE"
}

# 3. Compile Android Native APK
Write-Host "[3/3] Assembling Android APK ($Mode)..." -ForegroundColor Yellow
Set-Location "$RootDir\android"

$gradleTask = if ($Mode -eq "release") { "assembleRelease" } else { "assembleDebug" }

if ($Clean) {
    Write-Host "[GRADLE] Cleaning project..." -ForegroundColor DarkGray
    cmd /c "gradlew.bat clean"
}

cmd /c "gradlew.bat $gradleTask"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle assembly failed with exit code $LASTEXITCODE"
}

$apkPath = if ($Mode -eq "release") {
    "$RootDir\android\app\build\outputs\apk\release\app-release-unsigned.apk"
} else {
    "$RootDir\android\app\build\outputs\apk\debug\app-debug.apk"
}

if (Test-Path $apkPath) {
    $apkItem = Get-Item $apkPath
    $sizeMB = [math]::Round($apkItem.Length / 1MB, 2)
    Write-Host "[SUCCESS] Android APK successfully generated!" -ForegroundColor Green
    Write-Host "Location: $($apkItem.FullName) ($sizeMB MB)" -ForegroundColor Cyan
} else {
    Write-Host "[WARN] Gradle build completed. Check android/app/build/outputs/apk/ for output." -ForegroundColor Yellow
}

Set-Location $RootDir
