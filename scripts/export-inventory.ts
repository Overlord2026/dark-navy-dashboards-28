#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InventoryData {
  personas: {
    db: any[];
    code_persona_kinds: string[];
    configurations: Record<string, any>;
  };
  menus: {
    mega_menu: any;
    persona_links: any;
  };
  routes: {
    discovered: {
      services: string[];
      solutions: string[];
      pros: string[];
      families: string[];
      healthcare: string[];
      realestate: string[];
    };
    missing: string[];
  };
  tools: Record<string, boolean>;
  metadata: {
    timestamp: string;
    version: string;
    environment: string;
  };
}

async function fetchInventory(): Promise<InventoryData> {
  const baseUrl = process.env.INVENTORY_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/inventory`;
  
  console.log(`Fetching inventory from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`API Error: ${data.error} - ${data.message}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }
    throw new Error('Failed to fetch inventory: Unknown error');
  }
}

async function generateManifest(inventory: InventoryData): Promise<string> {
  return JSON.stringify(inventory, null, 2);
}

async function generateMarkdownReport(inventory: InventoryData): Promise<string> {
  const { personas, menus, routes, tools, metadata } = inventory;
  
  const markdown = `# Persona Service Tool Inventory

*Generated on ${new Date(metadata.timestamp).toLocaleString()}*

## Overview

This document provides a comprehensive inventory of the persona system, services, tools, and infrastructure for my.bfocfo.com.

**Environment:** ${metadata.environment}  
**Version:** ${metadata.version}

## Personas

### Database Personas (${personas.db.length} found)

${personas.db.length > 0 
  ? personas.db.map(p => `- **${p.persona_kind}** (ID: ${p.id})`).join('\n')
  : '*No personas found in database*'
}

### Code Persona Kinds (${personas.code_persona_kinds.length} defined)

#### Family Personas
${personas.code_persona_kinds
  .filter(k => k.startsWith('family_'))
  .map(k => `- **${k}**: ${personas.configurations[k]?.label || 'Unknown'} - ${personas.configurations[k]?.description || 'No description'}`)
  .join('\n')}

#### Professional Personas
${personas.code_persona_kinds
  .filter(k => k.startsWith('pro_'))
  .map(k => `- **${k}**: ${personas.configurations[k]?.label || 'Unknown'} - ${personas.configurations[k]?.description || 'No description'}`)
  .join('\n')}

## Navigation Structure

### Mega Menu Sections
${Object.entries(menus.mega_menu).map(([key, section]) => 
  `- **${section.title}**: ${section.sections.length} section(s), ${section.sections.reduce((acc, s) => acc + s.items.length, 0)} total items`
).join('\n')}

### Persona-Specific Links
${Object.entries(menus.persona_links).map(([persona, links]) => 
  `- **${persona}**: ${links.length} quick links`
).join('\n')}

## Discovered Routes

### Services (${routes.discovered.services.length} found)
${routes.discovered.services.length > 0 
  ? routes.discovered.services.map(r => `- ${r}`).join('\n')
  : '*No service routes found*'
}

### Solutions (${routes.discovered.solutions.length} found)
${routes.discovered.solutions.length > 0 
  ? routes.discovered.solutions.map(r => `- ${r}`).join('\n')
  : '*No solution routes found*'
}

### Professional Routes (${routes.discovered.pros.length} found)
${routes.discovered.pros.length > 0 
  ? routes.discovered.pros.map(r => `- ${r}`).join('\n')
  : '*No professional routes found*'
}

### Family Routes (${routes.discovered.families.length} found)
${routes.discovered.families.length > 0 
  ? routes.discovered.families.map(r => `- ${r}`).join('\n')
  : '*No family routes found*'
}

### Healthcare Routes (${routes.discovered.healthcare.length} found)
${routes.discovered.healthcare.length > 0 
  ? routes.discovered.healthcare.map(r => `- ${r}`).join('\n')
  : '*No healthcare routes found*'
}

### Real Estate Routes (${routes.discovered.realestate.length} found)
${routes.discovered.realestate.length > 0 
  ? routes.discovered.realestate.map(r => `- ${r}`).join('\n')
  : '*No real estate routes found*'
}

## Missing Routes

${routes.missing.length > 0 
  ? `The following expected routes were not found:\n${routes.missing.map(r => `- ❌ ${r}`).join('\n')}`
  : '✅ All expected routes are present'
}

## Available Tools

${Object.entries(tools).map(([tool, available]) => 
  `- ${available ? '✅' : '❌'} **${tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}**`
).join('\n')}

## Integration Status

### Core Components
- **Persona System**: ${personas.code_persona_kinds.length > 0 ? '✅ Implemented' : '❌ Missing'}
- **Trust Scoring**: ${tools.trust_scoring ? '✅ Implemented' : '❌ Missing'}
- **Navigation**: ${Object.keys(menus.mega_menu).length > 0 ? '✅ Implemented' : '❌ Missing'}
- **Branding**: ${tools.brand_banner ? '✅ Implemented' : '❌ Missing'}

### Healthcare Sub-tracks
- **Influencer Tools**: ${routes.discovered.healthcare.some(r => r.includes('influencer')) ? '✅ Available' : '⚠️ Needs implementation'}
- **Clinic/Testing**: ${routes.discovered.healthcare.some(r => r.includes('clinic') || r.includes('testing')) ? '✅ Available' : '⚠️ Needs implementation'}
- **Care Navigation**: ${routes.discovered.healthcare.some(r => r.includes('navigation') || r.includes('care-plans')) ? '✅ Available' : '⚠️ Needs implementation'}
- **Pharmacy Tools**: ${routes.discovered.healthcare.some(r => r.includes('pharmacy') || r.includes('vaccine')) ? '✅ Available' : '⚠️ Needs implementation'}

### Real Estate
- **Realtor Tools**: ${routes.discovered.realestate.length > 0 ? '✅ Available' : '⚠️ Needs implementation'}
- **Property Management**: ${routes.discovered.realestate.some(r => r.includes('property')) ? '✅ Available' : '⚠️ Needs implementation'}

## Action Items

### High Priority
${routes.missing.length > 0 ? `- [ ] Implement missing routes (${routes.missing.length} total)` : ''}
${!tools.trust_scoring ? '- [ ] Complete trust scoring implementation' : ''}
${personas.db.length === 0 ? '- [ ] Seed database with persona data' : ''}

### Medium Priority
${routes.discovered.healthcare.length === 0 ? '- [ ] Create healthcare workflow pages' : ''}
${routes.discovered.realestate.length === 0 ? '- [ ] Create real estate workflow pages' : ''}
- [ ] Add persona switching instrumentation
- [ ] Implement trust score job scheduler

### Low Priority
- [ ] Add more comprehensive route validation
- [ ] Enhance persona link customization
- [ ] Add user analytics integration

---

*This inventory was automatically generated from the BFO CFO system. For questions or updates, see the \`scripts/export-inventory.ts\` file.*
`;

  return markdown;
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function main(): Promise<void> {
  try {
    console.log('🔍 Fetching inventory data...');
    const inventory = await fetchInventory();
    
    console.log('📋 Generating manifest...');
    const manifest = await generateManifest(inventory);
    
    console.log('📝 Generating markdown report...');
    const markdownReport = await generateMarkdownReport(inventory);
    
    // Ensure docs directory exists
    const docsDir = path.resolve(__dirname, '../docs');
    await ensureDirectoryExists(docsDir);
    
    // Write manifest
    const manifestPath = path.join(docsDir, 'MANIFEST.persona.json');
    await fs.writeFile(manifestPath, manifest, 'utf8');
    console.log(`✅ Manifest written to: ${manifestPath}`);
    
    // Write markdown report
    const reportPath = path.join(docsDir, 'Persona_Service_Tool_Inventory.md');
    await fs.writeFile(reportPath, markdownReport, 'utf8');
    console.log(`✅ Report written to: ${reportPath}`);
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Personas: ${inventory.personas.code_persona_kinds.length} defined, ${inventory.personas.db.length} in DB`);
    console.log(`- Routes: ${Object.values(inventory.routes.discovered).reduce((acc, routes) => acc + routes.length, 0)} discovered, ${inventory.routes.missing.length} missing`);
    console.log(`- Tools: ${Object.values(inventory.tools).filter(Boolean).length}/${Object.keys(inventory.tools).length} available`);
    
    if (inventory.routes.missing.length > 0) {
      console.log('\n⚠️  Missing routes detected. See report for details.');
    }
    
    console.log('\n🎉 Inventory export completed successfully!');
    
  } catch (error) {
    console.error('❌ Export failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as exportInventory };