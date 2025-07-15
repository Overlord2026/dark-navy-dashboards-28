# Healthcare Module File Transfer Script (PowerShell)
# This script copies the healthcare module files to the main project structure

Write-Host "🏥 Healthcare Module File Transfer Starting..." -ForegroundColor Green

# Create necessary directories
Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "src\types\healthcare" | Out-Null
New-Item -ItemType Directory -Force -Path "src\hooks\healthcare" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components\healthcare" | Out-Null  
New-Item -ItemType Directory -Force -Path "src\pages\healthcare" | Out-Null
New-Item -ItemType Directory -Force -Path "src\services\healthcare" | Out-Null

# Copy type definitions
Write-Host "📝 Copying type definitions..." -ForegroundColor Yellow
try {
    Copy-Item -Path "healthcare-export\types\*" -Destination "src\types\healthcare\" -Recurse -Force
} catch {
    Write-Host "Types directory not found, skipping..." -ForegroundColor Gray
}

# Copy hooks
Write-Host "🎣 Copying healthcare hooks..." -ForegroundColor Yellow
try {
    Copy-Item -Path "healthcare-export\hooks\healthcare\*" -Destination "src\hooks\healthcare\" -Force
} catch {
    Write-Host "Hooks directory not found, skipping..." -ForegroundColor Gray
}

# Copy components  
Write-Host "🧩 Copying healthcare components..." -ForegroundColor Yellow
try {
    Copy-Item -Path "healthcare-export\components\*" -Destination "src\components\healthcare\" -Force
} catch {
    Write-Host "Components directory not found, skipping..." -ForegroundColor Gray
}

# Copy pages
Write-Host "📄 Copying healthcare pages..." -ForegroundColor Yellow
try {
    Copy-Item -Path "healthcare-export\pages\*" -Destination "src\pages\healthcare\" -Force
} catch {
    Write-Host "Pages directory not found, skipping..." -ForegroundColor Gray
}

# Copy services
Write-Host "⚙️ Copying healthcare services..." -ForegroundColor Yellow
try {
    Copy-Item -Path "healthcare-export\services\*" -Destination "src\services\healthcare\" -Force
} catch {
    Write-Host "Services directory not found, skipping..." -ForegroundColor Gray
}

Write-Host "✅ Healthcare module files copied successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run the database schema in your Supabase SQL editor" -ForegroundColor White
Write-Host "2. Add healthcare routes to your routing configuration" -ForegroundColor White
Write-Host "3. Update your navigation to include healthcare links" -ForegroundColor White
Write-Host "4. Install required dependencies if not already installed" -ForegroundColor White
Write-Host ""
Write-Host "📚 See COPY_PASTE_GUIDE.md for detailed integration instructions" -ForegroundColor Cyan
Write-Host "🚀 Your healthcare module is ready to use!" -ForegroundColor Green

# Pause to show results
Write-Host "Press any key to continue..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")