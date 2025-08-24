import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Code, FileText } from 'lucide-react';
import { recordHealthRDS } from '@/features/healthcare/receipts';

// Import COUNTY_META with fallback
let COUNTY_META: any = {};
try {
  COUNTY_META = require('@/features/estate/deeds/countyMeta').COUNTY_META || {};
} catch (e) {
  console.warn('COUNTY_META not found');
}

type ParseResult = { ok: boolean; error?: string; data?: any };

function findObjectLiteral(ts: string): string | null {
  // Accept either "export const COUNTY_META" or "const COUNTY_META"
  const m = ts.match(/COUNTY_META\s*=\s*{/);
  if (!m) return null;
  let i = m.index!;
  // move to first '{'
  i = ts.indexOf('{', i);
  if (i < 0) return null;
  // brace-match to find the closing '}' of the top-level object
  let depth = 0;
  for (let j = i; j < ts.length; j++) {
    const ch = ts[j];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        // include closing brace, slice object literal [i..j]
        return ts.slice(i, j + 1);
      }
    }
  }
  return null;
}

function parseCountyTSorJSON(text: string): ParseResult {
  try {
    // Try JSON first (user may paste the raw { "CA/Los Angeles": {…} } body)
    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const obj = JSON.parse(trimmed);
      return { ok: true, data: obj };
    }
    // Otherwise try to extract from TS module text
    const objLiteral = findObjectLiteral(text);
    if (!objLiteral) {
      return { 
        ok: false, 
        error: 'Could not find COUNTY_META object literal. Paste the whole generated TS or the JSON body only.' 
      };
    }
    const obj = JSON.parse(objLiteral); // our generator produced pure JSON in TS, so JSON.parse works
    return { ok: true, data: obj };
  } catch (e: any) {
    return { 
      ok: false, 
      error: 'Parse failed. Ensure you pasted the generated countyMeta.generated.ts OR the JSON object body.' 
    };
  }
}

function validateCountyShape(map: any): string[] {
  const errors: string[] = [];
  if (!map || typeof map !== 'object') {
    return ['Root must be an object with keys "STATE/County"'];
  }
  
  for (const [key, val] of Object.entries(map)) {
    if (!/^[A-Z]{2}\/.+/.test(key)) {
      errors.push(`Key "${key}" must be "ST/County" (e.g., "CA/Orange")`);
    }
    
    if (!val || typeof val !== 'object') { 
      errors.push(`Value for "${key}" must be an object`); 
      continue; 
    }
    
    if (!('state' in val) || !('county' in val)) {
      errors.push(`"${key}" missing state/county fields`);
    }
    
    if (!('topMarginIn' in val) || !('leftMarginIn' in val) || !('rightMarginIn' in val) || !('bottomMarginIn' in val)) {
      errors.push(`"${key}" missing margin fields (top/left/right/bottom)`);
    }
    
    if (!('firstPageStamp' in val)) {
      errors.push(`"${key}" missing firstPageStamp {xIn,yIn,wIn,hIn}`);
    }
  }
  return errors;
}

function diffCounts(incoming: any) {
  let add = 0, update = 0, skip = 0;
  for (const k of Object.keys(incoming)) {
    if (!Object.prototype.hasOwnProperty.call(COUNTY_META, k)) {
      add++;
    } else {
      update++;
    }
  }
  skip = Object.keys(COUNTY_META).length - update;
  return { add, update, skip };
}

export default function RulesReplaceCounty() {
  const [text, setText] = React.useState('');
  const [log, setLog] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const buf = await f.text();
      setFileName(f.name);
      setText(buf);
      setLog(`Loaded file: ${f.name} (${Math.round(buf.length / 1024)}KB)`);
    } catch (error: any) {
      setLog(`Error reading file: ${error.message}`);
    }
  }

  async function doMerge() {
    setLog('');
    setLoading(true);
    
    try {
      const parsed = parseCountyTSorJSON(text);
      if (!parsed.ok) { 
        setLog(parsed.error || 'Parse error'); 
        return; 
      }

      const incoming = parsed.data!;
      const errors = validateCountyShape(incoming);
      if (errors.length) {
        setLog('❌ Validation issues:\n• ' + errors.join('\n• '));
        return;
      }
      
      const { add, update } = diffCounts(incoming);

      // Merge into runtime
      Object.assign(COUNTY_META as any, incoming);

      // Log config receipt
      recordHealthRDS(
        'config.county.import.ts',
        {},
        'allow',
        [`added:${add}`, `updated:${update}`, `file:${fileName || 'pasted'}`]
      );

      setLog(`✅ Applied county metadata successfully!\n\nChanges:\n• Added: ${add} new counties\n• Updated: ${update} existing counties\n• Total counties in runtime: ${Object.keys(COUNTY_META).length}\n\nNext step: Export COUNTY_META.ts to persist changes to source code.`);
      
    } catch (error: any) {
      setLog(`❌ Merge failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const currentCount = Object.keys(COUNTY_META).length;

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Replace Runtime COUNTY_META</h1>
        <p className="text-muted-foreground mt-2">
          Upload or paste a generated TypeScript file to merge county metadata into runtime.
          This updates the in-memory COUNTY_META without requiring a restart.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import County Metadata
          </CardTitle>
          <CardDescription>
            Paste the entire <code>countyMeta.generated.ts</code> you exported, or just the JSON object body.
            For permanence, export the updated data afterwards and commit to source.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="file-upload" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload TS/JSON file
              </Label>
              <Input 
                id="file-upload"
                type="file" 
                accept=".ts,.txt,.json" 
                onChange={onFile}
                className="cursor-pointer"
              />
              {fileName && (
                <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                  📁 Loaded: {fileName}
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="text-input" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                …or paste TS/JSON content
              </Label>
              <Textarea 
                id="text-input"
                value={text} 
                onChange={e => setText(e.target.value)} 
                className="h-48 font-mono text-sm" 
                placeholder='Paste entire countyMeta.generated.ts OR {"CA/Orange":{...}}'
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button 
              onClick={doMerge} 
              disabled={!text.trim() || loading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {loading ? 'Merging...' : 'Merge into Runtime'}
            </Button>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Current counties: {currentCount}</span>
              <a 
                href="/admin/rules-export" 
                className="text-primary hover:text-primary/80 underline"
              >
                Export COUNTY_META.ts (persist to source)
              </a>
            </div>
          </div>

          {log && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{log}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
