import type { Adapter } from '../types';
import { logDryRun, logCommit } from '../receipts';

const apiAdapter: Adapter = {
  key:'custom_api', 
  label:'Custom API', 
  persona:'advisor',
  async read(files, options){ 
    // TODO: call incumbent API with options.apiKey
    return []; 
  },
  defaultMapping(){ 
    return {}; 
  },
  async dryRun(rows){ 
    await logDryRun('custom_api', rows.length, rows.length, 0); 
    return { 
      rows: rows.length, 
      ok: rows.length, 
      errors:[], 
      preview: rows.slice(0,5)
    }; 
  },
  async commit(rows){ 
    await logCommit('custom_api', rows.length); 
    return { 
      rows: rows.length, 
      ids: rows.map((_,i)=>`row:${i+1}`) 
    }; 
  }
};

export default apiAdapter;