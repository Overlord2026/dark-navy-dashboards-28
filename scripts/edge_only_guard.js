const fs = require("fs");
const path = require("path");

const bad = [];

// Get all TypeScript/TSX files in src directory
function getSourceFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getSourceFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const sourceFiles = getSourceFiles('src');

for (const file of sourceFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for service role violations
    if (/SUPABASE_SERVICE_ROLE_KEY|service_role/.test(content)) {
      bad.push(`${file}: Contains service_role references`);
    }
    
    // Check for external fetch calls (excluding /functions/v1/)
    if (/fetch\(['"]https?:\/\//.test(content) && !/\/functions\/v1\//.test(content)) {
      bad.push(`${file}: Contains external fetch calls`);
    }
    
    // Check for direct createClient imports
    if (/import.*createClient.*from.*@supabase\/supabase-js/.test(content) && 
        !file.includes('supabaseClient.ts')) {
      bad.push(`${file}: Direct createClient import - use src/lib/supabaseClient.ts`);
    }
    
  } catch (error) {
    console.warn(`Warning: Could not read file ${file}:`, error.message);
  }
}

if (bad.length) {
  console.error("Edge-only violations found:");
  bad.forEach(violation => console.error(`  ❌ ${violation}`));
  console.error("\nAll external API calls must go through Supabase Edge Functions.");
  console.error("Use callEdgeJSON() from src/services/aiEdge.ts instead.");
  process.exit(1);
} else {
  console.log("✅ Edge-only guard passed - no violations found");
}