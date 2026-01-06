# Quick Deployment Script for Flight Booking App
# This script helps you prepare your app for deployment

Write-Host "🚀 Flight Booking App - Deployment Preparation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to display menu
function Show-Menu {
    Write-Host "Choose your deployment option:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Build for Production (Local Test)" -ForegroundColor Green
    Write-Host "2. Deploy with Docker (Local)" -ForegroundColor Green
    Write-Host "3. Prepare for Vercel + Render" -ForegroundColor Green
    Write-Host "4. Show Deployment Guide" -ForegroundColor Green
    Write-Host "5. Exit" -ForegroundColor Red
    Write-Host ""
}

# Function to build for production
function Build-Production {
    Write-Host "📦 Building Frontend for Production..." -ForegroundColor Cyan
    Set-Location -Path "$PSScriptRoot\frontend"
    & "C:\Program Files\nodejs\npm.cmd" run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend build successful!" -ForegroundColor Green
        Write-Host "📁 Build output: frontend/dist" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "🔨 Building Backend..." -ForegroundColor Cyan
    Set-Location -Path "$PSScriptRoot\backend"
    & "C:\Program Files\Go\bin\go.exe" build -o flight-booking-api.exe .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend build successful!" -ForegroundColor Green
        Write-Host "📁 Binary: backend/flight-booking-api.exe" -ForegroundColor Yellow
    }
    else {
        Write-Host "❌ Backend build failed!" -ForegroundColor Red
    }
    
    Set-Location -Path $PSScriptRoot
}

# Function to deploy with Docker
function Deploy-Docker {
    Write-Host "🐳 Deploying with Docker..." -ForegroundColor Cyan
    
    # Check if Docker is installed
    $dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
    
    if (-not $dockerInstalled) {
        Write-Host "❌ Docker is not installed!" -ForegroundColor Red
        Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Building and starting containers..." -ForegroundColor Yellow
    docker-compose up --build -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Frontend: http://localhost" -ForegroundColor Cyan
        Write-Host "🔌 Backend: http://localhost:8080" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ Docker deployment failed!" -ForegroundColor Red
    }
}

# Function to prepare for Vercel + Render
function Prepare-VercelRender {
    Write-Host "📋 Preparing for Vercel + Render Deployment..." -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "✅ Files created:" -ForegroundColor Green
    Write-Host "  - backend/Dockerfile" -ForegroundColor Yellow
    Write-Host "  - frontend/Dockerfile" -ForegroundColor Yellow
    Write-Host "  - frontend/vercel.json" -ForegroundColor Yellow
    Write-Host "  - docker-compose.yml" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "📝 Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Push your code to GitHub:" -ForegroundColor White
    Write-Host "   git init" -ForegroundColor Gray
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Gray
    Write-Host "   git remote add origin https://github.com/yourusername/flight-booking.git" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "2. Deploy Backend to Render:" -ForegroundColor White
    Write-Host "   - Go to https://render.com" -ForegroundColor Gray
    Write-Host "   - Create new Web Service" -ForegroundColor Gray
    Write-Host "   - Connect your GitHub repo" -ForegroundColor Gray
    Write-Host "   - Set root directory: backend" -ForegroundColor Gray
    Write-Host "   - Deploy!" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "3. Deploy Frontend to Vercel:" -ForegroundColor White
    Write-Host "   - Go to https://vercel.com" -ForegroundColor Gray
    Write-Host "   - Import your GitHub repo" -ForegroundColor Gray
    Write-Host "   - Set root directory: frontend" -ForegroundColor Gray
    Write-Host "   - Update vercel.json with your backend URL" -ForegroundColor Gray
    Write-Host "   - Deploy!" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
}

# Function to show deployment guide
function Show-DeploymentGuide {
    if (Test-Path "$PSScriptRoot\DEPLOYMENT_GUIDE.md") {
        Start-Process "$PSScriptRoot\DEPLOYMENT_GUIDE.md"
    }
    else {
        Write-Host "❌ DEPLOYMENT_GUIDE.md not found!" -ForegroundColor Red
    }
}

# Main script
do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-5)"
    
    switch ($choice) {
        "1" {
            Build-Production
            Write-Host ""
            Read-Host "Press Enter to continue"
        }
        "2" {
            Deploy-Docker
            Write-Host ""
            Read-Host "Press Enter to continue"
        }
        "3" {
            Prepare-VercelRender
            Write-Host ""
            Read-Host "Press Enter to continue"
        }
        "4" {
            Show-DeploymentGuide
            Write-Host ""
            Read-Host "Press Enter to continue"
        }
        "5" {
            Write-Host "👋 Goodbye!" -ForegroundColor Cyan
            exit
        }
        default {
            Write-Host "❌ Invalid choice. Please try again." -ForegroundColor Red
            Write-Host ""
        }
    }
    
    Clear-Host
} while ($true)
