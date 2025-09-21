import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { acceptInvite, hubForPersona, persistPendingInvite } from '@/lib/invites';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing your invite…');

  useEffect(() => {
    const run = async () => {
      if (!token) { setStatus('error'); setMessage('Missing invite token.'); return; }
      const personaHint = sp.get('persona') || undefined;

      // Check auth session (defensive for v2)
      let hasSession = false;
      try {
        const m = await import('@/integrations/supabase/client');
        const sb = (m as any).supabase || (m as any).default || m;
        if (sb?.auth?.getSession) {
          const { data } = await sb.auth.getSession();
          hasSession = !!data?.session;
        } else if (sb?.auth?.user) {
          hasSession = !!sb.auth.user();
        }
      } catch {}

      if (!hasSession) {
        // persist and bounce to auth with redirect back to invite
        persistPendingInvite(token, personaHint);
        const next = encodeURIComponent(`/invite/${token}${personaHint ? `?persona=${personaHint}` : ''}`);
        navigate(`/auth?redirect=${next}`, { replace: true });
        return;
      }

      // Accept + redirect
      const res = await acceptInvite(token, personaHint);
      if (res.ok) {
        const target = res.path || hubForPersona(res.persona || personaHint);
        setStatus('ok'); setMessage('Invite accepted. Redirecting…');
        setTimeout(() => navigate(target, { replace: true }), 600);
      } else {
        setStatus('error'); setMessage(res.error || 'Invite could not be accepted.');
      }
    };
    run();
  }, [token, sp, navigate]);

  return (
    <div className="container mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Invite</h1>
      <p className="text-muted-foreground">{message}</p>
      {status === 'error' && (
        <a href="/pros" className="inline-flex mt-6 rounded-lg border px-4 py-2">
          Go to Professionals
        </a>
      )}
    </div>
  );
}