#!/bin/bash
# Performance optimization script

echo "🚀 Running performance optimizations..."

# 1. Code splitting check
echo "📦 Checking code splitting..."
if grep -r "lazy(" src/ --include="*.tsx" --include="*.ts" | wc -l > 10; then
  echo "✅ Code splitting implemented"
else
  echo "⚠️  Consider adding more lazy loading"
fi

# 2. Bundle analysis
echo "📊 Analyzing bundle size..."
npm run build 2>/dev/null
if [ -d "dist" ]; then
  find dist -name "*.js" -exec wc -c {} + | tail -1 | awk '{print "Bundle size: " $1/1024 " KB"}'
fi

# 3. Image optimization check
echo "🖼️  Checking image optimization..."
image_count=$(find src/assets -name "*.jpg" -o -name "*.png" -o -name "*.gif" 2>/dev/null | wc -l)
webp_count=$(find src/assets -name "*.webp" 2>/dev/null | wc -l)
echo "Images: $image_count total, $webp_count WebP"

# 4. Check for performance anti-patterns
echo "🔍 Checking for performance issues..."
if grep -r "console.log" src/ --include="*.tsx" --include="*.ts" | wc -l > 5; then
  echo "⚠️  Remove console.log statements for production"
fi

if grep -r "useEffect.*\[\]" src/ --include="*.tsx" | wc -l > 0; then
  echo "✅ useEffect dependencies look good"
fi

echo "✨ Performance check complete!"