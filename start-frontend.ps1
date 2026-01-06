# Start Frontend Development Server
Write-Host "Starting Flight Booking Frontend Server..." -ForegroundColor Green
Write-Host "Server will run on http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\frontend"
& "C:\Program Files\nodejs\npm.cmd" run dev
