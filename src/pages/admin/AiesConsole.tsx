import * as React from 'react';
import { useAiesSSE } from '@/hooks/useAiesSSE';
import { supabase } from '@/integrations/supabase/client';

const AGENTS = ['HQ','CMO','CFO','COO','CLO','CTO'];

export default function AiesConsole() {
  const [agent, setAgent] = React.useState('HQ');
  const [to, setTo] = React.useState('CMO');
  const [kind, setKind] = React.useState<'request'|'answer'|'handoff'|'notify'>('request');
  const [summary, setSummary] = React.useState('');
  const [ttl, setTTL] = React.useState(4);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
  }, []);

  const streamUrl = `https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/aies-msg-stream`;
  const sendUrl   = `https://xcmqjkvyvuhoslbzmlgi.functions.supabase.co/aies-msg-send`;
  const events = useAiesSSE(streamUrl, agent, token);

  async function send() {
    const res = await fetch(sendUrl, {
      method:'POST',
      headers: {
        'content-type':'application/json',
        'authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ from_agent:agent, to_agent:to, msg_kind:kind, summary, ttl })
    });
    const j = await res.json();
    alert(res.ok ? 'Sent' : `Error: ${j.error ?? 'unknown'}`);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">AIES Console</h1>
      <div className="grid md:grid-cols-5 gap-3">
        <div>
          <label className="text-sm text-gray-400">From</label>
          <select value={agent} onChange={e=>setAgent(e.target.value)} className="w-full p-2 bg-black text-white border border-bfo-gold">
            {AGENTS.map(a=> <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">To</label>
          <select value={to} onChange={e=>setTo(e.target.value)} className="w-full p-2 bg-black text-white border border-bfo-gold">
            {AGENTS.filter(a=>a!==agent).map(a=> <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Kind</label>
          <select value={kind} onChange={e=>setKind(e.target.value as any)} className="w-full p-2 bg-black text-white border border-bfo-gold">
            <option>request</option><option>answer</option><option>handoff</option><option>notify</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">TTL</label>
          <input type="number" min={0} max={8} value={ttl} onChange={e=>setTTL(Number(e.target.value))} className="w-full p-2 bg-black text-white border border-bfo-gold" />
        </div>
        <div className="md:col-span-5">
          <label className="text-sm text-gray-400">Summary (non-PII)</label>
          <textarea value={summary} onChange={e=>setSummary(e.target.value)} rows={3} className="w-full p-2 bg-black text-white border border-bfo-gold" />
        </div>
        <div className="md:col-span-5">
          <button onClick={send} className="px-4 py-2 border border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black rounded">Send</button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl text-white">Events</h2>
        <div className="p-3 bg-black/70 border border-bfo-gold rounded max-h-96 overflow-auto text-sm text-gray-200">
          {events.map((e,i)=>(<pre key={i} className="whitespace-pre-wrap">{JSON.stringify(e,null,2)}</pre>))}
        </div>
      </div>
    </div>
  )
}