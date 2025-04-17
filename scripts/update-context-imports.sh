
#!/bin/bash

echo "Starting context import path updates..."

# Find all TypeScript/JavaScript files
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | while read -r file; do
    # Replace @/context/ with @/contexts/ (absolute imports)
    sed -i 's|@/context/|@/contexts/|g' "$file"
    
    # Replace "../context/" with "../contexts/" (relative imports)
    sed -i 's|"../context/|"../contexts/|g' "$file"
    sed -i "s|'../context/|'../contexts/|g" "$file"
    
    # Replace "./context/" with "./contexts/" (relative imports)
    sed -i 's|"./context/|"./contexts/|g' "$file"
    sed -i "s|'./context/|'./contexts/|g" "$file"
end

echo "Context import paths updated successfully!"
echo "Please run 'npm run dev' to verify the changes"
