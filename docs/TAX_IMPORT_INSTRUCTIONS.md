# Tax Tools Import Instructions

**Branch**: feat/tax-tools-intake  
**Target**: Neptune React Orbit integration as source-only module

## Git Integration Options

### Option A: Git Submodule (Recommended)
```bash
git checkout -b feat/tax-tools-intake
git submodule add -b main https://github.com/Overlord2026/neptune-react-orbit packages/tax-tools
git commit -m "chore: add tax-tools submodule (source-only)"
```

### Option B: Git Subtree (Alternative)
```bash
git remote add tax https://github.com/Overlord2026/neptune-react-orbit.git
git subtree add --prefix=packages/tax-tools tax main --squash
# Later updates: git subtree pull --prefix=packages/tax-tools tax main --squash
```

## Post-Import Steps

1. **Update Vite Config**: Ensure `@tax` alias points to `packages/tax-tools/src/*`
2. **Replace TODO Pages**: Import calculators will automatically replace TODO pages in `/tax/*`
3. **Component Mapping**: Map Neptune components to existing route structure

## Import Checklist

- [ ] QSBS Calculator → `/tax/qsbs`
- [ ] Appreciated Stock → `/tax/appreciated-stock` 
- [ ] Basis Planning → `/tax/basis-planning`
- [ ] Loss Harvesting → `/tax/loss-harvest`
- [ ] Donor Advised Fund → `/tax/daf`
- [ ] Tax Return Analyzer → `/tax/tax-return-analyzer`
- [ ] Social Security Tax → `/tax/social-security`

## Integration Status

**Ready**: Roth Conversion, NUA, Bracket Manager (using existing components)  
**TODO**: 7 calculators awaiting Neptune source import  
**Partial**: Charitable Gift (enhance existing modal)

## QA Verification

- [ ] `/tax` → Launcher shows calculator grid
- [ ] Sidebar navigation works
- [ ] Active calculators render correctly  
- [ ] TODO pages show proper placeholders
- [ ] No conflicts with Families routes
- [ ] Build/typecheck passes