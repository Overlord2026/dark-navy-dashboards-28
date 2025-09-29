import { useEffect, useState, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { PROS, FAMILIES } from "@/config/personas";

export default function PersonaSwitcher() {
  const nav = useNavigate();
  const [val, setVal] = useState<string>(()=>localStorage.getItem("persona") || "");
  useEffect(()=>{ if(val) localStorage.setItem("persona", val); }, [val]);
  function go(path:string){ 
    if(path) {
      startTransition(() => {
        nav(path);
      });
    }
  }

  const options = [
    { group:"Service Professionals", items: PROS.map(p=>({label:p.label, to:p.to})) },
    { group:"Families", items: FAMILIES }
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 md:hidden flex justify-center z-40">
      <div className="bg-background border shadow-sm rounded-full px-3 py-2 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">I'm a</span>
        <select
          aria-label="Choose persona"
          className="text-sm bg-transparent outline-none"
          value={val}
          onChange={(e)=>{ setVal(e.target.value); go(e.target.value); }}
        >
          <option value="">— Select —</option>
          {options.map(g=>(
            <optgroup key={g.group} label={g.group}>
              {g.items.map(it=>(<option key={it.to} value={it.to}>{it.label}</option>))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}