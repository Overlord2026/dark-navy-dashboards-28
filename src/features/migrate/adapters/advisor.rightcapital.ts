import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const rightcap: Adapter = {
  key:'rightcapital', 
  label:'RightCapital (CSV)', 
  persona:'advisor',
  async read(files){ 
    const f=files.find(x=>x.name.endsWith('.csv')); 
    if(!f) throw new Error('CSV required'); 
    const t=new TextDecoder().decode(f.bytes); 
    return parseCSV(t); 
  },
  defaultMapping(){ 
    return { 
      householdId:{src:'Client'}, 
      firstName:{src:'FirstName'}, 
      lastName:{src:'LastName'}, 
      expensesMonthly:{src:'MonthlySpending', transform:'toNumber'} 
    }; 
  },
  transforms:{ 
    toNumber:(v:any)=> Number(String(v||0).replace(/[^0-9.\-]/g,'')) 
  },
  async dryRun(rows,map){ 
    const shaped=applyMapping(rows,map,rightcap.transforms); 
    const res=validateRows(shaped,['householdId','firstName','lastName']); 
    await logDryRun('rightcapital',res.rows,res.ok,res.errors.length); 
    return {...res, preview:shaped.slice(0,5)}; 
  },
  async commit(rows,map){ 
    const shaped=applyMapping(rows,map,rightcap.transforms); 
    await logCommit('rightcapital', shaped.length); 
    return { rows:shaped.length, ids:shaped.map((_,i)=>`row:${i+1}`)} 
  }
};

export default rightcap;