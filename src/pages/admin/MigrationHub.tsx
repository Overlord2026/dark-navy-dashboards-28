import React from 'react';
import { registerAllMigrateAdapters } from '@/features/migrate/register';
import { listAdaptersByPersona, getAdapter } from '@/features/migrate/registry';
import { logUpload } from '@/features/migrate/receipts';
import type { Persona, UploadFile } from '@/features/migrate/types';

registerAllMigrateAdapters();

function fileToUF(f:File):Promise<UploadFile>{
  return f.arrayBuffer().then(buf=>({ name:f.name, type:f.type, bytes: new Uint8Array(buf) }));
}

export default function MigrationHub(){
  const [persona,setPersona]=React.useState<Persona>('advisor');
  const [incumbent,setIncumbent]=React.useState<string>('');
  const [files,setFiles]=React.useState<UploadFile[]>([]);
  const [mapping,setMapping]=React.useState<any>({});
  const [dry,setDry]=React.useState<any>(null);
  const [rows,setRows]=React.useState<any[]>([]);
  const [busy,setBusy]=React.useState(false);
  const adapters = listAdaptersByPersona(persona);

  async function onFiles(e:React.ChangeEvent<HTMLInputElement>){
    const fl = e.target.files ? await Promise.all(Array.from(e.target.files).map(fileToUF)) : [];
    setFiles(fl); 
    if (incumbent) fl.forEach(f=> logUpload(incumbent, f.name));
  }
  
  async function read(){
    setBusy(true);
    const ad = getAdapter(incumbent as any); 
    if (!ad) { setBusy(false); return; }
    try {
      const parsed = await ad.read(files, {});
      setRows(parsed);
      const defMap = ad.defaultMapping ? ad.defaultMapping() : {};
      setMapping(defMap);
    } catch (error) {
      console.error('Read error:', error);
      alert(`Error reading files: ${error}`);
    }
    setBusy(false);
  }
  
  async function runDry(){
    setBusy(true);
    const ad = getAdapter(incumbent as any); 
    if (!ad) { setBusy(false); return; }
    try {
      const res = await ad.dryRun(rows, mapping);
      setDry(res);
    } catch (error) {
      console.error('Dry run error:', error);
      alert(`Dry run error: ${error}`);
    }
    setBusy(false);
  }
  
  async function runCommit(){
    if (!confirm('Commit import?')) return;
    setBusy(true);
    const ad = getAdapter(incumbent as any); 
    if (!ad) { setBusy(false); return; }
    try {
      const res = await ad.commit(rows, mapping);
      alert(`Imported ${res.rows} rows`);
    } catch (error) {
      console.error('Commit error:', error);
      alert(`Commit error: ${error}`);
    }
    setBusy(false);
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Migration Studio</h1>
      <div className="grid md:grid-cols-3 gap-2">
        <label className="text-sm">Persona
          <select className="w-full rounded-xl border px-2 py-1" value={persona} onChange={e=>{ setPersona(e.target.value as Persona); setIncumbent(''); }}>
            <option value="advisor">advisor</option>
            <option value="accountant">accountant</option>
            <option value="attorney">attorney</option>
            <option value="realtor">realtor</option>
            <option value="nil">nil</option>
            <option value="smb">smb</option>
          </select>
        </label>
        <label className="text-sm">Incumbent
          <select className="w-full rounded-xl border px-2 py-1" value={incumbent} onChange={e=>setIncumbent(e.target.value)}>
            <option value="">Select</option>
            {adapters.map(a=> <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        </label>
        <label className="text-sm">Upload export file(s)
          <input type="file" multiple className="w-full rounded-xl border px-2 py-1" onChange={onFiles}/>
        </label>
      </div>

      <div className="flex gap-2">
        <button className="rounded-xl border px-3 py-2" onClick={read} disabled={!incumbent || !files.length || busy}>Read</button>
        <button className="rounded-xl border px-3 py-2" onClick={runDry} disabled={!rows.length || busy}>Dry-run</button>
        <button className="rounded-xl border px-3 py-2" onClick={runCommit} disabled={!dry || busy || (dry.errors?.length>0)}>Commit</button>
      </div>

      {/* Mapping editor */}
      <div className="rounded-xl border p-3">
        <div className="text-sm font-medium mb-1">Field mapping</div>
        {Object.entries(mapping).length===0 ? <div className="text-xs text-muted-foreground">No default mapping; you can add fields after reading.</div> : null}
        <table className="w-full text-xs">
          <thead className="bg-muted/50"><tr><th className="text-left p-1">Destination</th><th className="text-left p-1">Source</th><th className="text-left p-1">Transform</th></tr></thead>
          <tbody>
            {Object.entries(mapping).map(([dst,spec]:any)=>(
              <tr key={dst} className="border-t">
                <td className="p-1 font-mono">{dst}</td>
                <td className="p-1"><input className="w-full rounded border px-2 py-1" value={spec.src||''} onChange={e=>setMapping({...mapping,[dst]:{...spec,src:e.target.value}})}/></td>
                <td className="p-1"><input className="w-full rounded border px-2 py-1" value={spec.transform||''} onChange={e=>setMapping({...mapping,[dst]:{...spec,transform:e.target.value}})}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dry-run preview */}
      {dry && (
        <div className="rounded-xl border p-3">
          <div className="text-sm font-medium mb-1">Dry-run</div>
          <div className="text-xs">rows:{dry.rows} ok:{dry.ok} errors:{dry.errors?.length||0}</div>
          {dry.errors?.length>0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs underline">Errors</summary>
              <pre className="text-[11px] overflow-auto">{JSON.stringify(dry.errors,null,2)}</pre>
            </details>
          )}
          <details className="mt-2">
            <summary className="cursor-pointer text-xs underline">Preview</summary>
            <pre className="text-[11px] overflow-auto">{JSON.stringify(dry.preview,null,2)}</pre>
          </details>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Safety: files get Vault-RDS; receipts are content-free; transforms run client-side here (wire server as needed).
      </div>
    </div>
  );
}