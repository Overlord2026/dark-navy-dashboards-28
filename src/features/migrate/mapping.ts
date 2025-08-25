import type { Mapping } from './types';

export function applyMapping(rows:any[], map:Mapping, transforms?:Record<string,(v:any)=>any>){
  return rows.map(row=>{
    const out:any={}; 
    for (const [dst, spec] of Object.entries(map)){
      const val = spec.src ? row[spec.src] : undefined;
      out[dst] = spec.transform && transforms?.[spec.transform] ? transforms[spec.transform](val) : val;
    }
    return out;
  });
}