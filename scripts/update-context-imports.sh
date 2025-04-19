
#!/bin/bash

echo "Starting comprehensive context import path updates..."

# Find all TypeScript/JavaScript/TSX/JSX files
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | while read -r file; do
    # Replace absolute imports from @/context/ to @/contexts/
    sed -i 's|@/context/|@/contexts/|g' "$file"
    
    # Replace relative imports from ../context/ to ../contexts/
    sed -i 's|"../context/|"../contexts/|g' "$file"
    sed -i "s|'../context/|'../contexts/|g" "$file"
    
    # Replace ./context/ with ./contexts/
    sed -i 's|"./context/|"./contexts/|g' "$file"
    sed -i "s|'./context/|'../contexts/|g" "$file"
done

echo "Context import paths updated successfully!"
