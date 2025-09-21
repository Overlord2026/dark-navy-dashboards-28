export type InviteResult = { ok: boolean; persona?: string; path?: string; error?: string };

export function persistPendingInvite(token: string, persona?: string) {
  try { sessionStorage.setItem('pendingInvite', JSON.stringify({ token, persona, ts: Date.now() })); } catch {}
}

export function consumePendingInvite(): { token?: string; persona?: string; ts?: number } | null {
  try {
    const raw = sessionStorage.getItem('pendingInvite');
    if (!raw) return null;
    sessionStorage.removeItem('pendingInvite');
    return JSON.parse(raw);
  } catch { return null; }
}

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

  const saveLocal = (persona?: string) => {
    if (!persona) return;
    try { localStorage.setItem(`invite.accepted.${persona}`, '1'); } catch {}
  };

  // Try JSON wrapper first
  if (supabase?.rpc) {
    try {
      const { data, error } = await supabase.rpc('accept_invite_json', { invite_token: token });
      if (!error && data) {
        const persona = (data as any).persona ?? personaHint;
        const path = (data as any).target;
        saveLocal(persona);
        return { ok: true, persona, path };
      }
    } catch { /* continue */ }

    // Try legacy function returning TABLE(persona_group, target_path)
    try {
      const { data, error } = await supabase.rpc('accept_invite', { raw_token: token });
      if (!error && data) {
        // Supabase returns array for set-returning functions
        const row = Array.isArray(data) ? data[0] : data;
        const persona = (row?.persona_group as string) ?? personaHint;
        const path = (row?.target_path as string) ?? undefined;
        saveLocal(persona);
        return { ok: true, persona, path };
      }
    } catch { /* continue */ }
  }

  // Local fallback for demos
  const persona = personaHint || 'accountant';
  saveLocal(persona);
  return { ok: true, persona };
}

export function hasAcceptedPersona(persona: string): boolean {
  try { return localStorage.getItem(`invite.accepted.${persona}`) === '1'; } catch { return false; }
}