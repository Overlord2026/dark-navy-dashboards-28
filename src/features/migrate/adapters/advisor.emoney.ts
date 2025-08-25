import type { Adapter } from '../types';
import { parseCSV, parseJSON } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const emoney: Adapter = {
  key:'emoney', 
  label:'eMoney (CSV/JSON export)', 
  persona:'advisor',
  async read(files){
    const csv = files.find(f=>f.name.endsWith('.csv')); 
    const json = files.find(f=>f.name.endsWith('.json'));
    if (csv){ 
      const t=new TextDecoder().decode(csv.bytes); 
      return parseCSV(t); 
    }
    if (json){ 
      const t=new TextDecoder().decode(json.bytes); 
      return parseJSON(t); 
    }
    throw new Error('Upload eMoney CSV or JSON export');
  },
  defaultMapping(){ 
    return { 
      householdId:{src:'ClientID'}, 
      firstName:{src:'FirstName'}, 
      lastName:{src:'LastName'}, 
      email:{src:'Email'}, 
      goalRetireAge:{src:'RetAge', transform:'toNumber'}, 
      expensesMonthly:{src:'Expenses', transform:'toNumber'} 
    };
  },
  transforms:{ 
    toNumber:(v:any)=> Number(String(v||0).replace(/[^0-9.\-]/g,'')) 
  },
  async dryRun(rows, map){
    const shaped = applyMapping(rows, map, emoney.transforms); 
    const res = validateRows(shaped,['householdId','firstName','lastName']); 
    await logDryRun('emoney', res.rows, res.ok, res.errors.length); 
    return { ...res, preview: shaped.slice(0,5) };
  },
  async commit(rows, map){ 
    const shaped = applyMapping(rows, map, emoney.transforms); 
    // TODO: write to domain
    await logCommit('emoney', shaped.length); 
    return { rows:shaped.length, ids: shaped.map((_,i)=>`row:${i+1}`) };
  }
};

export default emoney;