export function canonicalDiff(a:any, b:any){
  // shallow structural diff, content-free: returns keys added/removed/changed
  function flatten(obj:any, prefix=""):Record<string,string>{
    const out:Record<string,string> = {};
    if (obj && typeof obj==="object" && !Array.isArray(obj)){
      Object.keys(obj).sort().forEach(k=>{
        Object.assign(out, flatten(obj[k], prefix ? `${prefix}.${k}` : k));
      });
    } else {
      out[prefix] = String(obj);
    }
    return out;
  }
  const A = flatten(a||{}), B = flatten(b||{});
  const keys = Array.from(new Set([...Object.keys(A), ...Object.keys(B)])).sort();
  const changes = keys.reduce((acc:any,k)=>{
    if (A[k] !== B[k]) acc[k] = { from: A[k]||"", to: B[k]||"" };
    return acc;
  },{});
  return changes;
}