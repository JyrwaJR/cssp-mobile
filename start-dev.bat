@echo off
REM Windows Batch script to start Expo with proper EMFILE fixes
REM Run this instead of `npm run dev` or `expo start` on Windows

echo Setting Node.js memory limit...
set NODE_OPTIONS=--max-old-space-size=4096

echo Clearing Metro cache...
npx expo start --clear

echo.
echo Expo started with increased memory limit.
echo If you still get EMFILE errors, try:
echo   1. Close other applications to free file handles
echo   2. Run 'watchman watch-del-all' in a separate terminal
echo   3. Restart your terminal/Command Prompt as Administrator
echo.
pause