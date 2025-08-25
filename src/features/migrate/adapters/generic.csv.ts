import type { Adapter } from '../types';
import { parseCSV } from '../io';
import { applyMapping } from '../mapping';
import { validateRows } from '../validator';
import { logDryRun, logCommit } from '../receipts';

const csvAdapter: Adapter = {
  key:'custom_csv', 
  label:'Custom CSV', 
  persona:'advisor',
  async read(files){
    const file = files.find(f=>f.name.toLowerCase().endsWith('.csv')); 
    if(!file) throw new Error('CSV required');
    const text = new TextDecoder().decode(file.bytes); 
    return parseCSV(text);
  },
  defaultMapping(){ 
    return { 
      householdId:{src:'HouseholdId'}, 
      firstName:{src:'First'}, 
      lastName:{src:'Last'}, 
      email:{src:'Email'}, 
      accountNumber:{src:'Acct'}, 
      balance:{src:'Balance', transform:'toNumber'} 
    };
  },
  transforms:{ 
    toNumber:(v:any)=> Number(String(v||0).replace(/[^0-9.\-]/g,'')) 
  },
  async dryRun(rows, map){
    const shaped = applyMapping(rows, map, csvAdapter.transforms);
    const res = validateRows(shaped, ['householdId','firstName','lastName']);
    await logDryRun('custom_csv', res.rows, res.ok, res.errors.length);
    return { ...res, preview: shaped.slice(0,5) };
  },
  async commit(rows, map){
    const shaped = applyMapping(rows, map, csvAdapter.transforms);
    // TODO: write to your domain (e.g., create households/accounts)
    await logCommit('custom_csv', shaped.length);
    return { rows: shaped.length, ids: shaped.map((_,i)=>`row:${i+1}`) };
  }
};

export default csvAdapter;