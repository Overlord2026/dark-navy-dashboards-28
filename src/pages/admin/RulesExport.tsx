import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileJson, FileSpreadsheet, Code } from 'lucide-react';
import { recordHealthRDS } from '@/features/healthcare/receipts';

// Import rules with fallbacks
let ESTATE_RULES: any = {};
let DEED_RULES: any = {};
let HEALTH_RULES: any = {};
let COUNTY_META: any = {};

try {
  ESTATE_RULES = require('@/features/estate/states/estateRules').ESTATE_RULES || {};
} catch (e) {
  console.warn('ESTATE_RULES not found');
}

try {
  DEED_RULES = require('@/features/estate/deeds/stateDeedRules').DEED_RULES || {};
} catch (e) {
  console.warn('DEED_RULES not found');
}

try {
  HEALTH_RULES = require('@/features/estate/states/healthRules').HEALTH_RULES || {};
} catch (e) {
  console.warn('HEALTH_RULES not found');
}

try {
  COUNTY_META = require('@/features/estate/deeds/countyMeta').COUNTY_META || {};
} catch (e) {
  console.warn('COUNTY_META not found');
}

function download(name: string, text: string, type = 'application/json') {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function toCSV(rows: any[], headers: string[]) {
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')].concat(
    rows.map(r => headers.map(h => esc((r as any)[h])).join(','))
  );
  return lines.join('\n');
}

async function sha256Hex(str: string) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function stringifyTs(obj: any) {
  // stable, pretty TS object with quoted keys and 2-space indents
  const entries = Object.entries(obj || {}).sort(([a], [b]) => String(a).localeCompare(String(b)));
  const parts = entries.map(([k, v]) => {
    const vPretty = JSON.stringify(v, null, 2)
      .split('\n').map((ln, i) => i === 0 ? ln : '  ' + ln).join('\n');
    return `  ${JSON.stringify(k)}: ${vPretty}`;
  });
  return `{\n${parts.join(',\n')}\n}`;
}

async function downloadCountyTs(countyMeta: any) {
  const dateIso = new Date().toISOString();
  const body = stringifyTs(countyMeta);
  const ts = `// Auto-generated from runtime at ${dateIso}\n` +
             `// Review with local recorder/counsel before production.\n` +
             `import type { CountyMetaMap } from '@/features/estate/deeds/countyMeta';\n\n` +
             `export const COUNTY_META: CountyMetaMap = ${body};\n\n` +
             `export default COUNTY_META;\n`;
  const hash = await sha256Hex(ts);
  download('countyMeta.generated.ts', ts, 'text/plain');
  
  recordHealthRDS(
    'config.county.export.ts',
    {},
    'allow',
    [`counties:${Object.keys(countyMeta || {}).length}`, `sha256:${hash.substring(0, 16)}`]
  );
  
  return { hash };
}

async function downloadTsModule(
  kind: 'ESTATE'|'DEED'|'HEALTH'|'ALL',
  body: string,
  fileName: string,
  reasonCounts: string[]
) {
  const hash = await sha256Hex(body);
  download(fileName, body, 'text/plain');
  
  recordHealthRDS(
    'config.rules.export.ts',
    {},
    'allow',
    [...reasonCounts, `sha256:${hash.substring(0, 16)}`, `kind:${kind}`]
  );
  
  return hash;
}

function makeEstateTs(map: any) {
  const dateIso = new Date().toISOString();
  const obj = stringifyTs(map);
  return `// Auto-generated from runtime at ${dateIso}
// Review with legal counsel before production.
import type { EstateRule } from '@/features/estate/states/estateRules';

export const ESTATE_RULES: Record<string, EstateRule> = ${obj};

export default ESTATE_RULES;
`;
}

function makeDeedTs(map: any) {
  const dateIso = new Date().toISOString();
  const obj = stringifyTs(map);
  return `// Auto-generated from runtime at ${dateIso}
// Review with legal counsel before production.
import type { RecordingRule } from '@/features/estate/deeds/stateDeedRules';

export const DEED_RULES: Record<string, RecordingRule> = ${obj};

export default DEED_RULES;
`;
}

function makeHealthTs(map: any) {
  const dateIso = new Date().toISOString();
  const obj = stringifyTs(map);
  return `// Auto-generated from runtime at ${dateIso}
// Review with legal counsel before production.
import type { HealthcareRule } from '@/features/estate/states/healthRules';

export const HEALTH_RULES: Record<string, HealthcareRule> = ${obj};

export default HEALTH_RULES;
`;
}

function makeAllBundleTs(params: {
  estateTsObj: string;
  deedTsObj: string;
  healthTsObj?: string;
}) {
  const dateIso = new Date().toISOString();
  const hImport = params.healthTsObj ? `import type { HealthcareRule } from '@/features/estate/states/healthRules';\n` : '';
  const hBlock  = params.healthTsObj ? `export const HEALTH_RULES: Record<string, HealthcareRule> = ${params.healthTsObj};\n` : `export const HEALTH_RULES = {} as const;\n`;
  return `// Auto-generated from runtime at ${dateIso}
// Combined bundle: ESTATE_RULES, DEED_RULES${params.healthTsObj ? ', HEALTH_RULES' : ''}
// Review with legal counsel before production.

import type { EstateRule } from '@/features/estate/states/estateRules';
import type { RecordingRule } from '@/features/estate/deeds/stateDeedRules';
${hImport}
export const ESTATE_RULES: Record<string, EstateRule> = ${params.estateTsObj};

export const DEED_RULES: Record<string, RecordingRule> = ${params.deedTsObj};

${hBlock}
export default { ESTATE_RULES, DEED_RULES, HEALTH_RULES };
`;
}

export default function RulesExport() {
  const [log, setLog] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const dateTag = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '').replace(/-/g, '');

  function summarize(obj: any) { 
    return obj ? Object.keys(obj).length : 0; 
  }

  async function doExport() {
    setLoading(true);
    try {
      const payload = {
        meta: {
          exported_at: new Date().toISOString(),
          counts: {
            estate: summarize(ESTATE_RULES),
            deed: summarize(DEED_RULES),
            health: summarize(HEALTH_RULES),
            counties: summarize(COUNTY_META)
          },
          version: 'v1'
        },
        estate_rules: ESTATE_RULES,
        deed_rules: DEED_RULES,
        health_rules: HEALTH_RULES || {},
        county_meta: COUNTY_META
      };

      const pretty = JSON.stringify(payload, null, 2);
      const min = JSON.stringify(payload);
      const hash = await sha256Hex(min);

      // Downloads - JSON files
      download(`rules_export_${dateTag}.json`, pretty, 'application/json');
      download(`rules_export_${dateTag}.min.json`, min, 'application/json');

      // CSVs (basic, for quick diffing)
      const estateRows = Object.entries(ESTATE_RULES || {}).map(([code, r]: any) => ({ 
        code, 
        cp: String(!!r.communityProperty), 
        tod: String(!!r.todPodAllowed),
        witnesses: r.witnesses || 0,
        notary: String(!!r.notaryRequired)
      }));
      
      const deedRows = Object.entries(DEED_RULES || {}).map(([code, r]: any) => ({ 
        code, 
        allowed: (r.allowed || []).join('|'), 
        eRec: String(!!r.eRecordingLikely),
        forms: (r.deedForms || []).join('|')
      }));
      
      const healthRows = Object.entries(HEALTH_RULES || {}).map(([code, r]: any) => ({ 
        code, 
        witnesses: r.witnesses || 0, 
        notary: String(!!r.notaryRequired), 
        forms: (r.healthcareForms || []).join('|'),
        ron: String(!!r.remoteNotaryAllowed)
      }));
      
      const countyRows = Object.entries(COUNTY_META || {}).map(([key, m]: any) => ({ 
        key, 
        state: m.state, 
        county: m.county, 
        top: m.topMarginIn, 
        left: m.leftMarginIn, 
        right: m.rightMarginIn, 
        bottom: m.bottomMarginIn, 
        eRec: String(!!m.eRecording), 
        providers: (m.providers || []).join('|') 
      }));

      // Download CSV files
      if (estateRows.length > 0) {
        download(`estate_rules_${dateTag}.csv`, toCSV(estateRows, ['code', 'cp', 'tod', 'witnesses', 'notary']), 'text/csv');
      }
      
      if (deedRows.length > 0) {
        download(`deed_rules_${dateTag}.csv`, toCSV(deedRows, ['code', 'allowed', 'eRec', 'forms']), 'text/csv');
      }
      
      if (healthRows.length > 0) {
        download(`health_rules_${dateTag}.csv`, toCSV(healthRows, ['code', 'witnesses', 'notary', 'forms', 'ron']), 'text/csv');
      }
      
      if (countyRows.length > 0) {
        download(`county_meta_${dateTag}.csv`, toCSV(countyRows, ['key', 'state', 'county', 'top', 'left', 'right', 'bottom', 'eRec', 'providers']), 'text/csv');
      }

      // Receipt (content-free)
      recordHealthRDS(
        'config.rules.export',
        {},
        'allow',
        [
          `estate:${estateRows.length}`, 
          `deed:${deedRows.length}`, 
          `health:${healthRows.length}`, 
          `counties:${countyRows.length}`, 
          `sha256:${hash.substring(0, 16)}`
        ]
      );

      setLog(`✅ Exported rules successfully!\n\nCounts:\n- Estate rules: ${estateRows.length}\n- Deed rules: ${deedRows.length}\n- Health rules: ${healthRows.length}\n- County metadata: ${countyRows.length}\n\nSHA256: ${hash}\n\nFiles downloaded:\n- rules_export_${dateTag}.json (pretty)\n- rules_export_${dateTag}.min.json (minified)\n- CSV files for each rule type`);

    } catch (error: any) {
      setLog(`❌ Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const counts = {
    estate: summarize(ESTATE_RULES),
    deed: summarize(DEED_RULES),
    health: summarize(HEALTH_RULES),
    counties: summarize(COUNTY_META)
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rules Export</h1>
        <p className="text-muted-foreground mt-2">
          Download the current in-memory rules as JSON (pretty + minified) and CSV files for analysis.
          Commit the JSON to source control after review for permanence.
        </p>
          </div>

          <div className="text-sm space-y-2">
            <a 
              href="/admin/rules-replace-county" 
              className="block text-primary hover:text-primary/80 underline"
            >
              Replace runtime COUNTY_META from uploaded TS/JSON →
            </a>
            <a 
              href="/admin/rules-replace-states" 
              className="block text-primary hover:text-primary/80 underline"
            >
              Replace runtime STATE RULES (preview & merge) →
            </a>
          </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Current Rules
          </CardTitle>
          <CardDescription>
            Downloads all rule configurations currently loaded in memory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{counts.estate}</div>
              <div className="text-sm text-muted-foreground">Estate Rules</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{counts.deed}</div>
              <div className="text-sm text-muted-foreground">Deed Rules</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{counts.health}</div>
              <div className="text-sm text-muted-foreground">Health Rules</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{counts.counties}</div>
              <div className="text-sm text-muted-foreground">Counties</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={doExport} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {loading ? 'Exporting...' : 'Export All Rules (JSON + CSV)'}
            </Button>
            
            <Button
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await downloadCountyTs(COUNTY_META);
                  setLog((prev) => (prev ? prev + '\n\n' : '') +
                    `✅ Exported COUNTY_META.ts successfully!\n\nTypeScript module generated with ${Object.keys(COUNTY_META || {}).length} counties\nSHA256: ${res.hash}\n\nFile: countyMeta.generated.ts\nReady to replace or merge into your codebase.`);
                } catch (error: any) {
                  setLog((prev) => (prev ? prev + '\n\n' : '') + `❌ County export failed: ${error.message}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export COUNTY_META.ts
            </Button>
          </div>

          {/* TypeScript Module Exports */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="secondary"
              disabled={loading}
              className="flex items-center gap-2"
              onClick={async () => {
                setLoading(true);
                try {
                  const ts = makeEstateTs(ESTATE_RULES || {});
                  const cnt = Object.keys(ESTATE_RULES || {}).length;
                  const hash = await downloadTsModule('ESTATE', ts, 'ESTATE_RULES.generated.ts', [`estate:${cnt}`]);
                  setLog((prev) => (prev ? prev + '\n\n' : '') + 
                    `✅ Exported ESTATE_RULES.generated.ts\n${cnt} states • SHA256: ${hash}`);
                } catch (error: any) {
                  setLog((prev) => (prev ? prev + '\n\n' : '') + `❌ Estate export failed: ${error.message}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Code className="h-4 w-4" />
              Export ESTATE_RULES.ts
            </Button>

            <Button
              variant="secondary"
              disabled={loading}
              className="flex items-center gap-2"
              onClick={async () => {
                setLoading(true);
                try {
                  const ts = makeDeedTs(DEED_RULES || {});
                  const cnt = Object.keys(DEED_RULES || {}).length;
                  const hash = await downloadTsModule('DEED', ts, 'DEED_RULES.generated.ts', [`deed:${cnt}`]);
                  setLog((prev) => (prev ? prev + '\n\n' : '') + 
                    `✅ Exported DEED_RULES.generated.ts\n${cnt} states • SHA256: ${hash}`);
                } catch (error: any) {
                  setLog((prev) => (prev ? prev + '\n\n' : '') + `❌ Deed export failed: ${error.message}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Code className="h-4 w-4" />
              Export DEED_RULES.ts
            </Button>

            {Object.keys(HEALTH_RULES || {}).length > 0 && (
              <Button
                variant="secondary"
                disabled={loading}
                className="flex items-center gap-2"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const ts = makeHealthTs(HEALTH_RULES || {});
                    const cnt = Object.keys(HEALTH_RULES || {}).length;
                    const hash = await downloadTsModule('HEALTH', ts, 'HEALTH_RULES.generated.ts', [`health:${cnt}`]);
                    setLog((prev) => (prev ? prev + '\n\n' : '') + 
                      `✅ Exported HEALTH_RULES.generated.ts\n${cnt} states • SHA256: ${hash}`);
                  } catch (error: any) {
                    setLog((prev) => (prev ? prev + '\n\n' : '') + `❌ Health export failed: ${error.message}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Code className="h-4 w-4" />
                Export HEALTH_RULES.ts
              </Button>
            )}

            <Button
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
              onClick={async () => {
                setLoading(true);
                try {
                  const estateObj = stringifyTs(ESTATE_RULES || {});
                  const deedObj = stringifyTs(DEED_RULES || {});
                  const healthObj = Object.keys(HEALTH_RULES || {}).length > 0 ? stringifyTs(HEALTH_RULES) : undefined;
                  const bundle = makeAllBundleTs({ estateTsObj: estateObj, deedTsObj: deedObj, healthTsObj: healthObj });
                  const reasons = [
                    `estate:${Object.keys(ESTATE_RULES || {}).length}`,
                    `deed:${Object.keys(DEED_RULES || {}).length}`,
                    `health:${Object.keys(HEALTH_RULES || {}).length}`
                  ];
                  const hash = await downloadTsModule('ALL', bundle, 'ALL_RULES.generated.ts', reasons);
                  setLog((prev) => (prev ? prev + '\n\n' : '') + 
                    `✅ Exported ALL_RULES.generated.ts (bundle)\nEstate: ${Object.keys(ESTATE_RULES || {}).length}, Deed: ${Object.keys(DEED_RULES || {}).length}, Health: ${Object.keys(HEALTH_RULES || {}).length} • SHA256: ${hash}`);
                } catch (error: any) {
                  setLog((prev) => (prev ? prev + '\n\n' : '') + `❌ Bundle export failed: ${error.message}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export ALL_RULES.ts
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              JSON files: Pretty formatted and minified versions for data analysis
            </div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              CSV files: Separate files for each rule type for quick spreadsheet analysis
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              TypeScript modules: Ready-to-use .ts files for direct code integration
            </div>
          </div>

          {log && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <pre className="text-xs whitespace-pre-wrap font-mono">{log}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}