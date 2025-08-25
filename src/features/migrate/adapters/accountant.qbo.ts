import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const qbo: Adapter = {
  key:'qbo', 
  label:'QuickBooks Online (CSV export)', 
  persona:'accountant',
  async read(files){ 
    const f=files.find(x=>x.name.endsWith('.csv')); 
    if(!f) throw new Error('CSV required'); 
    const t=new TextDecoder().decode(f.bytes); 
    return parseCSV(t); 
  },
  defaultMapping(){ 
    return { 
      entityId:{src:'Customer'}, 
      date:{src:'Date'}, 
      amount:{src:'Amount', transform:'toNumber'}, 
      memo:{src:'Memo'} 
    }; 
  },
  transforms:{ 
    toNumber:(v:any)=> Number(String(v||0).replace(/[^0-9.\-]/g,'')) 
  },
  async dryRun(rows,map){ 
    const shaped=applyMapping(rows,map,qbo.transforms); 
    const res=validateRows(shaped,['entityId','date']); 
    await logDryRun('qbo',res.rows,res.ok,res.errors.length); 
    return {...res, preview:shaped.slice(0,5)}; 
  },
  async commit(rows,map){ 
    const shaped=applyMapping(rows,map,qbo.transforms); 
    // TODO: write to GL
    await logCommit('qbo', shaped.length); 
    return { rows:shaped.length, ids:shaped.map((_,i)=>`row:${i+1}`)} 
  }
};

export default qbo;