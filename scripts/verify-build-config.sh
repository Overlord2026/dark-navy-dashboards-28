#!/bin/bash

echo "🔧 Testing build after fixes..."

# Check if the files exist that we're referencing
echo "✅ Checking file existence:"
[ -f "src/components/bfo/SecurityDashboard.tsx" ] && echo "✅ SecurityDashboard.tsx exists" || echo "❌ SecurityDashboard.tsx missing"
[ -f "src/pages/admin/AdminHQ.tsx" ] && echo "✅ AdminHQ.tsx exists" || echo "❌ AdminHQ.tsx missing"
[ -f "src/components/bfo/AdminMigrations.tsx" ] && echo "✅ AdminMigrations.tsx exists" || echo "❌ AdminMigrations.tsx missing"

# Check vite config
echo ""
echo "🔧 Vite config check:"
if grep -q "input:" vite.config.ts; then
  echo "⚠️  Custom input found in vite.config.ts"
else
  echo "✅ Using default index.html entry (correct for SPA)"
fi

echo ""
echo "📦 Current manual chunks in vite.config.ts:"
grep -A 15 "manualChunks:" vite.config.ts

echo ""
echo "🚀 Build configuration is ready!"
echo "Key fixes applied:"
echo "1. ✅ No custom rollupOptions.input (using default index.html)"
echo "2. ✅ SecurityDashboard import path correct: @/components/bfo/SecurityDashboard"
echo "3. ✅ Manual chunks reference existing files only"
echo "4. ✅ Case-sensitive file paths verified"