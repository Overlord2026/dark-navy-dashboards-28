import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Code, FileText, Eye, CheckCircle } from 'lucide-react';
import { recordHealthRDS } from '@/features/healthcare/receipts';

// Import COUNTY_META with fallback
let COUNTY_META: any = {};
try {
  COUNTY_META = require('@/features/estate/deeds/countyMeta').COUNTY_META || {};
} catch (e) {
  console.warn('COUNTY_META not found');
}

// -------------------- Parsing helpers --------------------
type ParseResult = { ok: boolean; error?: string; data?: any };

function findObjectLiteral(ts: string): string | null {
  const m = ts.match(/COUNTY_META\s*=\s*{/);
  if (!m) return null;
  let i = ts.indexOf('{', m.index!);
  if (i < 0) return null;
  let depth = 0;
  for (let j = i; j < ts.length; j++) {
    const ch = ts[j];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return ts.slice(i, j + 1);
    }
  }
  return null;
}

function parseCountyTSorJSON(text: string): ParseResult {
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return { ok: true, data: JSON.parse(trimmed) };
    }
    const objLiteral = findObjectLiteral(text);
    if (!objLiteral) return { ok: false, error: 'Could not find COUNTY_META object literal. Paste the generated TS (countyMeta.generated.ts) or the JSON body only.' };
    return { ok: true, data: JSON.parse(objLiteral) }; // our exporter writes JSON-literal in TS
  } catch {
    return { ok: false, error: 'Parse failed. Ensure you pasted the generated countyMeta.generated.ts OR the JSON body.' };
  }
}

// -------------------- Validation --------------------
function validateCountyShape(map: any): string[] {
  const errs: string[] = [];
  if (!map || typeof map !== 'object') return ['Root must be an object with keys "ST/County"'];
  for (const [key, val] of Object.entries(map)) {
    if (!/^[A-Z]{2}\/.+/.test(key)) errs.push(`Key "${key}" must be "ST/County" (e.g., "CA/Orange")`);
    if (!val || typeof val !== 'object') { errs.push(`Value for "${key}" must be an object`); continue; }
    const req = ['state','county','topMarginIn','leftMarginIn','rightMarginIn','bottomMarginIn','firstPageStamp'];
    req.forEach(f => { if (!(f in (val as any))) errs.push(`"${key}" missing field "${f}"`); });
    const fps = (val as any).firstPageStamp || {};
    ['xIn','yIn','wIn','hIn'].forEach(f => { if (!(f in fps)) errs.push(`"${key}" firstPageStamp missing "${f}"`); });
  }
  return errs;
}

// -------------------- Diff computation --------------------
type FieldChange = { field:string; from:any; to:any };
type KeyDiff = { key:string; changes: FieldChange[] };

const FLAT_FIELDS = [
  'pageSize','topMarginIn','leftMarginIn','rightMarginIn','bottomMarginIn',
  'minFontPt','requiresReturnAddress','requiresPreparer','requiresGranteeAddress','requiresAPN',
  'eRecording','inkColor','notarizationVariant','transferTaxNote','notes'
];
const STAMP_FIELDS = ['xIn','yIn','wIn','hIn'];

function arrayEqual(a?:any[], b?:any[]) {
  const A = Array.isArray(a) ? [...a].sort() : [];
  const B = Array.isArray(b) ? [...b].sort() : [];
  return A.length===B.length && A.every((v,i)=> String(v)===String(B[i]));
}

function computeFieldDiff(oldVal:any, newVal:any): FieldChange[] {
  const diffs: FieldChange[] = [];
  // flat fields
  for (const f of FLAT_FIELDS) {
    const from = (oldVal||{})[f], to = (newVal||{})[f];
    if (String(from) !== String(to)) diffs.push({ field: f, from, to });
  }
  // stamp area
  const oFps = (oldVal||{}).firstPageStamp || {};
  const nFps = (newVal||{}).firstPageStamp || {};
  for (const f of STAMP_FIELDS) {
    const from = oFps[f], to = nFps[f];
    if (String(from) !== String(to)) diffs.push({ field: `firstPageStamp.${f}`, from, to });
  }
  // providers (array)
  const oProv = (oldVal||{}).providers || [];
  const nProv = (newVal||{}).providers || [];
  if (!arrayEqual(oProv, nProv)) diffs.push({ field:'providers', from:oProv, to:nProv });
  return diffs;
}

function diffCountyMeta(current:any, incoming:any) {
  const added: string[] = [];
  const updated: KeyDiff[] = [];
  const unchanged: string[] = [];
  for (const [key, nVal] of Object.entries(incoming)) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      added.push(key);
    } else {
      const changes = computeFieldDiff((current as any)[key], nVal);
      if (changes.length) updated.push({ key, changes });
      else unchanged.push(key);
    }
  }
  return { added, updated, unchanged };
}

// -------------------- UI --------------------
export default function RulesReplaceCounty(){
  const [text, setText] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [log, setLog] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<null | { incoming:any; added:string[]; updated:KeyDiff[]; unchangedCount:number }>(null);
  const [showUnchanged, setShowUnchanged] = React.useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setFileName(f.name);
      setText(await f.text());
      setLog(`Loaded file: ${f.name} (${Math.round((await f.text()).length / 1024)}KB)`);
    } catch (error: any) {
      setLog(`Error reading file: ${error.message}`);
    }
  }

  async function doPreview() {
    setLog(''); 
    setPreview(null);
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

      const d = diffCountyMeta(COUNTY_META, incoming);
      setPreview({ 
        incoming, 
        added: d.added.sort(), 
        updated: d.updated.sort((a,b)=> a.key.localeCompare(b.key)), 
        unchangedCount: d.unchanged.length 
      });

      recordHealthRDS(
        'config.county.import.preview',
        {},
        'allow',
        [`added:${d.added.length}`, `updated:${d.updated.length}`, `unchanged:${d.unchanged.length}`, `file:${fileName || 'pasted'}`]
      );

      setLog(`✅ Preview generated successfully!\n\nChanges summary:\n• ${d.added.length} counties to add\n• ${d.updated.length} counties to update\n• ${d.unchanged.length} counties unchanged\n\nReview the differences below and apply when ready.`);
      
    } catch (error: any) {
      setLog(`❌ Preview failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function doMerge(applyAndExport=false){
    if (!preview) { 
      setLog('Please preview differences first.'); 
      return; 
    }
    
    setLoading(true);
    try {
      const { incoming, added, updated } = preview;

      Object.assign(COUNTY_META as any, incoming);

      recordHealthRDS(
        'config.county.import.ts',
        {},
        'allow',
        [`added:${added.length}`, `updated:${updated.length}`, `file:${fileName || 'pasted'}`]
      );

      setLog(`✅ Applied county metadata successfully!\n\nChanges applied:\n• Added: ${added.length} new counties\n• Updated: ${updated.length} existing counties\n• Total counties in runtime: ${Object.keys(COUNTY_META).length}\n\n${applyAndExport ? 'Redirecting to export page...' : 'Next step: Export COUNTY_META.ts to persist changes to source code.'}`);
      
      if (applyAndExport) {
        setTimeout(() => {
          window.location.href = '/admin/rules-export';
        }, 1500);
      }
    } catch (error: any) {
      setLog(`❌ Merge failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const currentCount = Object.keys(COUNTY_META).length;

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Replace Runtime COUNTY_META — with Diff Viewer</h1>
        <p className="text-muted-foreground mt-2">
          Upload or paste a generated TypeScript file to preview and merge county metadata changes.
          See exactly what will change before applying updates to runtime.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import & Preview County Metadata
          </CardTitle>
          <CardDescription>
            Upload the generated <code>countyMeta.generated.ts</code> or paste the JSON object body. 
            Preview differences before merging. Merges are in-memory; export afterward for permanence.
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
            <div className="flex items-center gap-3">
              <Button 
                onClick={doPreview} 
                disabled={!text.trim() || loading}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {loading ? 'Processing...' : 'Preview Differences'}
              </Button>
              <Button 
                onClick={() => doMerge(false)} 
                disabled={!preview || loading}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Apply Merge
              </Button>
              <Button 
                variant="outline"
                onClick={() => doMerge(true)} 
                disabled={!preview || loading}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Apply & Export
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Current counties: {currentCount}</span>
              <a 
                href="/admin/rules-export" 
                className="text-primary hover:text-primary/80 underline"
              >
                Export COUNTY_META.ts
              </a>
            </div>
          </div>

          {log && (
            <div className="p-4 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{log}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diff Viewer */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Difference Preview</CardTitle>
            <CardDescription>
              Review changes before applying to runtime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-green-100 text-green-900 border-green-200">
                Added: {preview.added.length}
              </Badge>
              <Badge variant="default" className="bg-yellow-100 text-yellow-900 border-yellow-200">
                Updated: {preview.updated.length}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                Unchanged: {preview.unchangedCount}
              </Badge>
            </div>

            {/* Added */}
            {preview.added.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-700">Added Counties</h3>
                <div className="grid md:grid-cols-3 gap-2">
                  {preview.added.map(k => (
                    <div key={k} className="text-sm p-2 bg-green-50 border border-green-200 rounded text-green-800">
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Updated */}
            {preview.updated.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-yellow-700">Updated Counties (field-level changes)</h3>
                <div className="space-y-3">
                  {preview.updated.map(u => (
                    <details key={u.key} className="rounded-lg border border-yellow-200 p-4 bg-yellow-50">
                      <summary className="cursor-pointer text-sm font-medium text-yellow-800 hover:text-yellow-900">
                        {u.key} ({u.changes.length} change{u.changes.length !== 1 ? 's' : ''})
                      </summary>
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-yellow-200">
                              <th className="text-left py-2 px-3 bg-yellow-100">Field</th>
                              <th className="text-left py-2 px-3 bg-yellow-100">From</th>
                              <th className="text-left py-2 px-3 bg-yellow-100">To</th>
                            </tr>
                          </thead>
                          <tbody>
                            {u.changes.map((c,i)=>(
                              <tr key={i} className="border-b border-yellow-100">
                                <td className="py-2 px-3 font-medium">{c.field}</td>
                                <td className="py-2 px-3 text-gray-600 font-mono text-xs">{JSON.stringify(c.from)}</td>
                                <td className="py-2 px-3 text-blue-700 font-mono text-xs">{JSON.stringify(c.to)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Unchanged toggle */}
            {preview.unchangedCount > 0 && (
              <div className="pt-4 border-t">
                <button 
                  className="text-sm text-muted-foreground hover:text-foreground underline" 
                  onClick={() => setShowUnchanged(s => !s)}
                >
                  {showUnchanged ? 'Hide unchanged' : 'Show unchanged'} ({preview.unchangedCount} counties)
                </button>
                {showUnchanged && (
                  <div className="text-sm text-muted-foreground mt-2">
                    Unchanged counties have identical field values and are omitted from updates.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
