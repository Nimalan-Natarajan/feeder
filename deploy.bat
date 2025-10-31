@echo off
REM RSS Feeder - Cloudflare Pages Deploy Script (Windows)
echo 🚀 Building RSS Feeder for deployment...

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Build the application
echo 🔨 Building production version...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 📂 Your built app is in the 'dist' folder
    echo.
    echo 🌐 To deploy to Cloudflare Pages:
    echo 1. Go to https://pages.cloudflare.com
    echo 2. Create new project → Upload assets
    echo 3. Drag and drop the 'dist' folder
    echo 4. Your RSS Feeder will be live!
    echo.
    echo 💡 Pro tip: Connect to Git for automatic deployments
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

pause
