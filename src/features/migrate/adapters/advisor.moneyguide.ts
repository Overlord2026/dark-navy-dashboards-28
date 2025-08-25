import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const moneyguide: Adapter = {
  key:'moneyguidepro', 
  label:'MoneyGuidePro (CSV)', 
  persona:'advisor',
  async read(files){ 
    const f=files.find(x=>x.name.endsWith('.csv')); 
    if(!f) throw new Error('CSV required'); 
    const t=new TextDecoder().decode(f.bytes); 
    return parseCSV(t); 
  },
  defaultMapping(){ 
    return { 
      householdId:{src:'ClientID'}, 
      firstName:{src:'First'}, 
      lastName:{src:'Last'}, 
      incomeAnnual:{src:'Income', transform:'toNumber'}, 
      riskScore:{src:'Risk'} 
    }; 
  },
  transforms:{ 
    toNumber:(v:any)=> Number(String(v||0).replace(/[^0-9.\-]/g,'')) 
  },
  async dryRun(rows, map){ 
    const shaped=applyMapping(rows,map,moneyguide.transforms); 
    const res=validateRows(shaped,['householdId','firstName','lastName']); 
    await logDryRun('moneyguidepro', res.rows, res.ok, res.errors.length); 
    return { ...res, preview:shaped.slice(0,5)}; 
  },
  async commit(rows,map){ 
    const shaped=applyMapping(rows,map,moneyguide.transforms); 
    await logCommit('moneyguidepro', shaped.length); 
    return { rows:shaped.length, ids:shaped.map((_,i)=>`row:${i+1}`)} 
  }
};

export default moneyguide;