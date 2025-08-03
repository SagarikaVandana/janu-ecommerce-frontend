@echo off
REM 🚀 Janu Collections Deployment Script for Windows

echo 🚀 Starting Janu Collections deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the frontend directory.
    pause
    exit /b 1
)

echo [INFO] Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js.
    pause
    exit /b 1
)

echo [INFO] Checking npm version...
npm --version
if %errorlevel% neq 0 (
    echo [ERROR] npm not found. Please install npm.
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [INFO] Checking for TypeScript errors...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed. Please fix the errors before deploying.
    pause
    exit /b 1
)

echo [INFO] Checking environment variables...
if exist ".env" (
    echo [SUCCESS] Local .env file found
    findstr "VITE_" .env 2>nul || echo [WARNING] No VITE_ environment variables found in .env
) else (
    echo [WARNING] No local .env file found
)

echo [INFO] Checking vercel.json configuration...
if exist "vercel.json" (
    echo [SUCCESS] vercel.json found
    type vercel.json
) else (
    echo [WARNING] vercel.json not found
)

echo.
echo [SUCCESS] 🎉 Deployment preparation completed!
echo.
echo 📋 Next steps:
echo 1. Push your changes to GitHub:
echo    git add .
echo    git commit -m "Fix deployment issues"
echo    git push origin main
echo.
echo 2. Check Vercel dashboard for deployment status
echo.
echo 3. Verify environment variables in Vercel:
echo    - VITE_API_URL=https://janu-ecommerce-backend.onrender.com/api
echo    - VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
echo    - VITE_WHATSAPP_NUMBER=+919391235258
echo    - VITE_INSTAGRAM_URL=https://www.instagram.com/janucollectionvizag/
echo    - VITE_FACEBOOK_URL=https://www.facebook.com/janucollectionvizag
echo    - VITE_YOUTUBE_URL=https://www.youtube.com/@Janucollectionvizag
echo.
echo 4. Test your deployment at your Vercel URL
echo.
echo 5. If issues persist, check the deployment logs in Vercel dashboard
echo.
pause 