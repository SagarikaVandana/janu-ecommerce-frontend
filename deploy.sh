#!/bin/bash

# 🚀 Janu Collections Deployment Script
echo "🚀 Starting Janu Collections deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the frontend directory."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

print_status "Checking npm version..."
NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Checking for TypeScript errors..."
if npm run build 2>&1 | grep -q "error"; then
    print_error "TypeScript errors found. Please fix them before deploying."
    npm run build
    exit 1
else
    print_success "No TypeScript errors found"
fi

print_status "Building for production..."
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

print_status "Testing production build..."
if npm run preview &> /dev/null; then
    print_success "Production build test passed"
else
    print_warning "Could not test production build (preview server)"
fi

print_status "Checking environment variables..."
if [ -f ".env" ]; then
    print_success "Local .env file found"
    cat .env | grep VITE_ || print_warning "No VITE_ environment variables found in .env"
else
    print_warning "No local .env file found"
fi

print_status "Checking vercel.json configuration..."
if [ -f "vercel.json" ]; then
    print_success "vercel.json found"
    cat vercel.json
else
    print_warning "vercel.json not found"
fi

print_status "Checking API connectivity..."
if curl -s --max-time 10 https://janu-ecommerce-backend.onrender.com/api/health > /dev/null; then
    print_success "Backend API is accessible"
else
    print_warning "Backend API might not be accessible"
fi

echo ""
print_success "🎉 Deployment preparation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix deployment issues'"
echo "   git push origin main"
echo ""
echo "2. Check Vercel dashboard for deployment status"
echo ""
echo "3. Verify environment variables in Vercel:"
echo "   - VITE_API_URL=https://janu-ecommerce-backend.onrender.com/api"
echo "   - VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key"
echo "   - VITE_WHATSAPP_NUMBER=+919391235258"
echo "   - VITE_INSTAGRAM_URL=https://www.instagram.com/janucollectionvizag/"
echo "   - VITE_FACEBOOK_URL=https://www.facebook.com/janucollectionvizag"
echo "   - VITE_YOUTUBE_URL=https://www.youtube.com/@Janucollectionvizag"
echo ""
echo "4. Test your deployment at your Vercel URL"
echo ""
echo "5. If issues persist, check the deployment logs in Vercel dashboard" 