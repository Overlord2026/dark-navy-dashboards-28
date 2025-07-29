#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const srcDir = './src';
const patterns = [
  '**/*.{ts,tsx,js,jsx}',
];

// Console methods to remove/guard
const consoleMethods = [
  'console.log',
  'console.debug', 
  'console.info',
  'console.warn',
  'console.error',
  'console.trace',
  'console.time',
  'console.timeEnd',
  'console.group',
  'console.groupEnd',
];

// Files to preserve console logs (for error handling)
const preserveFiles = [
  'src/services/logging/',
  'src/services/security/',
  'src/services/diagnostics/',
];

// Create development guard wrapper
const devGuard = (consoleStatement) => {
  return `if (import.meta.env.DEV) {\n    ${consoleStatement}\n  }`;
};

// Process a single file
function processFile(filePath) {
  // Check if file should be preserved
  if (preserveFiles.some(preserve => filePath.includes(preserve))) {
    console.log(`Preserving: ${filePath}`);
    return { processed: false, reason: 'preserved' };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  let originalContent = content;

  // Remove standalone console statements
  consoleMethods.forEach(method => {
    // Match console statements with proper indentation
    const regex = new RegExp(`^(\\s*)${method.replace('.', '\\.')}\\([^;]*\\);?$`, 'gm');
    
    content = content.replace(regex, (match, indent) => {
      changes++;
      // For errors, wrap in dev guard instead of removing
      if (method === 'console.error' || method === 'console.warn') {
        return `${indent}${devGuard(match.trim())}`;
      }
      // Remove debug/log statements entirely
      return '';
    });
  });

  // Clean up empty lines (more than 2 consecutive)
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    return { processed: true, changes };
  }

  return { processed: false, reason: 'no-changes' };
}

// Main execution
async function main() {
  console.log('🧹 Starting console log cleanup for production...\n');

  const files = glob.sync(patterns.map(p => path.join(srcDir, p)).join(','), {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
  });

  let totalProcessed = 0;
  let totalChanges = 0;
  let preserved = 0;

  files.forEach(file => {
    const result = processFile(file);
    
    if (result.processed) {
      console.log(`✅ Processed: ${file} (${result.changes} changes)`);
      totalProcessed++;
      totalChanges += result.changes;
    } else if (result.reason === 'preserved') {
      preserved++;
    }
  });

  console.log('\n📊 Console Log Cleanup Summary:');
  console.log(`Files scanned: ${files.length}`);
  console.log(`Files processed: ${totalProcessed}`);
  console.log(`Files preserved: ${preserved}`);
  console.log(`Total console statements removed/guarded: ${totalChanges}`);
  console.log('\n🎉 Production console log cleanup complete!');
  
  // Verify no debug logs remain in production build
  console.log('\n🔍 Verifying clean build...');
  
  const remainingLogs = [];
  files.forEach(file => {
    if (!preserveFiles.some(preserve => file.includes(preserve))) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/console\.(log|debug|info)(?!\s*&&\s*import\.meta\.env\.DEV)/g);
      if (matches) {
        remainingLogs.push({ file, count: matches.length });
      }
    }
  });

  if (remainingLogs.length === 0) {
    console.log('✅ Clean build verified - no debug logs remain in production code!');
  } else {
    console.log('⚠️  Warning: Some console logs may still remain:');
    remainingLogs.forEach(({ file, count }) => {
      console.log(`  ${file}: ${count} statements`);
    });
  }
}

main().catch(console.error);