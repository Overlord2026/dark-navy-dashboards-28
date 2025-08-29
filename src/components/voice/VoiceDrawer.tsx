import React from 'react';
import { callEdgeJSON } from '@/services/aiEdge';
import { VoiceMicButton } from './VoiceMicButton';

interface VoiceDrawerProps {
  open?: boolean; 
  onClose?: () => void; 
  persona: string; 
  endpoint?: string;
  triggerLabel?: string;
}

export function VoiceDrawer({ 
  open: controlledOpen, 
  onClose: controlledOnClose, 
  persona, 
  endpoint = 'meeting-summary',
  triggerLabel 
}: VoiceDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onClose = controlledOnClose || (() => setInternalOpen(false));

  async function onSend() {
    if (!notes.trim()) return;
    setBusy(true);
    try {
      const data = await callEdgeJSON(endpoint, { notes, persona });
      setResult(data);
    } catch (e:any) {
      setResult({ error: e.message });
    } finally {
      setBusy(false);
    }
  }

  // If triggerLabel is provided, render the button + drawer
  if (triggerLabel) {
    return (
      <>
        <VoiceMicButton onClick={() => setInternalOpen(true)}>
          {triggerLabel}
        </VoiceMicButton>
        {internalOpen && (
          <VoiceDrawerContent 
            open={internalOpen}
            onClose={() => setInternalOpen(false)}
            persona={persona}
            notes={notes}
            setNotes={setNotes}
            busy={busy}
            result={result}
            onSend={onSend}
            setResult={setResult}
          />
        )}
      </>
    );
  }

  // Otherwise just render the drawer if open
  if (!open) return null;
  
  return (
    <VoiceDrawerContent 
      open={open}
      onClose={onClose}
      persona={persona}
      notes={notes}
      setNotes={setNotes}
      busy={busy}
      result={result}
      onSend={onSend}
      setResult={setResult}
    />
  );
}

interface VoiceDrawerContentProps {
  open: boolean;
  onClose: () => void;
  persona: string;
  notes: string;
  setNotes: (notes: string) => void;
  busy: boolean;
  result: any;
  onSend: () => void;
  setResult: (result: any) => void;
}

function VoiceDrawerContent({ 
  open, 
  onClose, 
  persona, 
  notes, 
  setNotes, 
  busy, 
  result, 
  onSend,
  setResult
}: VoiceDrawerContentProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div className="absolute top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-xl p-4 overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Ask BFO <span className="text-xs text-muted-foreground">({persona})</span></h3>
          <button className="text-sm" onClick={onClose}>Close</button>
        </div>
        <div className="text-xs rounded border p-2 bg-amber-50 text-amber-900 mb-2">
          Educational assistance only. Not financial, tax, or legal advice. Consult your professional.
        </div>
        <textarea className="w-full border rounded p-2 mb-2" rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Type or paste notes..." />
        <div className="flex gap-2">
          <button disabled={busy} className="px-3 py-1.5 rounded bg-emerald-600 text-white disabled:opacity-50" onClick={onSend}>
            {busy ? 'Thinking…' : 'Send'}
          </button>
          <button className="px-3 py-1.5 rounded bg-slate-200" onClick={()=>{ setNotes(''); setResult(null); }}>Clear</button>
        </div>
        {result && <pre className="mt-3 text-xs bg-slate-50 border rounded p-2 overflow-auto max-h-72">{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}