# React Version Lock - Required package.json Changes

Since package.json is read-only in Lovable, apply these changes manually:

## Required Changes to package.json

### 1. Fix Version Consistency in Dependencies
Change the caret prefix on react to match react-dom's exact versioning:

```json
{
  "dependencies": {
    "react": "18.3.1",        // ← Remove caret (was "^18.3.1")
    "react-dom": "18.3.1"     // ← Already correct
  }
}
```

### 2. Add `resolutions` Field (for Yarn compatibility)
Add this new top-level field alongside existing `overrides`:

```json
{
  "overrides": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "resolutions": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

### 3. Add Verification Script
Add to the `scripts` section:

```json
{
  "scripts": {
    "check:react": "node scripts/check-single-react.js"
  }
}
```

## Testing After Changes

1. **Save package.json** - Lovable will auto-reinstall dependencies
2. **Run verification**: `npm run check:react`
3. **Expected output**: Both React and ReactDOM resolve to project root's node_modules
4. **Reload app** - Confirm no `dispatcher.useState` errors

## Why These Changes Matter

- **Exact versions**: Prevents any version drift between React and ReactDOM
- **`overrides`**: Forces npm to use specific versions for all dependencies
- **`resolutions`**: Forces Yarn to use specific versions (Yarn fallback)
- **Verification script**: Confirms single instance resolution worked

## Current Status

✅ Verification script created: `scripts/check-single-react.js`  
⏳ Awaiting manual package.json edits (file is read-only in Lovable)  
⏳ Then run `npm run check:react` to verify

## Integration with Other Projects

When integrating with Family Office Marketplace or other multi-project systems, this configuration ensures:
- No React version conflicts with peer projects
- Consistent hook behavior across integrated modules
- Eliminates "Invalid hook call" errors from duplicate React instances
