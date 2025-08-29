import React from 'react';
import { callEdgeJSON } from '@/services/aiEdge';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { personaBanner, ADVICE_GUARDS } from '@/policy/adviceGuard';
import type { PersonaKey } from '@/policy/adviceGuard';

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
  endpoint = 'generate-meeting-summary',
  triggerLabel 
}: VoiceDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [consent, setConsent] = React.useState(false);
  const [handoff, setHandoff] = React.useState<string | null>(null);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onClose = controlledOnClose || (() => setInternalOpen(false));

  // Helper: coerce runtime persona -> PersonaKey with safe default
  const personaKey = ((): PersonaKey => {
    const keys: PersonaKey[] = [
      'families_retiree','families_aspiring','advisors','insurance','cpa','attorney','nil'
    ];
    return (keys as readonly string[]).includes(persona) ? (persona as PersonaKey) : 'families_retiree';
  })();

  function findMatch(q: string, phrases: string[]): string | null {
    const t = q.toLowerCase();
    for (const p of phrases) {
      if (t.includes(p.toLowerCase())) return p;
    }
    return null;
  }

  async function logConsentAndGuard(kind: 'start' | 'send', reason?: string) {
    try {
      const [{ recordReceipt }, { inputs_hash }] = await Promise.all([
        import('@/services/receipts'),
        import('@/lib/canonical')
      ]).catch(()=>[{recordReceipt:undefined as any},{inputs_hash: async()=> 'sha256:none'}]);

      if (recordReceipt) {
        if (kind === 'start') {
          await recordReceipt({
            type:'Consent-RDS',
            persona: personaKey,
            passport_version:'CP-2025.08'
          });
        }
        await recordReceipt({
          type:'AdviceGuard-RDS',
          persona: personaKey,
          banner_hash: await inputs_hash({ banner: personaBanner(personaKey) }),
          policy_version:'AG-2025.08',
          result: reason ? reason : 'educational'
        });
      }
    } catch { /* no-op if receipts are not wired yet */ }
  }

  async function onSend() {
    if (!notes.trim()) return;
    if (!consent) { setResult({ error: 'Please acknowledge the consent checkbox first.' }); return; }

    // Guardrails: block forbidden topics, suggest human handoff when appropriate
    const guards = ADVICE_GUARDS[personaKey];
    const blocked = findMatch(notes, guards?.forbidden ?? []);
    if (blocked) {
      setHandoff(null);
      setResult({
        blocked: true,
        message: `I can't assist with that topic here (restricted: "${blocked}"). Please consult the appropriate professional.`,
      });
      await logConsentAndGuard('send','blocked_forbidden_topic');
      return;
    }
    const suggest = findMatch(notes, guards?.mustSuggestHuman ?? []);
    if (suggest) {
      setHandoff(`This request ("${suggest}") typically requires a licensed professional. I can outline general steps, but please schedule with your advisor/compliance office.`);
      await logConsentAndGuard('send','handoff_suggested');
    } else {
      setHandoff(null);
      await logConsentAndGuard('send');
    }

    setBusy(true);
    try {
      const data = await callEdgeJSON(endpoint, { notes, persona });
      setResult(data);
      
      // Save meeting note on success (fail open)
      try {
        const { saveMeetingNote } = await import('@/services/notes');
        await saveMeetingNote({ persona, text: notes });
      } catch (noteError) {
        console.warn('Failed to save meeting note:', noteError);
      }
    } catch (e:any) {
      setResult({ error: e.message });
    } finally {
      setBusy(false);
    }
  }

  // Add guardrails for WebRTC live start as well
  async function onLiveStart() {
    if (!consent) {
      setResult({ error: 'Please acknowledge the consent checkbox first.' });
      return;
    }
    // If the user has prefilled notes, apply the same forbidden/handoff logic
    const guards = ADVICE_GUARDS[personaKey];
    if (notes.trim()) {
      const blocked = findMatch(notes, guards?.forbidden ?? []);
      if (blocked) {
        setHandoff(null);
        setResult({
          blocked: true,
          message: `I can't assist with that topic here (restricted: "${blocked}"). Please consult the appropriate professional.`,
        });
        await logConsentAndGuard('start','blocked_forbidden_topic');
        return;
      }
      const suggest = findMatch(notes, guards?.mustSuggestHuman ?? []);
      if (suggest) {
        setHandoff(`This request ("${suggest}") typically requires a licensed professional. I can outline general steps, but please schedule with your advisor/compliance office.`);
        await logConsentAndGuard('start','handoff_suggested');
      } else {
        setHandoff(null);
        await logConsentAndGuard('start');
      }
    } else {
      // No notes provided; still record consent+guard
      setHandoff(null);
      await logConsentAndGuard('start');
    }
    // Start WebRTC session through your ephemeral token function
    try {
      const { start } = await import('@/hooks/useRealtimeVoice');
      // Note: start function should come from useRealtimeVoice hook in VoiceDrawerContent
      // For now, this is a placeholder - the actual start will be called via onLiveStart prop
    } catch (e:any) {
      setResult({ error: e?.message ?? 'Failed to start live session' });
    }
  }

  // If triggerLabel is provided, render the button + drawer
  if (triggerLabel) {
    return (
      <>
        <button 
          onClick={() => setInternalOpen(true)}
          className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {triggerLabel}
        </button>
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
            onLiveStart={onLiveStart}
            handoff={handoff}
            consent={consent}
            setConsent={setConsent}
            personaKey={personaKey}
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
      onLiveStart={onLiveStart}
      handoff={handoff}
      consent={consent}
      setConsent={setConsent}
      personaKey={personaKey}
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
  onLiveStart: () => Promise<void>;
  handoff: string | null;
  consent: boolean;
  setConsent: (consent: boolean) => void;
  personaKey: PersonaKey;
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
  setResult,
  onLiveStart,
  handoff,
  consent,
  setConsent,
  personaKey
}: VoiceDrawerContentProps) {
  const { ready, live, error, start, stop, audioElRef } = useRealtimeVoice();
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div className="absolute top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-xl p-4 overflow-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Ask BFO <span className="text-xs text-muted-foreground">({personaKey})</span></h3>
          <button className="text-sm" onClick={onClose}>Close</button>
        </div>
        <div className="text-xs rounded border p-2 bg-amber-50 text-amber-900 mb-2">
          {personaBanner(personaKey)}
        </div>
        <label className="flex items-center gap-2 text-xs mb-2">
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          <span>I understand this is educational only and not advice.</span>
        </label>
        <div className="mt-3 space-y-2">
          <div className="text-xs text-slate-600">
            Live assistant (WebRTC). Your mic is used during a session; nothing is stored unless you choose to save.
          </div>
          <audio ref={audioElRef} autoPlay />
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await onLiveStart();
                if (!error) {
                  await start({ tokenPath: '/functions/v1/realtime-ephemeral-token' });
                }
              }}
              disabled={!ready || live}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white disabled:opacity-50"
            >
              {ready ? (live ? 'Live…' : 'Go Live') : 'WebRTC unsupported'}
            </button>
            <button onClick={stop} disabled={!live} className="px-3 py-1.5 rounded bg-slate-200">Stop</button>
          </div>
          {error && <div className="text-xs text-red-600">Voice error: {error}</div>}
        </div>
        <textarea className="w-full border rounded p-2 mb-2" rows={5} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Type or paste notes..." />
        <div className="flex gap-2">
          <button disabled={busy} className="px-3 py-1.5 rounded bg-emerald-600 text-white disabled:opacity-50" onClick={onSend}>
            {busy ? 'Thinking…' : 'Send'}
          </button>
          <button className="px-3 py-1.5 rounded bg-slate-200" onClick={()=>{ setNotes(''); setResult(null); }}>Clear</button>
        </div>
        {handoff && (
          <div className="mt-2 text-xs rounded border p-2 bg-blue-50 text-blue-900">
            {handoff} <a className="underline" href="/book/advisors">Book a call</a>
          </div>
        )}
        {result && <pre className="mt-3 text-xs bg-slate-50 border rounded p-2 overflow-auto max-h-72">{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </div>
  );
}