export function validateRows(rows:any[], required:string[]){
  const errors: Array<{row:number; field:string; reason:string}> = [];
  rows.forEach((r,idx)=>{
    required.forEach(f=>{ 
      if (r[f]==null || r[f]==='') 
        errors.push({row:idx+1, field:f, reason:'missing'}); 
    });
  });
  const ok = rows.length - new Set(errors.map(e=>e.row)).size;
  return { rows: rows.length, ok, errors };
}