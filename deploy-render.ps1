# 🚀 Quick Deploy to Render - Step by Step

Write-Host "🚀 Render Deployment Helper" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git Repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Flight Booking App"
    Write-Host "✅ Git repository initialized!" -ForegroundColor Green
}
else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Deployment Checklist:" -ForegroundColor Cyan
Write-Host ""

# Step 1
Write-Host "Step 1: Push to GitHub" -ForegroundColor Yellow
Write-Host "  Run these commands:" -ForegroundColor White
Write-Host "    git remote add origin https://github.com/YOUR_USERNAME/flight-booking-app.git" -ForegroundColor Gray
Write-Host "    git branch -M main" -ForegroundColor Gray
Write-Host "    git push -u origin main" -ForegroundColor Gray
Write-Host ""

# Step 2
Write-Host "Step 2: Deploy Backend" -ForegroundColor Yellow
Write-Host "  1. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "  2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "  3. Connect your GitHub repository" -ForegroundColor White
Write-Host "  4. Configure:" -ForegroundColor White
Write-Host "     - Name: flight-booking-backend" -ForegroundColor Gray
Write-Host "     - Root Directory: backend" -ForegroundColor Gray
Write-Host "     - Build Command: go build -o main ." -ForegroundColor Gray
Write-Host "     - Start Command: ./main" -ForegroundColor Gray
Write-Host "  5. Click 'Create Web Service'" -ForegroundColor White
Write-Host "  6. Copy your backend URL!" -ForegroundColor White
Write-Host ""

# Step 3
Write-Host "Step 3: Update Frontend API URL" -ForegroundColor Yellow
Write-Host "  Edit: frontend/src/services/api.ts" -ForegroundColor White
Write-Host "  Change API_BASE_URL to your Render backend URL" -ForegroundColor White
Write-Host "  Then commit and push:" -ForegroundColor White
Write-Host "    git add frontend/src/services/api.ts" -ForegroundColor Gray
Write-Host "    git commit -m 'Update API URL for production'" -ForegroundColor Gray
Write-Host "    git push" -ForegroundColor Gray
Write-Host ""

# Step 4
Write-Host "Step 4: Deploy Frontend" -ForegroundColor Yellow
Write-Host "  1. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "  2. Click 'New +' → 'Static Site'" -ForegroundColor White
Write-Host "  3. Select same repository" -ForegroundColor White
Write-Host "  4. Configure:" -ForegroundColor White
Write-Host "     - Name: flight-booking-frontend" -ForegroundColor Gray
Write-Host "     - Root Directory: frontend" -ForegroundColor Gray
Write-Host "     - Build Command: npm install && npm run build" -ForegroundColor Gray
Write-Host "     - Publish Directory: dist" -ForegroundColor Gray
Write-Host "  5. Click 'Create Static Site'" -ForegroundColor White
Write-Host ""

# Step 5
Write-Host "Step 5: Test Your App! 🎉" -ForegroundColor Yellow
Write-Host "  Your app will be live at:" -ForegroundColor White
Write-Host "  https://flight-booking-frontend.onrender.com" -ForegroundColor Cyan
Write-Host ""

Write-Host "📖 For detailed instructions, see RENDER_DEPLOYMENT.md" -ForegroundColor Green
Write-Host ""

# Ask if user wants to open the guide
$openGuide = Read-Host "Open detailed deployment guide? (y/n)"
if ($openGuide -eq "y" -or $openGuide -eq "Y") {
    Start-Process "$PSScriptRoot\RENDER_DEPLOYMENT.md"
}
