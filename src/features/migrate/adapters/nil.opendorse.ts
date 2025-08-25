import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const opendorse: Adapter = {
  key:'opendorse', 
  label:'Opendorse (CSV)', 
  persona:'nil',
  async read(files){ 
    const f=files.find(x=>x.name.endsWith('.csv')); 
    if(!f) throw new Error('CSV required'); 
    const t=new TextDecoder().decode(f.bytes); 
    return parseCSV(t); 
  },
  defaultMapping(){ 
    return { 
      athleteId:{src:'AthleteID'}, 
      dealId:{src:'DealID'}, 
      brand:{src:'Brand'}, 
      value:{src:'Value', transform:'toNumber'} 
    }; 
  },
  transforms:{ 
    toNumber:(v:any)=> Number(String(v||0).replace(/[^0-9.\-]/g,'')) 
  },
  async dryRun(rows,map){ 
    const shaped=applyMapping(rows,map,opendorse.transforms); 
    const res=validateRows(shaped,['athleteId','dealId']); 
    await logDryRun('opendorse',res.rows,res.ok,res.errors.length); 
    return {...res, preview:shaped.slice(0,5)}; 
  },
  async commit(rows,map){ 
    const shaped=applyMapping(rows,map,opendorse.transforms); 
    // TODO: create NIL deals
    await logCommit('opendorse', shaped.length); 
    return { rows:shaped.length, ids:shaped.map((_,i)=>`row:${i+1}`)} 
  }
};

export default opendorse;