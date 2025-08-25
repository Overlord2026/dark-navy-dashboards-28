export async function parseCSV(text:string){ 
  const [h,...lines]=text.replace(/\r/g,'').split('\n').filter(Boolean);
  const head=h.split(',').map(s=>s.trim()); 
  return lines.map((ln)=> {
    const cols=ln.split(','); 
    const o:any={}; 
    head.forEach((k,i)=> o[k]=cols[i]); 
    return o;
  });
}

export async function parseJSON(text:string){ 
  return JSON.parse(text); 
}