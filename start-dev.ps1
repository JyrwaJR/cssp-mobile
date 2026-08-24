# Windows PowerShell script to start Expo with proper EMFILE fixes
# Run this instead of `npm run dev` or `expo start` on Windows

# Increase Node.js memory limit
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# Clear Metro cache
Write-Host "Clearing Metro cache..." -ForegroundColor Yellow
npx expo start --clear

Write-Host "Expo started with increased memory limit." -ForegroundColor Green
Write-Host "If you still get EMFILE errors, try:" -ForegroundColor Cyan
Write-Host "  1. Close other applications to free file handles" -ForegroundColor Cyan
Write-Host "  2. Run 'watchman watch-del-all' in a separate terminal" -ForegroundColor Cyan
Write-Host "  3. Restart your terminal/PowerShell as Administrator" -ForegroundColor Cyan