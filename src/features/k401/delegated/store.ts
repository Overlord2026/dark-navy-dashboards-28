import type { DelegatedGrant, DelegatedSession } from './types';

let GRANTS: Record<string,DelegatedGrant> = {};
let SESSIONS: Record<string,DelegatedSession> = {};

export async function upsertGrant(g: DelegatedGrant) { 
  GRANTS[g.grantId] = g; 
  return g; 
}

export async function getGrant(grantId: string) { 
  return GRANTS[grantId]; 
}

export async function listGrantsForClient(clientUserId: string) { 
  return Object.values(GRANTS).filter(g => g.clientUserId === clientUserId); 
}

export async function upsertSession(s: DelegatedSession) { 
  SESSIONS[s.sessionId] = s; 
  return s; 
}

export async function getSession(sessionId: string) { 
  return SESSIONS[sessionId]; 
}

export async function listSessionsByAdvisor(advisorUserId: string) { 
  return Object.values(SESSIONS).filter(s => s.advisorUserId === advisorUserId); 
}