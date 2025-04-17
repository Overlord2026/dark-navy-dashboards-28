
#!/bin/bash

# Find all files in src directory
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
    # Replace '@/context/' with '@/contexts/' in import statements
    sed -i 's|@/context/\([^"'\'']*\)|@/contexts/\1|g' "$file"
done

echo "Context import paths updated successfully!"
