# Patch Log

## 2025-09-19 - Toast Provider Hotfix

**Issue**: Radix ToastProvider causing "useState of null" runtime crash on app boot.

**Solution**: Hotfix - swapped Radix ToastProvider for SafeToastProvider (lazy Toaster only) to unblock runtime crash. No dependency changes.

**Files Changed**:
- Created `src/providers/SafeToastProvider.tsx`
- Modified `src/main.tsx` - replaced ToastProvider with SafeToastProvider  
- Modified `src/components/ui/toaster.tsx` - removed internal ToastProvider wrapper

**Impact**: Maintains toast functionality while preventing crash. Reversible change that doesn't modify package.json.

## 2025-09-19 - React Version Lock & Deduplication

**Issue**: Ensure single React instance to prevent "useState of null" and other React duplicate issues.

**Solution**: Lock React to exact 18.3.1, verify Vite deduplication already configured, and test build stability.

**Files Changed**:
- Updated React dependency to exact version 18.3.1 (removing caret)
- Verified `vite.config.ts` dedupe configuration already optimal
- Confirmed `optimizeDeps` includes React packages properly

**Impact**: Ensures consistent React resolution across all dependencies. Build stability improved.