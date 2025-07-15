# Healthcare Module Transfer Scripts

This directory contains scripts to transfer the healthcare module files to your main project.

## Platform Support

### Windows (PowerShell)
```powershell
# Run in PowerShell
.\healthcare-export\utils\file-transfer.ps1
```

### Unix/Linux/macOS (Bash)
```bash
# Make executable and run
chmod +x healthcare-export/utils/file-transfer.sh
./healthcare-export/utils/file-transfer.sh
```

## What the Scripts Do

Both scripts perform the same operations:

1. **Create Directory Structure**: Set up the necessary folder hierarchy
2. **Copy Type Definitions**: Transfer TypeScript interfaces and types
3. **Copy React Hooks**: Move custom healthcare hooks
4. **Copy Components**: Transfer all UI components
5. **Copy Pages**: Move page-level components
6. **Copy Services**: Transfer API and utility services

## Directory Structure Created

```
src/
├── types/healthcare/           # TypeScript definitions
├── hooks/healthcare/           # Custom React hooks
├── components/healthcare/      # UI components
├── pages/healthcare/          # Page components
└── services/healthcare/       # API services
```

## Error Handling

Both scripts include error handling for missing source directories and will gracefully skip any missing components while still copying available files.

## Next Steps

After running either script:

1. **Database Setup**: Run `database-schema.sql` in Supabase
2. **Route Configuration**: Add healthcare routes to your router
3. **Navigation**: Update your app navigation
4. **Dependencies**: Install any missing packages

See `COPY_PASTE_GUIDE.md` for detailed integration instructions.