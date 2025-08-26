import React from "react";
import {
  getCountyList, setCountyList, upsertCounty, removeCounty,
  newCountyTemplate, type CountyRule
} from "@/features/estate/demo/estateDemo";

type EditState = CountyRule & { _isNew?: boolean };

function InputNum({label,value,onChange}:{label:string;value:number;onChange:(n:number)=>void}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="w-32">{label}</span>
      <input
        className="border rounded px-2 py-1 w-24"
        value={value}
        onChange={e=>onChange(parseFloat(e.target.value||"0"))}
      />
    </label>
  );
}
function InputText({label,value,onChange,w=240}:{label:string;value:string;onChange:(s:string)=>void;w?:number}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="w-32">{label}</span>
      <input className="border rounded px-2 py-1" style={{width:w}} value={value} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}
function InputCheck({label,checked,onChange}:{label:string;checked:boolean;onChange:(b:boolean)=>void}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export default function CountyMetaEditor(){
  const [rows, setRows] = React.useState<CountyRule[]>(getCountyList());
  const [editing, setEditing] = React.useState<EditState|null>(null);
  const [importText, setImportText] = React.useState("");

  function refresh(){ setRows(getCountyList()); }

  function onEdit(token:string){
    const r = rows.find(x=>x.county_token===token);
    if (r) setEditing({...r});
  }
  function onDuplicate(token:string){
    const r = rows.find(x=>x.county_token===token);
    if (!r) return;
    const dup: EditState = {...r, county_token: r.county_token + "_COPY", _isNew:true};
    setEditing(dup);
  }
  function onDelete(token:string){
    if (!confirm(`Delete ${token}?`)) return;
    setRows(removeCounty(token));
  }
  function onNew(){ setEditing({...newCountyTemplate(), _isNew:true}); }
  function onCancel(){ setEditing(null); }
  function onSave(){
    if (!editing) return;
    // minimal sanitize for token
    const sanitized: CountyRule = {
      ...editing,
      county_token: String(editing.county_token||"").trim(),
      pageSize: editing.pageSize === "Legal" ? "Legal":"Letter",
      marginsIn: {...editing.marginsIn},
      stampBoxIn: {...editing.stampBoxIn},
      minFontPt: Number(editing.minFontPt||10),
      requires: {...editing.requires}
    };
    if (!sanitized.county_token.includes("/")) {
      alert("county_token must be 'STATE/County_Name'"); return;
    }
    setRows(upsertCounty(sanitized));
    setEditing(null);
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(getCountyList(), null, 2)], { type:"application/json;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "county_meta.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(){
    try{
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) { alert("Paste an array of county objects"); return; }
      setCountyList(parsed);
      setImportText("");
      refresh();
      alert("County meta imported.");
    }catch(e:any){ alert("Invalid JSON: " + (e?.message||e)); }
  }

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">County Meta Editor</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <button className="border rounded px-3 py-1" onClick={onNew}>New County</button>
        <button className="border rounded px-3 py-1" onClick={exportJSON}>Export JSON</button>
        <details className="border rounded p-2">
          <summary className="cursor-pointer">Import JSON</summary>
          <textarea className="border rounded p-2 w-[480px] h-[140px]" placeholder='[{"county_token":"CA/Los_Angeles",...}]' value={importText} onChange={e=>setImportText(e.target.value)} />
          <div className="mt-1">
            <button className="border rounded px-3 py-1" onClick={importJSON}>Import</button>
          </div>
        </details>
      </div>

      {/* List */}
      <div className="border rounded">
        <div className="grid grid-cols-7 gap-2 p-2 text-xs font-semibold border-b">
          <div>County</div><div>Margins (t/l/r/b)</div><div>Stamp (x/y/w/h)</div>
          <div>Min pt</div><div>Req (A/P/R)</div><div>Page Size</div><div>Actions</div>
        </div>
        {rows.map(r=>{
          const m = r.marginsIn, s = r.stampBoxIn, req = r.requires;
          const [state, county] = String(r.county_token).split("/",2);
          return (
            <div key={r.county_token} className="grid grid-cols-7 gap-2 p-2 text-xs border-b">
              <div><code>{state}/{county}</code></div>
              <div>{m.top}/{m.left}/{m.right}/{m.bottom}</div>
              <div>{s.x}/{s.y}/{s.w}/{s.h}</div>
              <div>{r.minFontPt}</div>
              <div>{Number(!!req.APN)}/{Number(!!req.preparer)}/{Number(!!req.returnAddress)}</div>
              <div>{r.pageSize}</div>
              <div className="flex gap-1">
                <button className="border rounded px-2 py-0.5" onClick={()=>onEdit(r.county_token)}>Edit</button>
                <button className="border rounded px-2 py-0.5" onClick={()=>onDuplicate(r.county_token)}>Dup</button>
                <button className="border rounded px-2 py-0.5" onClick={()=>onDelete(r.county_token)}>Del</button>
              </div>
            </div>
          );
        })}
        {rows.length===0 && <div className="p-3 text-sm">No counties configured yet.</div>}
      </div>

      {/* Editor panel */}
      {editing && (
        <div className="border rounded p-3 space-y-2 text-sm">
          <div className="font-semibold">{editing._isNew ? "New County" : "Edit County"}</div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <InputText label="County token" value={editing.county_token} onChange={s=>setEditing({...editing!, county_token:s})}/>
              <label className="inline-flex items-center gap-2">
                <span className="w-32">Page size</span>
                <select className="border rounded px-2 py-1" value={editing.pageSize} onChange={e=>setEditing({...editing!, pageSize:e.target.value as "Letter"|"Legal"})}>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </label>

              <div className="font-semibold mt-2">Margins (in)</div>
              <InputNum label="Top"    value={editing.marginsIn.top}    onChange={n=>setEditing({...editing!, marginsIn:{...editing!.marginsIn, top:n}})}/>
              <InputNum label="Left"   value={editing.marginsIn.left}   onChange={n=>setEditing({...editing!, marginsIn:{...editing!.marginsIn, left:n}})}/>
              <InputNum label="Right"  value={editing.marginsIn.right}  onChange={n=>setEditing({...editing!, marginsIn:{...editing!.marginsIn, right:n}})}/>
              <InputNum label="Bottom" value={editing.marginsIn.bottom} onChange={n=>setEditing({...editing!, marginsIn:{...editing!.marginsIn, bottom:n}})}/>
            </div>

            <div className="space-y-2">
              <div className="font-semibold">Stamp box (in)</div>
              <InputNum label="x" value={editing.stampBoxIn.x} onChange={n=>setEditing({...editing!, stampBoxIn:{...editing!.stampBoxIn, x:n}})}/>
              <InputNum label="y" value={editing.stampBoxIn.y} onChange={n=>setEditing({...editing!, stampBoxIn:{...editing!.stampBoxIn, y:n}})}/>
              <InputNum label="w" value={editing.stampBoxIn.w} onChange={n=>setEditing({...editing!, stampBoxIn:{...editing!.stampBoxIn, w:n}})}/>
              <InputNum label="h" value={editing.stampBoxIn.h} onChange={n=>setEditing({...editing!, stampBoxIn:{...editing!.stampBoxIn, h:n}})}/>

              <InputNum label="Min font pt" value={editing.minFontPt} onChange={n=>setEditing({...editing!, minFontPt:n})}/>
              <div className="flex gap-4 flex-wrap">
                <InputCheck label="APN required"          checked={editing.requires.APN}          onChange={b=>setEditing({...editing!, requires:{...editing!.requires, APN:b}})}/>
                <InputCheck label="Preparer required"     checked={editing.requires.preparer}     onChange={b=>setEditing({...editing!, requires:{...editing!.requires, preparer:b}})}/>
                <InputCheck label="Return address req."   checked={editing.requires.returnAddress}onChange={b=>setEditing({...editing!, requires:{...editing!.requires, returnAddress:b}})}/>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="border rounded px-3 py-1" onClick={onSave}>Save</button>
            <button className="border rounded px-3 py-1" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Content-free editor: store inches/tokens only (no names/addresses). County data lives in local storage (key: <code>county.meta.list</code>).
      </p>
    </div>
  );
}