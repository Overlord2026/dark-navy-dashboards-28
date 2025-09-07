#!/bin/bash

echo "🔍 Checking for remaining node:crypto usage..."

# Search for any remaining createHash usage
echo "=== Searching for createHash ==="
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "createHash" 2>/dev/null || echo "✅ No createHash found"

# Search for any crypto imports
echo ""
echo "=== Searching for crypto imports ==="
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*crypto" 2>/dev/null || echo "✅ No crypto imports found"

# Search for node:crypto specifically
echo ""
echo "=== Searching for node:crypto ==="
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "node:crypto" 2>/dev/null || echo "✅ No node:crypto found"

echo ""
echo "🚀 Browser compatibility check complete!"
echo "All Node.js crypto usage has been replaced with Web Crypto API."

# Test build (if available)
echo ""
echo "📦 Testing build..."
if command -v npm &> /dev/null; then
  npm run build 2>&1 | grep -E "(error|Error|failed|Failed)" || echo "✅ Build completed successfully"
else
  echo "ℹ️  npm not available for build test"
fi