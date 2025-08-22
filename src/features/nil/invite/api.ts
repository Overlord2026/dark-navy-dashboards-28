import { ConsentRDS } from '@/features/receipts/types';
import { recordReceipt } from '@/features/receipts/record';
import { anchorBatch } from '@/features/anchor/simple-providers';

export interface PendingInvite {
  id: string;
  role: 'advisor' | 'cpa' | 'attorney';
  email: string;
  accepted: boolean;
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
  acceptedAt?: string;
}

const pendings: PendingInvite[] = [];

export function invite(role: 'advisor' | 'cpa' | 'attorney', email: string): { pendingId: string } {
  const id = `pend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const invite: PendingInvite = {
    id,
    role,
    email,
    accepted: false,
    status: 'pending',
    invitedAt: new Date().toISOString()
  };

  pendings.push(invite);
  
  console.info('nil.invite.sent', { pendingId: id, role, email });
  return { pendingId: id };
}

export function accept(pendingId: string): { accepted: boolean; invite?: PendingInvite } {
  const p = pendings.find(x => x.id === pendingId);
  if (p && !p.accepted) {
    p.accepted = true;
    p.status = 'accepted';
    p.acceptedAt = new Date().toISOString();
    console.info('nil.invite.accepted', { id: pendingId, role: p.role, email: p.email });
    return { accepted: true, invite: p };
  }
  return { accepted: false };
}

export function list(): PendingInvite[] {
  return [...pendings];
}

export function getAcceptedTeam(): PendingInvite[] {
  return pendings.filter(p => p.accepted);
}

export function getActivePendingInvites(): PendingInvite[] {
  return pendings.filter(p => !p.accepted);
}

// For backwards compatibility
export const getInvites = list;
export const getPendingInvites = getActivePendingInvites;