/**
 * Mock invite service for advisor family invitations
 * Replace with real implementation when backend is ready
 */

export interface InviteResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

export async function sendInvite(email: string): Promise<InviteResponse> {
  console.log('📧 Sending family invite to:', email);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock validation
  if (!email || !email.includes('@')) {
    return {
      ok: false,
      error: 'Invalid email address'
    };
  }
  
  console.log('✅ Family invite queued successfully for:', email);
  
  return {
    ok: true,
    message: 'Invite queued successfully'
  };
}