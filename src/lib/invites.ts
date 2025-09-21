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
  // Try existing supabase client if project has it
  let supabase: any = null;
  try {
    const m = await import('@/lib/supabase'); // use actual supabase client path
    supabase = (m as any).supabase || (m as any).default || m;
  } catch {
    // no-op
  }

  // 1) Preferred: call RPC if available
  if (supabase?.rpc) {
    try {
      const { data, error } = await supabase.rpc('accept_invite', { invite_token: token });
      if (error) throw error;
      const persona = (data?.persona as string) || personaHint;
      if (persona) localStorage.setItem(`invite.accepted.${persona}`, '1');
      return { ok: true, persona };
    } catch (e: any) {
      // fall through to local mode
    }
  }

  // 2) Fallback: store acceptance locally so flows demo in MVP
  const persona = personaHint || 'accountant'; // sensible default for CPA invites
  try {
    localStorage.setItem(`invite.accepted.${persona}`, '1');
  } catch {}
  return { ok: true, persona };
}

export function hasAcceptedPersona(persona: string): boolean {
  try { return localStorage.getItem(`invite.accepted.${persona}`) === '1'; } catch { return false; }
}