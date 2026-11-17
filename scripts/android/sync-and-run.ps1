#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Build web assets, sync to Android, and launch on emulator/device.
  Requires: Android Studio + AVD, or a connected Android device.
.PARAMETER Device
  Target device: 'emulator' (default) or 'device'
#>
param(
  [ValidateSet('emulator','device')]
  [string]$Device = 'emulator'
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent | Split-Path -Parent)

Write-Host "⚡ MINDSET MACHINE — Android Dev Build" -ForegroundColor Cyan
Write-Host "Target: $Device" -ForegroundColor Yellow

# Step 1: Web build
Write-Host "`n[1/4] Building web assets..." -ForegroundColor Green
npm run build-only
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit 1 }

# Step 2: Capacitor sync
Write-Host "`n[2/4] Syncing to Android..." -ForegroundColor Green
npx cap sync android
if ($LASTEXITCODE -ne 0) { Write-Host "Sync failed!" -ForegroundColor Red; exit 1 }

# Step 3: Gradle build
Write-Host "`n[3/4] Assembling debug APK..." -ForegroundColor Green
Push-Location android
.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) { Write-Host "Gradle build failed!" -ForegroundColor Red; Pop-Location; exit 1 }
Pop-Location

# Step 4: Install and launch
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
Write-Host "`n[4/4] Installing APK on $Device..." -ForegroundColor Green

if ($Device -eq 'emulator') {
  $emulator = & adb devices | Select-String "emulator" | Select-Object -First 1
  if (-not $emulator) {
    Write-Host "No emulator detected. Start one from Android Studio first." -ForegroundColor Red; exit 1
  }
}

adb install -r $apkPath
adb shell am start -n "com.dangerlabs.mindsetmachine/.MainActivity"

Write-Host "`n✅ MINDSET MACHINE launched on $Device!" -ForegroundColor Green
