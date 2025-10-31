#!/bin/bash

# RSS Feeder - Cloudflare Pages Deploy Script
echo "🚀 Building RSS Feeder for deployment..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building production version..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📂 Your built app is in the 'dist' folder"
    echo ""
    echo "🌐 To deploy to Cloudflare Pages:"
    echo "1. Go to https://pages.cloudflare.com"
    echo "2. Create new project → Upload assets"
    echo "3. Drag and drop the 'dist' folder"
    echo "4. Your RSS Feeder will be live!"
    echo ""
    echo "💡 Pro tip: Connect to Git for automatic deployments"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
