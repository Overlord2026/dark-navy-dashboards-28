export type InviteResult = { ok: boolean; persona?: string; error?: string };

const personaToHub: Record<string, string> = {
  advisor: '/pros/advisors',
  accountants: '/pros/accountants',
  accountant: '/pros/accountants',
  attorneys: '/pros/attorneys',
  attorney: '/pros/attorneys',
  family: '/families',
};

export function hubForPersona(persona?: string): string {
  if (!persona) return '/pros';
  const key = persona.toLowerCase();
  return personaToHub[key] ?? '/pros';
}

export async function acceptInvite(token: string, personaHint?: string): Promise<InviteResult> {
  let supabase: any = null;
  try {
    const m = await import('@/lib/supabase');
    supabase = (m as any).supabase || (m as any).default || m;
  } catch {}

  const tryRPC = async (fn: string) => {
    if (!supabase?.rpc) return { ok: false } as any;
    try {
      const { data, error } = await supabase.rpc(fn, { invite_token: token });
      if (error) throw error;

      // handle both shapes: jsonb object or text
      let persona: string | undefined = personaHint;
      if (data && typeof data === 'object' && 'persona' in data) {
        persona = (data as any).persona as string;
      } else if (typeof data === 'string') {
        persona = data;
      }
      if (persona) {
        try { localStorage.setItem(`invite.accepted.${persona}`, '1'); } catch {}
      }
      return { ok: true, persona } as InviteResult;
    } catch {
      return { ok: false } as any;
    }
  };

  // Prefer the new JSON-returning RPC; then try legacy; then local fallback
  for (const fn of ['accept_invite_json', 'accept_invite']) {
    const res = await tryRPC(fn);
    if (res.ok) return res;
  }

  // Local fallback for MVP demos
  const persona = personaHint || 'accountant';
  try { localStorage.setItem(`invite.accepted.${persona}`, '1'); } catch {}
  return { ok: true, persona };
}

export function hasAcceptedPersona(persona: string): boolean {
  try { return localStorage.getItem(`invite.accepted.${persona}`) === '1'; } catch { return false; }
}