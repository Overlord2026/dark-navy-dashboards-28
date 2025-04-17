
#!/bin/bash

echo "Starting context import path updates..."

# Find all TypeScript/JavaScript files
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | while read -r file; do
    # Replace @/context/ with @/contexts/
    sed -i 's|@/context/|@/contexts/|g' "$file"
    
    # Also handle cases where the import might be relative
    sed -i 's|from "\.\./context/|from "../contexts/|g' "$file"
    sed -i "s|from '\.\./context/|from '../contexts/|g" "$file"
done

echo "Context import paths updated successfully!"
