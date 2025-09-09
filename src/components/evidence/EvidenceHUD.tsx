import React, { useEffect, useState } from "react";
import { listReceipts, replay, type RDS } from "@/lib/dataAdapter";

export default function EvidenceHUD() {
  const [receipts, setReceipts] = useState<RDS[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    loadReceipts();
  }, []);

  async function loadReceipts() {
    const data = await listReceipts();
    setReceipts(data);
  }

  async function handleReplay(receipt: RDS) {
    const result = await replay(receipt.family || 'general', receipt.id);
    alert(JSON.stringify(result, null, 2));
  }

  const filtered = receipts.filter(r => 
    !filter || r.family?.includes(filter) || r.type.includes(filter)
  );

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Evidence HUD</h3>
        <input
          placeholder="Filter by family or type..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-1 border rounded"
        />
      </div>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Family</th>
            <th className="text-left p-2">Created</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(receipt => (
            <tr key={receipt.id} className="border-b">
              <td className="p-2">{receipt.type}</td>
              <td className="p-2">{receipt.family}</td>
              <td className="p-2">{new Date(receipt.created_at).toLocaleString()}</td>
              <td className="p-2">
                <button 
                  onClick={() => handleReplay(receipt)}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Replay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}