#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Fix permissions for all binaries
if [ -d "node_modules/.bin" ]; then
    echo "🔧 Fixing permissions for binaries..."
    chmod +x node_modules/.bin/* 2>/dev/null || true
fi

# Try different build approaches
echo "🔨 Running build..."

# First try: npx vite build
if npx vite build; then
    echo "✅ Build completed successfully with npx!"
    exit 0
fi

# Second try: direct vite command
if [ -f "node_modules/.bin/vite" ]; then
    echo "🔄 Trying direct vite command..."
    if node node_modules/.bin/vite build; then
        echo "✅ Build completed successfully with direct vite!"
        exit 0
    fi
fi

# Third try: using npm run build:direct
echo "🔄 Trying npm run build:direct..."
if npm run build:direct; then
    echo "✅ Build completed successfully with npm run build:direct!"
    exit 0
fi

echo "❌ All build methods failed"
exit 1 