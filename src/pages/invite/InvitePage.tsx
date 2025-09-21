import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { acceptInvite, hubForPersona } from '@/lib/invites';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing your invite…');

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus('error'); setMessage('Missing invite token.'); return;
      }
      const personaHint = sp.get('persona') || undefined;
      const res = await acceptInvite(token, personaHint);
      if (res.ok) {
        const target = hubForPersona(res.persona || personaHint);
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