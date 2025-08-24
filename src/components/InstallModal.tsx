import React from 'react';
import { installTool } from '@/lib/workspaceTools';
import { useNavigate } from 'react-router-dom';

export default function InstallModal({ toolKey, registryItem, onClose }: {
  toolKey: string, registryItem: any, onClose: () => void
}) {
  const nav = useNavigate();
  const [seed, setSeed] = React.useState(true);
  const { label, summary, routePriv, routePub } = registryItem || {};
  
  async function onInstall() { 
    await installTool(toolKey, seed); 
    onClose(); 
    if (routePriv) nav(routePriv); 
  }
  
  function onPreview() { 
    onClose(); 
    nav(routePub || `/preview/${toolKey}`); 
  }
  
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl p-6 bg-white">
        <h2 className="text-xl font-semibold">{label || 'Install tool'}</h2>
        <p className="mt-2 text-sm text-gray-600">{summary}</p>
        {routePriv ? (
          <>
            <label className="mt-4 flex items-center gap-2">
              <input type="checkbox" checked={seed} onChange={e => setSeed(e.target.checked)} />
              <span>Seed with demo data</span>
            </label>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onInstall} className="rounded-xl px-4 py-2 text-[#0A0A0A] border border-[#D4AF37] bg-[#D4AF37]">Install & Open</button>
              <button onClick={onPreview} className="rounded-xl px-4 py-2 border">Preview first</button>
              <button onClick={onClose} className="ml-auto text-sm">Cancel</button>
            </div>
          </>
        ) : (
          <div className="mt-6 flex items-center gap-3">
            <button onClick={onPreview} className="rounded-xl px-4 py-2 text-[#0A0A0A] border border-[#D4AF37] bg-[#D4AF37]">View Preview</button>
            <button onClick={onClose} className="ml-auto text-sm">Close</button>
          </div>
        )}
        <p className="mt-4 text-xs text-gray-500">Smart Checks • Proof Slips • Secure Vault (Keep-Safe/Legal Hold) • Time-Stamp.</p>
      </div>
    </div>
  );
}