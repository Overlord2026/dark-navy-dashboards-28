import React from 'react';
import { useParams, Link } from 'react-router-dom';
import catalog from '@/config/catalogConfig.json';

export default function PreviewPage(){
  const { key } = useParams();
  const item:any = (catalog as any[]).find(i=> i.key === key);
  if (!item) return <div className="p-6">Not found.</div>;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">{item.label}</h1>
      <p className="mt-2 text-gray-600">{item.summary}</p>
      <span className="inline-block mt-3 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">Coming soon</span>
      <div className="mt-6 space-x-3">
        {item.demoId && <Link className="underline" to={`/demos/${item.demoId}`}>See 60-second demo</Link>}
        <button className="rounded-xl px-4 py-2 border">Share</button>
      </div>
      <p className="mt-8 text-xs text-gray-500">Smart Checks • Proof Slips • Secure Vault (Keep-Safe/Legal Hold) • Time-Stamp.</p>
    </div>
  );
}