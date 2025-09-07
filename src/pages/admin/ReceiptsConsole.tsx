import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Receipt = { 
  id: string; 
  stage: "pre"|"post"; 
  created_at: string; 
  decision: string; 
  request_hash: string; 
  anchor_status: string; 
};

export default function ReceiptsConsole() {
  const [rows,setRows] = useState<Receipt[]>([]);
  const [err,setErr] = useState<string|null>(null);
  
  useEffect(()=>{ 
    (async()=>{
      try {
        const { data, error } = await supabase
          .from("receipts")
          .select("id,stage,created_at,decision,request_hash,anchor_status")
          .order("created_at",{ascending:false})
          .limit(100);
        
        if (error) {
          setErr(error.message); 
        } else if (data) {
          setRows((data as unknown) as Receipt[]);
        }
      } catch (error) {
        setErr(error instanceof Error ? error.message : 'Failed to load receipts');
      }
    })(); 
  },[]);
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Receipts Console</h2>
      {err && <div className="text-red-600">{err}</div>}
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">ID</th>
            <th className="py-2 pr-4">Stage</th>
            <th className="py-2 pr-4">Decision</th>
            <th className="py-2 pr-4">Anchor</th>
            <th className="py-2 pr-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} className="border-b">
              <td className="py-2 pr-4">{r.id.slice(0,8)}…</td>
              <td className="py-2 pr-4">{r.stage}</td>
              <td className="py-2 pr-4">{r.decision}</td>
              <td className="py-2 pr-4">{r.anchor_status}</td>
              <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}