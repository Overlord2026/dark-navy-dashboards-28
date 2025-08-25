import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const clio: Adapter = {
  key:'clio', 
  label:'Clio (CSV matters/contacts)', 
  persona:'attorney',
  async read(files){ 
    const f=files.find(x=>x.name.endsWith('.csv')); 
    if(!f) throw new Error('CSV required'); 
    const t=new TextDecoder().decode(f.bytes); 
    return parseCSV(t); 
  },
  defaultMapping(){ 
    return { 
      matterId:{src:'MatterID'}, 
      clientName:{src:'Client'}, 
      type:{src:'Type'}, 
      status:{src:'Status'} 
    }; 
  },
  async dryRun(rows,map){ 
    const shaped=applyMapping(rows,map); 
    const res=validateRows(shaped,['matterId','clientName']); 
    await logDryRun('clio',res.rows,res.ok,res.errors.length); 
    return {...res, preview:shaped.slice(0,5)}; 
  },
  async commit(rows,map){ 
    const shaped=applyMapping(rows,map); 
    // TODO: create matters/docs
    await logCommit('clio', shaped.length); 
    return { rows:shaped.length, ids:shaped.map((_,i)=>`row:${i+1}`)} 
  }
};

export default clio;