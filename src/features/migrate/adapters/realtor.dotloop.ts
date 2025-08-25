import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const dotloop: Adapter = {
  key:'dotloop', 
  label:'dotloop (CSV)', 
  persona:'realtor',
  async read(files){ 
    const f=files.find(x=>x.name.endsWith('.csv')); 
    if(!f) throw new Error('CSV required'); 
    const t=new TextDecoder().decode(f.bytes); 
    return parseCSV(t); 
  },
  defaultMapping(){ 
    return { 
      txnId:{src:'LoopID'}, 
      address:{src:'Address'}, 
      side:{src:'Side'}, 
      status:{src:'Status'} 
    }; 
  },
  async dryRun(rows,map){ 
    const shaped=applyMapping(rows,map); 
    const res=validateRows(shaped,['txnId','address']); 
    await logDryRun('dotloop',res.rows,res.ok,res.errors.length); 
    return {...res, preview:shaped.slice(0,5)}; 
  },
  async commit(rows,map){ 
    const shaped=applyMapping(rows,map); 
    // TODO: create realty pipeline items
    await logCommit('dotloop', shaped.length); 
    return { rows:shaped.length, ids:shaped.map((_,i)=>`row:${i+1}`)} 
  }
};

export default dotloop;