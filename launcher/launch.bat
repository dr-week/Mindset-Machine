@echo off
setlocal enabledelayedexpansion
title Mindset Machine - Fresh Launcher

echo ========================================================
echo        MINDSET MACHINE ^| Danger Labs
echo        Initiating Fresh Session Launcher...
echo ========================================================
echo.

:: 1. Navigate to the project root directory (one level up from launcher/)
cd /d "%~dp0.."

:: 2. Terminate existing processes on port 5173
echo [*] Checking for running instances on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo [*] Terminating lingering process on port 5173 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

:: Also close any stale node/vite tasks initiated from this workspace if needed
timeout /t 1 /nobreak >nul

:: 3. Clear transient Vite dev cache for a pristine fresh start
if exist "node_modules\.vite" (
    echo [*] Purging transient Vite cache...
    rd /s /q "node_modules\.vite" >nul 2>&1
)

echo.
echo [*] Verified port 5173 is clear.
echo [*] Launching Mindset Machine development server...
echo.

:: 4. Launch Vite server with open browser trigger
start http://localhost:5173
npm run dev -- --host --clearScreen false

endlocal
