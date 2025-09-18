#!/usr/bin/env node

/**
 * Build guard: Prevents NIL references from leaking into the codebase
 * Run: npm run guard:nil
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const NIL_PATTERN = /\b(NIL|offer-lock|deal\/|payout\/|creator)\b/i;
const ALLOWED_EXTENSIONS = ['.js', '.ts', '.tsx', '.jsx', '.vue', '.svelte'];
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /build/,
  /dist/,
  /\.next/,
  /coverage/,
  /test/,
  /tests/,
  /spec/,
  /\.test\./,
  /\.spec\./,
  /docs/,
  /README/,
  /\.md$/,
  /scripts\/check-nil-leaks\.mjs$/
];

function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function getAllFiles(dir, files = []) {
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const relativePath = fullPath.replace(process.cwd() + '/', '');
    
    if (shouldExcludeFile(relativePath)) continue;
    
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (ALLOWED_EXTENSIONS.includes(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function checkFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const violations = [];
    
    lines.forEach((line, index) => {
      if (NIL_PATTERN.test(line)) {
        violations.push({
          line: index + 1,
          content: line.trim(),
          file: filePath.replace(process.cwd() + '/', '')
        });
      }
    });
    
    return violations;
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
    return [];
  }
}

function main() {
  console.log('🔍 Checking for NIL reference leaks...');
  
  const srcFiles = getAllFiles('src');
  let totalViolations = 0;
  
  for (const file of srcFiles) {
    const violations = checkFile(file);
    if (violations.length > 0) {
      console.log(`\n❌ ${violations[0].file}:`);
      violations.forEach(v => {
        console.log(`   Line ${v.line}: ${v.content}`);
      });
      totalViolations += violations.length;
    }
  }
  
  if (totalViolations > 0) {
    console.log(`\n💥 Found ${totalViolations} NIL reference leak(s) in ${srcFiles.length} files`);
    console.log('❌ Build failed: Remove all NIL references before proceeding');
    process.exit(1);
  } else {
    console.log(`\n✅ No NIL leaks found in ${srcFiles.length} files`);
    console.log('🎉 Build guard passed!');
  }
}

main();