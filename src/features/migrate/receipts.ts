import { recordReceipt } from '@/features/receipts/record';

export async function logUpload(adapterKey:string, fileName:string){
  await recordReceipt({ 
    type:'Vault-RDS', 
    bucket:'Keep-Safe', 
    file_id:`vault://import/${adapterKey}/${fileName}`, 
    created_at:new Date().toISOString() 
  } as any);
  await recordReceipt({ 
    type:'Decision-RDS', 
    action:'migrate.upload', 
    reasons:[adapterKey,fileName], 
    created_at:new Date().toISOString() 
  } as any);
}

export async function logDryRun(adapterKey:string, rows:number, ok:number, errs:number){
  await recordReceipt({ 
    type:'Decision-RDS', 
    action:'migrate.dryrun', 
    reasons:[adapterKey,`rows:${rows}`,`ok:${ok}`,`err:${errs}`], 
    created_at:new Date().toISOString() 
  } as any);
}

export async function logCommit(adapterKey:string, count:number){
  await recordReceipt({ 
    type:'Decision-RDS', 
    action:'migrate.commit', 
    reasons:[adapterKey,`rows:${count}`], 
    created_at:new Date().toISOString() 
  } as any);
}