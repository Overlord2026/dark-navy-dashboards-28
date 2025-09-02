#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROTECTED_PATHS = [
  'src/auth/**',
  'src/providers/**', 
  'src/pages/*/Onboard*',
  'src/pages/*/Home*',
  'src/components/auth/**',
  'supabase/migrations/**'
];

function expandGlob(pattern) {
  try {
    // Use find command to expand glob patterns
    const result = execSync(`find . -path "./${pattern}" 2>/dev/null || true`, { encoding: 'utf8' });
    return result.trim().split('\n').filter(f => f && f !== '.');
  } catch (e) {
    return [];
  }
}

function getChangedFiles() {
  try {
    // Get changed files from git (staged + unstaged)
    const staged = execSync('git diff --cached --name-only 2>/dev/null || true', { encoding: 'utf8' });
    const unstaged = execSync('git diff --name-only 2>/dev/null || true', { encoding: 'utf8' });
    const untracked = execSync('git ls-files --others --exclude-standard 2>/dev/null || true', { encoding: 'utf8' });
    
    const allChanged = [
      ...staged.trim().split('\n'),
      ...unstaged.trim().split('\n'),
      ...untracked.trim().split('\n')
    ].filter(f => f && f.length > 0);
    
    return [...new Set(allChanged)];
  } catch (e) {
    console.warn('Warning: Could not detect git changes, skipping protection check');
    return [];
  }
}

function main() {
  const migrationAllowed = process.env.MIGRATION_ALLOWED === 'true';
  
  // Create output directory
  const outDir = path.join(process.cwd(), 'out', 'protect');
  fs.mkdirSync(outDir, { recursive: true });
  
  // Write protected paths list
  fs.writeFileSync(
    path.join(outDir, 'Protected_Paths.json'),
    JSON.stringify({ protected_paths: PROTECTED_PATHS, migration_allowed: migrationAllowed }, null, 2)
  );
  
  if (migrationAllowed) {
    console.log('✅ Protection bypassed (MIGRATION_ALLOWED=true)');
    return;
  }
  
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log('✅ No changes detected, protection check passed');
    return;
  }
  
  // Check each protected pattern
  const violations = [];
  
  for (const pattern of PROTECTED_PATHS) {
    const protectedFiles = expandGlob(pattern);
    
    for (const changedFile of changedFiles) {
      if (protectedFiles.some(pf => pf.includes(changedFile) || changedFile.includes(pf.replace('./', '')))) {
        violations.push({ pattern, file: changedFile });
      }
    }
  }
  
  if (violations.length > 0) {
    console.error('🚫 BUILD PROTECTION: Changes detected in protected paths!');
    console.error('\nViolations:');
    violations.forEach(v => {
      console.error(`  ${v.pattern} -> ${v.file}`);
    });
    console.error('\nTo bypass protection, set MIGRATION_ALLOWED=true');
    console.error('Protected paths are listed in: out/protect/Protected_Paths.json');
    process.exit(1);
  }
  
  console.log('✅ Protection check passed');
}

if (require.main === module) {
  main();
}