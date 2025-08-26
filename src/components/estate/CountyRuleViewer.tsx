import React from "react";
import { sampleCounty, defaultLayout, validateLayout, emitDeltaFromValidation } from "@/features/estate/demo/estateDemo";

type Props = { policyVersion: string };

export default function CountyRuleViewer({ policyVersion }: Props){
  const [layout, setLayout] = React.useState(defaultLayout);
  const [result, setResult] = React.useState<{ok:boolean; violations:string[]; remedies:string[]}|null>(null);
  const [busy, setBusy] = React.useState(false);
  // NEW: lightweight "copied" feedback flag
  const [copied, setCopied] = React.useState(false);

  // NEW: small helper to download a text file
  function downloadText(name: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  function onNum(path: string, val: string){
    const n = parseFloat(val || "0");
    setLayout(l => {
      const copy:any = JSON.parse(JSON.stringify(l));
      const parts = path.split(".");
      let obj:any = copy; for (let i=0;i<parts.length-1;i++) obj = obj[parts[i]];
      obj[parts[parts.length-1]] = isNaN(n) ? 0 : n;
      return copy;
    });
  }
  function onBool(path:string, val:boolean){
    setLayout(l => {
      const copy:any = JSON.parse(JSON.stringify(l));
      const parts = path.split(".");
      let obj:any = copy; for (let i=0;i<parts.length-1;i++) obj = obj[parts[i]];
      obj[parts[parts.length-1]] = val;
      return copy;
    });
  }

  function fixToPolicy(){
    setLayout({
      marginsIn: { ...sampleCounty.marginsIn },
      stampBoxIn: { ...sampleCounty.stampBoxIn },
      fontPt: Math.max(layout.fontPt, sampleCounty.minFontPt),
      hasAPN: sampleCounty.requires.APN ? true : layout.hasAPN,
      hasPreparer: sampleCounty.requires.preparer ? true : layout.hasPreparer,
      hasReturnAddress: sampleCounty.requires.returnAddress ? true : layout.hasReturnAddress
    });
    setResult(null);
  }

  function asciiSchematic(){
    // Draw a small 38x24 grid approximation of a Letter page; top margin height based on inches
    const W = 38, H = 24;
    const grid:string[][] = Array.from({length:H},()=>Array.from({length:W},()=> " "));
    // Border
    for (let x=0;x<W;x++){ grid[0][x] = "-"; grid[H-1][x]="-"; }
    for (let y=0;y<H;y++){ grid[y][0] = "|"; grid[y][W-1]="|"; }
    grid[0][0] = "+"; grid[0][W-1]="+"; grid[H-1][0] = "+"; grid[H-1][W-1]="+";

    // Convert inches to rows: assume page height ~11" -> 22 rows usable + borders
    function inchToRows(inch:number){ return Math.round((inch/11)* (H-2)); }
    function inchToCols(inch:number){ return Math.round((inch/8.5)* (W-2)); }

    const topRows   = inchToRows(sampleCounty.marginsIn.top);
    const leftCols  = inchToCols(sampleCounty.marginsIn.left);
    const rightCols = inchToCols(sampleCounty.marginsIn.right);
    const bottomRows= inchToRows(sampleCounty.marginsIn.bottom);

    // Shade margins using dots (.)
    for (let y=1; y<=topRows && y<H-1; y++) for (let x=1; x<W-1; x++) grid[y][x]=".";
    for (let y=1; y<H-1; y++) for (let x=1; x<=leftCols && x<W-1; x++) grid[y][x]=".";
    for (let y=1; y<H-1; y++) for (let x=W-1-rightCols; x<W-1; x++) grid[y][x]=".";
    for (let y=H-1-bottomRows; y<H-1; y++) for (let x=1; x<W-1; x++) grid[y][x]=".";

    // Draw stamp box within top margin using '#'
    const sbx = 1 + inchToCols(layout.stampBoxIn.x);
    const sby = 1 + inchToRows(layout.stampBoxIn.y);
    const sbw = Math.max(2, inchToCols(layout.stampBoxIn.w));
    const sbh = Math.max(2, inchToRows(layout.stampBoxIn.h));
    for (let y=sby; y<Math.min(H-1, sby+sbh); y++){
      for (let x=sbx; x<Math.min(W-1, sbx+sbw); x++) grid[y][x]="#";
    }

    const lines = grid.map(r => r.join(""));
    return [
      `County: ${sampleCounty.county_token}  Page: ${sampleCounty.pageSize}`,
      `Policy margins (in): top ${sampleCounty.marginsIn.top}  left ${sampleCounty.marginsIn.left}  right ${sampleCounty.marginsIn.right}  bottom ${sampleCounty.marginsIn.bottom}`,
      `Layout stamp-box (in): x ${layout.stampBoxIn.x}  y ${layout.stampBoxIn.y}  w ${layout.stampBoxIn.w}  h ${layout.stampBoxIn.h}`,
      "",
      ...lines
    ].join("\n");
  }

  async function validate(){
    const v = validateLayout(layout, sampleCounty);
    setResult(v);
  }
  async function emitDelta(){
    if (!result || result.ok || result.violations.length===0) return;
    setBusy(true);
    try {
      await emitDeltaFromValidation(policyVersion, result.violations, result.remedies);
      alert("Delta-RDS emitted (content-free). Check Receipt Viewer.");
    } finally { setBusy(false); }
  }

  // NEW: copy the current ASCII schematic to clipboard (with fallback)
  async function copyAscii(){
    const text = asciiSchematic();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(()=>setCopied(false), 1600);
    } catch {
      // no-op; leave silently
    }
  }

  // NEW: export the current ASCII schematic
  function exportAscii(){
    const ts = new Date();
    const pad = (n:number)=>String(n).padStart(2,"0");
    const stamp = `${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`;
    const name = `${sampleCounty.county_token.replace("/","_")}_layout_${stamp}.txt`;
    downloadText(name, asciiSchematic());
  }

  // NEW: Build a content-free validation report (policy header + layout + results)
  function buildValidationReport(v: {ok:boolean; violations:string[]; remedies:string[]}) {
    const pad = (n:number)=>String(n).padStart(2,"0");
    const ts  = new Date();
    const stamp = `${ts.getFullYear()}-${pad(ts.getMonth()+1)}-${pad(ts.getDate())}T${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}Z`;

    const lines: string[] = [];
    lines.push(`Estate / RON — Validation Report (content-free)`);
    lines.push(`Generated: ${stamp}`);
    lines.push(`County: ${sampleCounty.county_token}`);
    lines.push(`Policy version: E-2025.08`);
    lines.push(`Page size: ${sampleCounty.pageSize}`);
    lines.push(`Policy margins (in): top ${sampleCounty.marginsIn.top}  left ${sampleCounty.marginsIn.left}  right ${sampleCounty.marginsIn.right}  bottom ${sampleCounty.marginsIn.bottom}`);
    lines.push(`Policy min font: ${sampleCounty.minFontPt} pt`);
    lines.push(`Required: APN=${sampleCounty.requires.APN}  preparer=${sampleCounty.requires.preparer}  returnAddress=${sampleCounty.requires.returnAddress}`);
    lines.push(`eRecording: true  provider=DocuSign`);
    lines.push(``);
    lines.push(`Candidate layout`);
    lines.push(`  Margins (in): top ${layout.marginsIn.top}  left ${layout.marginsIn.left}  right ${layout.marginsIn.right}  bottom ${layout.marginsIn.bottom}`);
    lines.push(`  Stamp-box (in): x ${layout.stampBoxIn.x}  y ${layout.stampBoxIn.y}  w ${layout.stampBoxIn.w}  h ${layout.stampBoxIn.h}`);
    lines.push(`  Font: ${layout.fontPt} pt`);
    lines.push(`  Fields: APN=${layout.hasAPN}  preparer=${layout.hasPreparer}  returnAddress=${layout.hasReturnAddress}`);
    lines.push(``);
    lines.push(`Result: ${v.ok ? "PASS ✅" : "FAIL ❌"}`);
    if (!v.ok) {
      lines.push(`Violations: ${v.violations.length ? v.violations.join(", ") : "(none)"}`);
      lines.push(`Remedies:   ${v.remedies.length   ? v.remedies.join(", ")   : "(none)"}`);
    }
    lines.push(``);
    lines.push(`Note: This report contains no PII/PHI. All values are policy/layout tokens and inches.`);
    return lines.join("\n");
  }

  // NEW: Export Validation Report (.txt)
  async function exportValidationReport(){
    // Ensure we have a validation result; if not, run it once
    const v = result ?? validateLayout(layout, sampleCounty);
    if (!result) setResult(v);
    const pad = (n:number)=>String(n).padStart(2,"0");
    const ts  = new Date();
    const stamp = `${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`;
    const name  = `${sampleCounty.county_token.replace("/","_")}_validation_${stamp}.txt`;
    const text  = buildValidationReport(v);
    downloadText(name, text);
  }

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="text-sm font-semibold">County Rule Viewer (content-free)</div>

      {/* Layout form */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-1">
          <div className="font-semibold">Layout (inches)</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="inline-flex flex-col">Top margin
              <input className="border rounded px-2 py-1" value={layout.marginsIn.top} onChange={e=>onNum("marginsIn.top", e.target.value)}/>
            </label>
            <label className="inline-flex flex-col">Left margin
              <input className="border rounded px-2 py-1" value={layout.marginsIn.left} onChange={e=>onNum("marginsIn.left", e.target.value)}/>
            </label>
            <label className="inline-flex flex-col">Right margin
              <input className="border rounded px-2 py-1" value={layout.marginsIn.right} onChange={e=>onNum("marginsIn.right", e.target.value)}/>
            </label>
            <label className="inline-flex flex-col">Bottom margin
              <input className="border rounded px-2 py-1" value={layout.marginsIn.bottom} onChange={e=>onNum("marginsIn.bottom", e.target.value)}/>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <label className="inline-flex flex-col">Stamp x
              <input className="border rounded px-2 py-1" value={layout.stampBoxIn.x} onChange={e=>onNum("stampBoxIn.x", e.target.value)}/>
            </label>
            <label className="inline-flex flex-col">Stamp y
              <input className="border rounded px-2 py-1" value={layout.stampBoxIn.y} onChange={e=>onNum("stampBoxIn.y", e.target.value)}/>
            </label>
            <label className="inline-flex flex-col">Stamp w
              <input className="border rounded px-2 py-1" value={layout.stampBoxIn.w} onChange={e=>onNum("stampBoxIn.w", e.target.value)}/>
            </label>
            <label className="inline-flex flex-col">Stamp h
              <input className="border rounded px-2 py-1" value={layout.stampBoxIn.h} onChange={e=>onNum("stampBoxIn.h", e.target.value)}/>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="inline-flex items-center gap-2">
              <span>Font pt</span>
              <input className="border rounded px-2 py-1" value={layout.fontPt} onChange={e=>onNum("fontPt", e.target.value)}/>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={layout.hasAPN} onChange={e=>onBool("hasAPN", e.target.checked)}/> APN present
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={layout.hasPreparer} onChange={e=>onBool("hasPreparer", e.target.checked)}/> Preparer block
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={layout.hasReturnAddress} onChange={e=>onBool("hasReturnAddress", e.target.checked)}/> Return address
            </label>
          </div>

          <div className="flex gap-2">
            <button className="border rounded px-3 py-1" onClick={validate} disabled={busy}>Validate</button>
            <button className="border rounded px-3 py-1" onClick={fixToPolicy} disabled={busy}>Fix to Policy</button>
            <button className="border rounded px-3 py-1" onClick={emitDelta} disabled={busy || !result || result.ok}>Emit Delta-RDS</button>
          </div>
        </div>

        {/* ASCII schematic + results */}
        <div className="space-y-1">
          <div className="font-semibold">ASCII schematic</div>
          <pre className="whitespace-pre text-xs border rounded p-2 bg-white">{asciiSchematic()}</pre>
          
          {/* NEW: Export + Copy buttons and a tiny "Copied!" hint */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="border rounded px-3 py-1 text-xs" onClick={exportAscii} disabled={busy}>
              Export ASCII (.txt)
            </button>
            <button className="border rounded px-3 py-1 text-xs" onClick={copyAscii} disabled={busy}>
              Copy schematic
            </button>
            {copied && <span className="text-xs">Copied!</span>}
            {/* NEW button — Export Validation Report */}
            <button className="border rounded px-3 py-1 text-xs" onClick={exportValidationReport} disabled={busy}>
              Export Validation Report (.txt)
            </button>
          </div>
          
          <div className="text-xs">
            {result
              ? (result.ok
                 ? <span className="text-green-700">Validation: PASS ✅</span>
                 : <>
                     <div className="text-red-700">Validation: FAIL ❌</div>
                     <div>Violations: <code>{result.violations.join(", ")}</code></div>
                     <div>Remedies: <code>{result.remedies.join(", ")}</code></div>
                   </>
                )
              : <em>Click Validate to see pass/fail and reasons.</em>}
          </div>
        </div>
      </div>
    </div>
  );
}