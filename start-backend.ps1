# Start Backend Server
Write-Host "Starting Flight Booking Backend Server..." -ForegroundColor Green
Write-Host "Server will run on http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "$PSScriptRoot\backend"
& "C:\Program Files\Go\bin\go.exe" run main.go
