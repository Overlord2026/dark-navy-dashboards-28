/**
 * Advisor Client Invite Service
 * Integrates with existing leads-invite system and adds payment responsibility logic
 */

import { supabase } from '@/integrations/supabase/client';

export interface AdvisorInviteRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  clientSegment?: string;
  paymentResponsibility: 'advisor_paid' | 'client_paid';
  personalNote?: string;
}

/**
 * Send advisor invite with payment responsibility logic
 * Uses existing leads-invite edge function with enhanced features
 */
export async function sendAdvisorInvite(inviteData: AdvisorInviteRequest): Promise<{
  success: boolean;
  invitationId?: string;
  message: string;
}> {
  try {
    console.log('🚀 Sending advisor invite:', inviteData);
    
    const { data, error } = await supabase.functions.invoke('leads-invite', {
      body: {
        firstName: inviteData.firstName || 'Valued',
        lastName: inviteData.lastName || 'Client', 
        email: inviteData.email,
        clientSegment: inviteData.clientSegment || 'general',
        personalNote: inviteData.personalNote,
        paymentResponsibility: inviteData.paymentResponsibility,
        utmSource: 'advisor_platform',
        utmMedium: 'advisor_invite',
        utmCampaign: 'advisor_client_acquisition'
      }
    });

    if (error) {
      throw error;
    }

    console.log('✅ Invite sent successfully:', data);
    
    return {
      success: true,
      invitationId: data.invitationId,
      message: `Invitation sent to ${inviteData.email} ${
        inviteData.paymentResponsibility === 'advisor_paid' 
          ? '(you will be billed)' 
          : '(client will pay directly)'
      }`
    };

  } catch (error) {
    console.error('❌ Failed to send invite:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send invitation'
    };
  }
}

/**
 * Get advisor's recent invitations with payment status
 */
export async function getAdvisorInvitations(): Promise<any[]> {
  try {
    const { data: invitations, error } = await supabase
      .from('prospect_invitations')
      .select(`
        id,
        email,
        status,
        created_at,
        client_segment,
        payment_responsibility,
        activated_at
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return invitations || [];
  } catch (error) {
    console.error('Failed to fetch invitations:', error);
    return [];
  }
}

/**
 * Mock function for demo purposes
 */
export function sendInvite(email: string): void {
  console.log(`📧 Mock invite sent to: ${email}`);
  console.log('🎯 Intent: Send magic link invitation for advisor platform onboarding');
  console.log('🔗 Will integrate with existing leads-invite system');
}