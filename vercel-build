#!/bin/bash

set -e

echo "🚀 Starting Vercel build process..."

# Fix permissions for all binaries
echo "🔧 Fixing permissions..."
if [ -d "node_modules/.bin" ]; then
    find node_modules/.bin -type f -exec chmod +x {} \; 2>/dev/null || true
    echo "✅ Fixed permissions for binaries"
else
    echo "⚠️ node_modules/.bin directory not found"
fi

# Try multiple build approaches
echo "🔨 Attempting build..."

# Method 1: npx vite build
if command -v npx >/dev/null 2>&1; then
    echo "🔄 Trying npx vite build..."
    if npx vite build; then
        echo "✅ Build completed successfully with npx!"
        exit 0
    fi
fi

# Method 2: Direct vite command
if [ -f "node_modules/.bin/vite" ]; then
    echo "🔄 Trying direct vite command..."
    if node node_modules/.bin/vite build; then
        echo "✅ Build completed successfully with direct vite!"
        exit 0
    fi
fi

# Method 3: Using npm run build:direct
echo "🔄 Trying npm run build:direct..."
if npm run build:direct; then
    echo "✅ Build completed successfully with npm run build:direct!"
    exit 0
fi

echo "❌ All build methods failed"
exit 1 