export type Persona = 'advisor'|'accountant'|'attorney'|'realtor'|'nil'|'smb';
export type Incumbent =
  | 'emoney'|'moneyguidepro'|'rightcapital'
  | 'ultratax'|'proseries'|'lacerte'|'drake'|'qbo'|'xero'
  | 'clio'|'mycase'
  | 'dotloop'|'docusign_rooms'
  | 'opendorse'|'athliance'
  | 'adp'|'gusto'|'rippling'
  | 'custom_csv'|'custom_api';

export type UploadFile = { name:string; type:string; bytes:Uint8Array };
export type Mapping = { [dstField:string]: { src?:string; transform?:string } };
export type Transform = (val:any)=>any;

export type DryRunResult = { rows:number; ok:number; errors:Array<{row:number; field:string; reason:string}>; preview:any[] };
export type CommitResult = { rows:number; ids:string[] };

export type Adapter = {
  key: Incumbent;
  label: string;
  persona: Persona;
  // optional helpers:
  detect?: (file:UploadFile)=>boolean;                 // sniff a file and guess the adapter
  templates?: Array<{ name:string; url?:string; fields:string[] }>;
  sample?: string;                                     // small CSV sample
  // lifecycle:
  read: (files:UploadFile[], options?:any)=>Promise<any[]>;       // parse to uniform rows
  defaultMapping: () => Mapping;                                   // prebuilt map
  transforms?: Record<string, Transform>;                           // named transforms
  dryRun: (rows:any[], map:Mapping)=>Promise<DryRunResult>;
  commit: (rows:any[], map:Mapping)=>Promise<CommitResult>;
};