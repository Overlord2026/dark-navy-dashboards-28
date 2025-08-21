#!/usr/bin/env node

/**
 * Simple script to find and report unused imports
 * This is a basic implementation - consider using tools like ESLint with unused-imports plugin for production
 */

const fs = require('fs');
const path = require('path');

function findUnusedImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const unusedImports = [];
  
  lines.forEach((line, index) => {
    // Simple regex to find import statements
    const importMatch = line.match(/^import\s+(.+?)\s+from\s+['"`](.+?)['"`]/);
    if (importMatch) {
      const importedItems = importMatch[1];
      const moduleName = importMatch[2];
      
      // Extract individual imports (this is a simplified approach)
      const namedImports = importedItems.match(/\{([^}]+)\}/);
      if (namedImports) {
        const imports = namedImports[1].split(',').map(item => item.trim());
        imports.forEach(importItem => {
          // Remove 'as alias' part if present
          const cleanImport = importItem.split(' as ')[0].trim();
          // Check if import is used in the file (very basic check)
          const isUsed = content.includes(cleanImport) && 
                        content.split('\n').slice(index + 1).some(laterLine => 
                          laterLine.includes(cleanImport)
                        );
          
          if (!isUsed && !cleanImport.includes('type ')) {
            unusedImports.push({
              line: index + 1,
              import: cleanImport,
              module: moduleName
            });
          }
        });
      }
    }
  });
  
  return unusedImports;
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let allUnusedImports = [];
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      allUnusedImports = allUnusedImports.concat(scanDirectory(fullPath));
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const unusedImports = findUnusedImports(fullPath);
      if (unusedImports.length > 0) {
        allUnusedImports.push({
          file: fullPath,
          unused: unusedImports
        });
      }
    }
  });
  
  return allUnusedImports;
}

// Run the scan
const srcDir = path.join(__dirname, '../src');
const results = scanDirectory(srcDir);

if (results.length === 0) {
  console.log('✅ No obvious unused imports found!');
} else {
  console.log('⚠️  Potential unused imports found:');
  results.forEach(result => {
    console.log(`\n📄 ${result.file}:`);
    result.unused.forEach(item => {
      console.log(`  Line ${item.line}: ${item.import} from '${item.module}'`);
    });
  });
  console.log('\n💡 Note: This is a basic check. Please verify manually and use ESLint for comprehensive analysis.');
}