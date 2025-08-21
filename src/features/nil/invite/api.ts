export interface PendingInvite {
  id: string;
  role: 'advisor' | 'cpa' | 'attorney';
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
  acceptedAt?: string;
}

const invites: PendingInvite[] = [];

export function invite(role: 'advisor' | 'cpa' | 'attorney', email: string): string {
  const pendingId = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const invite: PendingInvite = {
    id: pendingId,
    role,
    email,
    status: 'pending',
    invitedAt: new Date().toISOString()
  };

  invites.push(invite);
  
  console.info('invite.sent', { pendingId, role, email });
  
  return pendingId;
}

export function accept(pendingId: string): boolean {
  const invite = invites.find(i => i.id === pendingId);
  if (!invite) {
    throw new Error('Invite not found');
  }

  if (invite.status !== 'pending') {
    throw new Error('Invite already processed');
  }

  invite.status = 'accepted';
  invite.acceptedAt = new Date().toISOString();
  
  console.info('invite.accepted', { pendingId, role: invite.role });
  
  return true;
}

export function getInvites(): PendingInvite[] {
  return [...invites];
}

export function getPendingInvites(): PendingInvite[] {
  return invites.filter(i => i.status === 'pending');
}