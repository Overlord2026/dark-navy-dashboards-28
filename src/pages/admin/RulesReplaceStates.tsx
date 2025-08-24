import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Code, FileText, Eye, CheckCircle } from 'lucide-react';
import { recordHealthRDS } from '@/features/healthcare/receipts';

// Import rules with fallbacks
let ESTATE_RULES: any = {};
let DEED_RULES: any = {};
let HEALTH_RULES: any = {};

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

// ---------- Parse helpers (TS or JSON) ----------
type ParseResult = { ok:boolean; error?:string; estate?:any; deed?:any; health?:any };

function findObjectLiteralNamed(ts:string, name:string): string | null {
  const re = new RegExp(`${name}\\\\s*=\\\\s*{`);
  const m = ts.match(re);
  if (!m) return null;
  let i = ts.indexOf('{', m.index!);
  if (i < 0) return null;
  let depth = 0;
  for (let j=i; j<ts.length; j++){
    const ch = ts[j];
    if (ch==='{' ) depth++;
    else if (ch==='}'){
      depth--;
      if (depth===0) return ts.slice(i, j+1);
    }
  }
  return null;
}

function parseStateTSorJSON(text:string): ParseResult {
  try {
    const trimmed = text.trim();
    // JSON form: { "estate_rules": {...}, "deed_rules": {...}, "health_rules": {...} }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const obj = JSON.parse(trimmed);
      return { ok:true, estate: obj.estate_rules || {}, deed: obj.deed_rules || {}, health: obj.health_rules || {} };
    }
    // TS module form: export const ESTATE_RULES = {...}, etc.
    const estateLit = findObjectLiteralNamed(text, 'ESTATE_RULES');
    const deedLit   = findObjectLiteralNamed(text, 'DEED_RULES');
    const healthLit = findObjectLiteralNamed(text, 'HEALTH_RULES');
    if (!estateLit && !deedLit && !healthLit) {
      return { ok:false, error:'Could not find ESTATE_RULES/DEED_RULES/HEALTH_RULES object literals. Paste the generated TS or a JSON blob with estate_rules/deed_rules/health_rules.' };
    }
    const estate = estateLit ? JSON.parse(estateLit) : {};
    const deed   = deedLit   ? JSON.parse(deedLit)   : {};
    const health = healthLit ? JSON.parse(healthLit) : {};
    return { ok:true, estate, deed, health };
  } catch {
    return { ok:false, error:'Parse failed. Ensure you pasted the generated TS or a JSON blob with estate_rules/deed_rules/health_rules.' };
  }
}

// ---------- Validation ----------
function validateEstateRules(map:any): string[] {
  const errs:string[] = [];
  if (!map || typeof map!=='object') return ['estate_rules root must be an object'];
  for (const [code, r] of Object.entries(map)) {
    if (!/^[A-Z]{2}$/.test(String(code))) errs.push(`estate_rules: key "${code}" must be a 2-letter state code`);
    if (!r || typeof r!=='object') { errs.push(`estate_rules: "${code}" must be an object`); continue; }
    const need = ['will','rlt','pourOver'];
    need.forEach(f => { if (!(f in (r as any))) errs.push(`estate_rules: "${code}" missing "${f}"`); });
  }
  return errs;
}

function validateDeedRules(map:any): string[] {
  const errs:string[] = [];
  if (!map || typeof map!=='object') return ['deed_rules root must be an object'];
  for (const [code, r] of Object.entries(map)) {
    if (!/^[A-Z]{2}$/.test(String(code))) errs.push(`deed_rules: key "${code}" must be a 2-letter state code`);
    if (!r || typeof r!=='object') { errs.push(`deed_rules: "${code}" must be an object`); continue; }
    if (!('allowed' in (r as any))) errs.push(`deed_rules: "${code}" missing "allowed" array`);
  }
  return errs;
}

function validateHealthRules(map:any): string[] {
  if (!map) return [];
  const errs:string[] = [];
  if (typeof map!=='object') return ['health_rules root must be an object'];
  for (const [code, r] of Object.entries(map)) {
    if (!/^[A-Z]{2}$/.test(String(code))) errs.push(`health_rules: key "${code}" must be a 2-letter state code`);
    if (!r || typeof r!=='object') { errs.push(`health_rules: "${code}" must be an object`); continue; }
    if (!('witnesses' in (r as any))) errs.push(`health_rules: "${code}" missing "witnesses"`);
    if (!('healthcareForms' in (r as any))) errs.push(`health_rules: "${code}" missing "healthcareForms"`);
  }
  return errs;
}

// ---------- Diff utilities ----------
type FieldChange = { field:string; from:any; to:any };
type KeyDiff = { code:string; changes: FieldChange[] };

const E_FLATS = ['probateNotes','communityProperty','todPodAllowed','deedPracticeNote'];
const E_BLOCKS = [
  ['will','witnesses'],['will','notary'],['will','selfProving'],
  ['rlt','notary'],
  ['pourOver','witnesses'],['pourOver','notary']
];
const D_FLATS = ['witnesses','notary','todAvailable','ladyBirdAvailable','eRecordingLikely','marginRules','notes'];
const H_FLATS = ['witnesses','notaryRequired','selfProvingAffidavit','remoteNotaryAllowed','surrogateTerminology','specialNotes'];

function arrayEqual(a?:any[], b?:any[]) {
  const A = Array.isArray(a) ? [...a].sort() : [];
  const B = Array.isArray(b) ? [...b].sort() : [];
  return A.length===B.length && A.every((v,i)=> String(v)===String(B[i]));
}

function getPath(obj:any, path:string[]): any {
  return path.reduce((acc,k)=> (acc&&typeof acc==='object') ? acc[k] : undefined, obj);
}

function diffEstate(oldMap:any, newMap:any){
  const added:string[] = [], updated:KeyDiff[] = [], unchanged:string[]=[];
  for (const [code,nv] of Object.entries(newMap||{})) {
    const ov = (oldMap||{})[code];
    if (!ov) { added.push(code); continue; }
    const changes:FieldChange[] = [];
    for (const p of E_BLOCKS){
      const from = getPath(ov,p), to = getPath(nv,p);
      if (String(from)!==String(to)) changes.push({ field:p.join('.'), from, to });
    }
    for (const f of E_FLATS){
      const from = (ov||{})[f], to = (nv||{})[f];
      if (String(from)!==String(to)) changes.push({ field:f, from, to });
    }
    changes.length ? updated.push({ code, changes }) : unchanged.push(code);
  }
  return { added:added.sort(), updated:updated.sort((a,b)=> a.code.localeCompare(b.code)), unchangedCount:unchanged.length };
}

function diffDeed(oldMap:any, newMap:any){
  const added:string[] = [], updated:KeyDiff[] = [], unchanged:string[]=[];
  for (const [code,nv] of Object.entries(newMap||{})) {
    const ov = (oldMap||{})[code];
    if (!ov) { added.push(code); continue; }
    const changes:FieldChange[] = [];
    // allowed (array)
    const oa = (ov||{}).allowed || [], na = ((nv as any)||{}).allowed || [];
    if (!arrayEqual(oa,na)) changes.push({ field:'allowed', from:oa, to:na });
    for (const f of D_FLATS){
      const from = (ov||{})[f], to = (nv||{})[f];
      if (String(from)!==String(to)) changes.push({ field:f, from, to });
    }
    changes.length ? updated.push({ code, changes }) : unchanged.push(code);
  }
  return { added:added.sort(), updated:updated.sort((a,b)=> a.code.localeCompare(b.code)), unchangedCount:unchanged.length };
}

function diffHealth(oldMap:any, newMap:any){
  const added:string[] = [], updated:KeyDiff[] = [], unchanged:string[]=[];
  for (const [code,nv] of Object.entries(newMap||{})) {
    const ov = (oldMap||{})[code];
    if (!ov) { added.push(code); continue; }
    const changes:FieldChange[] = [];
    for (const f of H_FLATS){
      const from = (ov||{})[f], to = (nv||{})[f];
      if (String(from)!==String(to)) changes.push({ field:f, from, to });
    }
    // healthcareForms (array)
    const ofa = (ov||{}).healthcareForms || [], nfa = ((nv as any)||{}).healthcareForms || [];
    if (!arrayEqual(ofa,nfa)) changes.push({ field:'healthcareForms', from:ofa, to:nfa });
    changes.length ? updated.push({ code, changes }) : unchanged.push(code);
  }
  return { added:added.sort(), updated:updated.sort((a,b)=> a.code.localeCompare(b.code)), unchangedCount:unchanged.length };
}

// ---------- UI ----------
export default function RulesReplaceStates(){
  const [text, setText] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [log, setLog] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [preview, setPreview] = React.useState<null | {
    estate:{ incoming:any; added:string[]; updated:KeyDiff[]; unchangedCount:number };
    deed:  { incoming:any; added:string[]; updated:KeyDiff[]; unchangedCount:number };
    health?:{ incoming:any; added:string[]; updated:KeyDiff[]; unchangedCount:number };
  }>(null);

  const [showUnchanged, setShowUnchanged] = React.useState(false);
  const [includeHealth, setIncludeHealth] = React.useState(true);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>){
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

  async function doPreview(){
    setLog(''); 
    setPreview(null);
    setLoading(true);
    
    try {
      const parsed = parseStateTSorJSON(text);
      if (!parsed.ok) { 
        setLog(parsed.error||'Parse error'); 
        return; 
      }

      // Validate
      const errs = [
        ...validateEstateRules(parsed.estate || {}),
        ...validateDeedRules(parsed.deed || {}),
        ...validateHealthRules(parsed.health || {})
      ];
      if (errs.length) { 
        setLog('❌ Validation issues:\n• ' + errs.join('\n• ')); 
        return; 
      }

      // Diff
      const est = diffEstate(ESTATE_RULES, parsed.estate || {});
      const ded = diffDeed(DEED_RULES, parsed.deed || {});
      const hl  = includeHealth ? diffHealth(HEALTH_RULES||{}, parsed.health || {}) : undefined;

      setPreview({
        estate:{ incoming: parsed.estate || {}, ...est },
        deed:  { incoming: parsed.deed   || {}, ...ded },
        health:includeHealth ? ({ incoming: parsed.health || {}, ...hl! }) : undefined
      });

      recordHealthRDS(
        'config.state.import.preview',
        {},
        'allow',
        [
          `estate.added:${est.added.length}`, `estate.updated:${est.updated.length}`,
          `deed.added:${ded.added.length}`,   `deed.updated:${ded.updated.length}`,
          includeHealth ? `health.added:${hl!.added.length}` : 'health.added:0',
          includeHealth ? `health.updated:${hl!.updated.length}` : 'health.updated:0',
          `file:${fileName||'pasted'}`
        ]
      );

      setLog(`✅ Preview generated successfully!\n\nChanges summary:\nEstate Rules: ${est.added.length} added, ${est.updated.length} updated\nDeed Rules: ${ded.added.length} added, ${ded.updated.length} updated\n${includeHealth ? `Health Rules: ${hl!.added.length} added, ${hl!.updated.length} updated` : 'Health Rules: skipped'}\n\nReview the differences below and apply when ready.`);
      
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
      // Merge
      Object.assign(ESTATE_RULES as any, preview.estate.incoming);
      Object.assign(DEED_RULES   as any, preview.deed.incoming);
      if (includeHealth && preview.health) Object.assign(HEALTH_RULES as any, preview.health.incoming);

      recordHealthRDS(
        'config.state.import',
        {},
        'allow',
        [
          `estate.added:${preview.estate.added.length}`, `estate.updated:${preview.estate.updated.length}`,
          `deed.added:${preview.deed.added.length}`,     `deed.updated:${preview.deed.updated.length}`,
          includeHealth && preview.health ? `health.added:${preview.health.added.length}` : 'health.added:0',
          includeHealth && preview.health ? `health.updated:${preview.health.updated.length}` : 'health.updated:0',
          `file:${fileName||'pasted'}`
        ]
      );

      setLog(`✅ Applied state rules successfully!\n\nChanges applied:\nEstate Rules: ${preview.estate.added.length} added, ${preview.estate.updated.length} updated\nDeed Rules: ${preview.deed.added.length} added, ${preview.deed.updated.length} updated\n${includeHealth && preview.health ? `Health Rules: ${preview.health.added.length} added, ${preview.health.updated.length} updated` : 'Health Rules: skipped'}\n\n${applyAndExport ? 'Redirecting to export page...' : 'Next step: Export rules JSON/CSVs to persist changes to source code.'}`);
      
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

  function RuleDiff({title, data, color}:{title:string; data:{added:string[]; updated:KeyDiff[]; unchangedCount:number}; color:string}){
    return (
      <Card>
        <CardHeader>
          <CardTitle className={`text-lg ${color}`}>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-100 text-green-900 border-green-200">
              Added: {data.added.length}
            </Badge>
            <Badge variant="default" className="bg-yellow-100 text-yellow-900 border-yellow-200">
              Updated: {data.updated.length}
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
              Unchanged: {data.unchangedCount}
            </Badge>
          </div>
          
          {data.added.length>0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-700">Added States</div>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {data.added.map(k => (
                  <div key={k} className="text-sm p-1 bg-green-50 border border-green-200 rounded text-green-800 text-center">
                    {k}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.updated.length>0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-yellow-700">Updated States (field-level changes)</div>
              <div className="space-y-2">
                {data.updated.map(u=>(
                  <details key={u.code} className="rounded-lg border border-yellow-200 p-3 bg-yellow-50">
                    <summary className="cursor-pointer text-sm font-medium text-yellow-800 hover:text-yellow-900">
                      {u.code} ({u.changes.length} change{u.changes.length !== 1 ? 's' : ''})
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
          
          {!showUnchanged && data.unchangedCount>0 && (
            <button 
              className="text-sm text-muted-foreground hover:text-foreground underline" 
              onClick={()=>setShowUnchanged(s=>!s)}
            >
              {showUnchanged ? 'Hide unchanged' : 'Show unchanged'} ({data.unchangedCount} states)
            </button>
          )}
          {showUnchanged && (
            <div className="text-sm text-muted-foreground">
              Unchanged states have identical field values and are omitted from updates.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentCounts = {
    estate: Object.keys(ESTATE_RULES).length,
    deed: Object.keys(DEED_RULES).length,
    health: Object.keys(HEALTH_RULES || {}).length
  };

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Replace Runtime STATE RULES — with Diff Viewer</h1>
        <p className="text-muted-foreground mt-2">
          Upload or paste a generated TypeScript file or JSON blob to preview and merge state rule changes.
          Supports estate rules, deed rules, and health rules with field-level change detection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import & Preview State Rules
          </CardTitle>
          <CardDescription>
            Upload a generated TS with ESTATE_RULES/DEED_RULES/HEALTH_RULES or paste a JSON blob with estate_rules/deed_rules/health_rules.
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
                placeholder='TS with ESTATE_RULES/DEED_RULES/HEALTH_RULES or JSON with {"estate_rules":{...},"deed_rules":{...},"health_rules":{...}}'
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-health" 
              checked={includeHealth} 
              onCheckedChange={(checked) => setIncludeHealth(checked === true)}
            />
            <Label htmlFor="include-health" className="text-sm">
              Include health rules in merge (if present)
            </Label>
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
              <span>Current: {currentCounts.estate} estate, {currentCounts.deed} deed, {currentCounts.health} health</span>
              <a 
                href="/admin/rules-export" 
                className="text-primary hover:text-primary/80 underline"
              >
                Export rules JSON/CSVs
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
        <div className="space-y-6">
          <RuleDiff title="ESTATE_RULES" data={preview.estate} color="text-blue-700" />
          <RuleDiff title="DEED_RULES" data={preview.deed} color="text-green-700" />
          {includeHealth && preview.health && <RuleDiff title="HEALTH_RULES" data={preview.health} color="text-purple-700" />}
        </div>
      )}
    </div>
  );
}