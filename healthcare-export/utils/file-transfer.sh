#!/bin/bash

# Healthcare Module File Transfer Script
# This script copies the healthcare module files to the main project structure

echo "🏥 Healthcare Module File Transfer Starting..."

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p src/types/healthcare
mkdir -p src/hooks/healthcare  
mkdir -p src/components/healthcare
mkdir -p src/pages/healthcare
mkdir -p src/services/healthcare

# Copy type definitions
echo "📝 Copying type definitions..."
cp -r healthcare-export/types/* src/types/healthcare/ 2>/dev/null || echo "Types directory not found, skipping..."

# Copy hooks
echo "🎣 Copying healthcare hooks..."
cp healthcare-export/hooks/healthcare/* src/hooks/healthcare/ 2>/dev/null || echo "Hooks directory not found, skipping..."

# Copy components
echo "🧩 Copying healthcare components..."
cp healthcare-export/components/* src/components/healthcare/ 2>/dev/null || echo "Components directory not found, skipping..."

# Copy pages
echo "📄 Copying healthcare pages..."
cp healthcare-export/pages/* src/pages/healthcare/ 2>/dev/null || echo "Pages directory not found, skipping..."

# Copy services
echo "⚙️ Copying healthcare services..."
cp healthcare-export/services/* src/services/healthcare/ 2>/dev/null || echo "Services directory not found, skipping..."

# Make scripts executable
echo "🔧 Setting up executable permissions..."
chmod +x healthcare-export/utils/*.sh 2>/dev/null || echo "No additional scripts found"

echo "✅ Healthcare module files copied successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Run the database schema in your Supabase SQL editor"
echo "2. Add healthcare routes to your routing configuration"
echo "3. Update your navigation to include healthcare links" 
echo "4. Install required dependencies if not already installed"
echo ""
echo "📚 See COPY_PASTE_GUIDE.md for detailed integration instructions"
echo "🚀 Your healthcare module is ready to use!"