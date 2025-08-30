import React from 'react';
import { callEdgeJSON } from '@/services/aiEdge';
// remove any old imports of useRealtimeVoice if not used
// import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';

export interface VoiceDrawerProps {
  /** Optional controlled open state; if omitted, component manages its own */
  open?: boolean;
  /** Optional controlled close handler; used only when `open` is provided */
  onClose?: () => void;
  /** Persona key for policy guardrails (e.g., "family","advisor","cpa","attorney","insurance","nil") */
  persona: string;
  /** Edge function endpoint slug; defaults to 'meeting-summary' */
  endpoint?: string;
  /** Optional label for the trigger button; if omitted, render icon button */
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
  const [consent, setConsent] = React.useState(false);
  const [handoff, setHandoff] = React.useState<string | null>(null);

  const open = controlledOpen ?? internalOpen;
  const close = () => (controlledOnClose ? controlledOnClose() : setInternalOpen(false));
  const openSelf = () => setInternalOpen(true);

  async function onSend() {
    if (!notes.trim()) return;
    setBusy(true);
    try {
      const data = await callEdgeJSON(endpoint, { notes, persona });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Trigger */}
      {triggerLabel ? (
        <button type="button" onClick={openSelf} className="btn btn-outline">
          {triggerLabel}
        </button>
      ) : (
        <button aria-label="Open voice assistant" onClick={openSelf} className="icon-button">🎤</button>
      )}

      {/* Drawer */}
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 bg-black/30">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Voice Assistant</h3>
              <button onClick={close} className="text-sm text-gray-600">Close</button>
            </div>

            <div className="mb-2 text-xs text-gray-500">
              Persona: <span className="font-mono">{persona}</span>
            </div>

            <label className="block text-sm font-medium mb-1">Consent</label>
            <div className="flex gap-2 items-center mb-3 text-sm">
              <input id="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
              <label htmlFor="consent">I understand this is educational, not advice; data may be summarized with policy guardrails.</label>
            </div>

            <label className="block text-sm font-medium mb-1">Speak/type your notes</label>
            <textarea
              className="w-full h-32 border rounded p-2 text-sm"
              placeholder="e.g., Compare rollover vs. stay in plan; list fees and pros/cons…"
              value={notes}
              onChange={e=>setNotes(e.target.value)}
            />

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                disabled={!consent || busy || !notes.trim()}
                onClick={onSend}
                className="btn btn-primary"
              >
                {busy ? 'Summarizing…' : 'Generate summary'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={()=>setHandoff('Please schedule with a licensed professional.')}>
                Request human hand-off
              </button>
            </div>

            {handoff && <p className="mt-2 text-xs text-amber-700">{handoff}</p>}

            {result && (
              <div className="mt-4 p-3 bg-gray-50 border rounded text-sm whitespace-pre-wrap">
                {result.summary ?? JSON.stringify(result, null, 2)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceDrawer;