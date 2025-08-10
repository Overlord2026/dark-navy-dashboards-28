#!/usr/bin/env tsx
// BFO Global IP - Diagram Export Script
// Generates USPTO-ready diagrams and design figures

import fs from 'fs';
import path from 'path';
import { PATENT_MODULES } from '../src/config/patent-modules';

const OUTPUT_DIR = './export/ip_diagrams';
const FIGURE_DPI = 300;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mermaid diagram definitions for each patent
const DIAGRAM_DEFINITIONS = {
  // Global System Diagrams
  fig_sys_001: `
graph TB
    A[User Interface Layer] --> B[Authentication & RBAC]
    B --> C[Patent Module Router]
    C --> D[P1: Persona-Gated OS]
    C --> E[P2: SWAG Lead Score]
    C --> F[P3: Portfolio Intelligence]
    C --> G[P4: Volatility Shield]
    C --> H[P5: Private Market Alpha]
    C --> I[P6: Due Diligence AI]
    C --> J[P7: Liquidity IQ]
    C --> K[P8: Annuity Intelligence]
    C --> L[P9: Longevity Advantage AI]
    C --> M[P10: EpochVault]
    C --> N[P11: AI Executive Suite]
    C --> O[P12: IP Navigator]
    C --> P[P13: IP Guardian]
    C --> Q[P14: Compliance IQ]
    C --> R[P15: Onboarding Engine]
    
    D --> S[Shared Data Layer]
    E --> S
    F --> S
    G --> S
    H --> S
    I --> S
    J --> S
    K --> S
    L --> S
    M --> S
    N --> S
    O --> S
    P --> S
    Q --> S
    R --> S
    
    S --> T[Analytics & Events]
    S --> U[Audit & Compliance]
    S --> V[External Integrations]
  `,
  
  fig_data_002: `
graph TB
    A[Client Request] --> B[RLS Policy Check]
    B --> C{Authorized?}
    C -->|Yes| D[Data Access Layer]
    C -->|No| E[Access Denied]
    D --> F[Row Level Security]
    F --> G[Tenant Isolation]
    G --> H[Data Response]
    H --> I[Audit Log Entry]
    I --> J[Event Analytics]
  `,
  
  fig_event_003: `
graph LR
    A[User Action] --> B[Event Emitter]
    B --> C[PostHog Analytics]
    B --> D[Supabase Events]
    B --> E[Real-time Notifications]
    C --> F[Analytics Dashboard]
    D --> G[Audit Trail]
    E --> H[User Interface Updates]
  `,

  // Patent-specific diagrams
  fig_p1_001: `
graph TB
    A[User Login] --> B[Persona Detection]
    B --> C{Persona Type}
    C -->|Family| D[Family Features]
    C -->|Advisor| E[Advisor Features]
    C -->|CPA| F[CPA Features]
    C -->|Attorney| G[Attorney Features]
    C -->|Other| H[Base Features]
    D --> I[Feature Gate Check]
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J{Access Granted?}
    J -->|Yes| K[Feature Access]
    J -->|No| L[Access Denied]
  `,
  
  fig_p1_002: `
graph TB
    A[User] --> B[Role Assignment]
    B --> C[Tenant Context]
    C --> D[Permission Matrix]
    D --> E{Admin Role?}
    E -->|Yes| F[Full Access]
    E -->|No| G[Role-Based Access]
    G --> H[Resource-Level Permissions]
    H --> I[Action-Level Permissions]
  `,
  
  fig_p2_001: `
graph LR
    A[Financial Data Input] --> B[Privacy Preserving Ingestion]
    B --> C[SWAG Scoring Engine]
    C --> D[Calibrated Risk Bands]
    D --> E[Score Explanation]
    E --> F[Human Override Queue]
    F --> G[Final Score Output]
  `,
  
  fig_p3_001: `
graph TB
    A[Client Profile] --> B[Phase Detection]
    B --> C{Life Phase}
    C -->|Income Now| D[Income Constraints]
    C -->|Income Later| E[Growth Constraints]
    C -->|Legacy| F[Legacy Constraints]
    D --> G[Optimization Engine]
    E --> G
    F --> G
    G --> H[Execution Queue]
  `,
  
  fig_p4_001: `
graph LR
    A[Market Data Feed] --> B[Regime Detector]
    B --> C[Risk Assessment]
    C --> D[Throttle Controller]
    D --> E[Circuit Breaker Logic]
    E --> F{Breach Threshold?}
    F -->|Yes| G[Emergency Stop]
    F -->|No| H[Normal Operation]
  `,
  
  fig_p10_001: `
graph TB
    A[Event Trigger] --> B{Trigger Type}
    B -->|Milestone| C[Milestone Verification]
    B -->|Death| D[Death Verification]
    B -->|Anniversary| E[Date Check]
    C --> F[Access Release Logic]
    D --> F
    E --> F
    F --> G[Multi-Gen Access Policy]
    G --> H[Vault Content Release]
  `,
  
  fig_p14_001: `
graph LR
    A[Regulatory Sources] --> B[Rule Ingestion Engine]
    B --> C[Rule DSL Parser]
    C --> D[Persona Mapping]
    D --> E[Deadline Calculator]
    E --> F[Risk Score Generator]
    F --> G[Alert System]
  `
};

// Generate Mermaid diagrams
function generateMermaidDiagrams() {
  console.log('Generating Mermaid diagrams...');
  
  Object.entries(DIAGRAM_DEFINITIONS).forEach(([figureId, definition]) => {
    const outputPath = path.join(OUTPUT_DIR, `${figureId}.mmd`);
    fs.writeFileSync(outputPath, definition.trim());
    console.log(`Generated: ${figureId}.mmd`);
  });
}

// Generate figure index
function generateFigureIndex() {
  console.log('Generating figure index...');
  
  const index = {
    title: 'BFO Global IP - Figure Index',
    generated: new Date().toISOString(),
    figures: {
      global: {
        fig_sys_001: 'System Context Diagram - Overall system architecture',
        fig_data_002: 'Data Layer Security - RLS and audit trail',
        fig_event_003: 'Event Bus Architecture - Analytics and notifications'
      },
      patents: {}
    }
  };

  // Add patent-specific figures
  Object.values(PATENT_MODULES).forEach(module => {
    const patentId = module.id.toLowerCase();
    index.figures.patents[module.id] = {
      title: module.name,
      figures: {
        [`fig_${patentId}_001`]: `${module.name} - Main process flow`,
        [`fig_${patentId}_002`]: `${module.name} - Secondary processes`
      }
    };
  });

  const indexPath = path.join(OUTPUT_DIR, 'figure_index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log('Generated: figure_index.json');
}

// Generate USPTO-compliant line art specifications
function generateLineArtSpecs() {
  console.log('Generating line art specifications...');
  
  const specs = {
    format: 'PDF and SVG',
    dpi: FIGURE_DPI,
    colors: 'Black and white only',
    line_weight: '0.5pt minimum',
    margins: '1 inch on all sides',
    max_size: '8.5" x 11"',
    requirements: [
      'All text must be legible when reduced to 2/3 size',
      'Line drawings only - no photographs or grayscale',
      'Each figure must be on separate page',
      'Figure numbers must be below the figure',
      'Reference numerals must be consistent throughout'
    ]
  };
  
  const specsPath = path.join(OUTPUT_DIR, 'line_art_specifications.json');
  fs.writeFileSync(specsPath, JSON.stringify(specs, null, 2));
  console.log('Generated: line_art_specifications.json');
}

// Generate design patent figures (UI mockups)
function generateDesignFigures() {
  console.log('Generating design patent figure specifications...');
  
  const designFigures = {
    design_f20_001: {
      title: 'Founding20 Dashboard Interface',
      views: ['Front view', 'Side view', 'Top view', 'Perspective view'],
      elements: ['Navigation bar', 'Chart area', 'Control panel', 'Status indicators'],
      broken_lines: 'Environmental elements shown in broken lines'
    },
    design_ev_002: {
      title: 'EpochVault Avatar Session Interface',
      views: ['Main interface view', 'Settings panel view', 'Chat interface view'],
      elements: ['Avatar display area', 'Message input', 'Control buttons', 'Status bar'],
      broken_lines: 'Background and non-claimed elements in broken lines'
    },
    design_cq_003: {
      title: 'Compliance IQ Rule Mapping Interface',
      views: ['Rule map view', 'Detail panel view', 'Timeline view'],
      elements: ['Rule nodes', 'Connection lines', 'Filter controls', 'Legend'],
      broken_lines: 'Frame and navigation elements in broken lines'
    }
  };
  
  const designPath = path.join(OUTPUT_DIR, 'design_figures.json');
  fs.writeFileSync(designPath, JSON.stringify(designFigures, null, 2));
  console.log('Generated: design_figures.json');
}

// Main execution
async function main() {
  console.log('Starting BFO IP diagram export...');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  
  generateMermaidDiagrams();
  generateFigureIndex();
  generateLineArtSpecs();
  generateDesignFigures();
  
  console.log('\nDiagram export completed!');
  console.log(`Files generated in: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Convert .mmd files to PDF/SVG using Mermaid CLI');
  console.log('2. Review line art specifications for USPTO compliance');
  console.log('3. Create design patent drawings from UI specifications');
}

if (require.main === module) {
  main().catch(console.error);
}