/**
 * Social Graph Invite Engine - Core Inviter Service
 * Content-free invite generation, sending, and tracking
 */

import { supabase } from '@/integrations/supabase/client';
import { inputs_hash } from '@/lib/canonical';
import { recordReceipt } from '@/services/receipts';
import type { NormalizedProfile } from './profileNormalizer';

export interface CampaignContext {
  campaign_id: string;
  metro?: string;
  specialty?: string;
  channel: 'email' | 'sms';
  inviter_id?: string;
}

export interface InviteRecord {
  id: string;
  persona: 'agent' | 'family';
  inviter_id?: string;
  target_profile_url?: string;
  email_hash?: string;
  phone_hash?: string;
  token_hash: string;
  deep_link: string;
  context: CampaignContext;
  status: string;
  created_at: string;
}

/**
 * Generate a secure invite token
 */
async function generateInviteToken(): Promise<string> {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return token;
}

/**
 * Create invites from normalized profiles
 */
export async function createInvites(
  profiles: NormalizedProfile[],
  campaignCtx: CampaignContext
): Promise<InviteRecord[]> {
  const invites: InviteRecord[] = [];

  for (const profile of profiles) {
    try {
      // Generate secure token
      const token = await generateInviteToken();
      const token_hash = await inputs_hash({ token });

      // Create deep link based on persona
      let deep_link: string;
      if (profile.persona === 'agent') {
        const slug = `${profile.tokens.market || 'agent'}-${Date.now()}`;
        deep_link = `/a/preview?slug=${slug}&i=${token}`;
      } else {
        deep_link = `/scan/start?i=${token}`;
      }

      // Insert invite record into prospect_invitations table
      const { data: invite, error } = await supabase
        .from('prospect_invitations')
        .insert({
          advisor_id: campaignCtx.inviter_id,
          email: profile.email_hash || '',
          magic_token: token,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create invite:', error);
        continue;
      }

      // Create InviteRecord from prospect_invitation data
      const inviteRecord: InviteRecord = {
        id: invite.id,
        persona: profile.persona,
        inviter_id: campaignCtx.inviter_id,
        target_profile_url: profile.profile_url,
        email_hash: profile.email_hash,
        phone_hash: profile.phone_hash,
        token_hash,
        deep_link,
        context: campaignCtx,
        status: invite.status,
        created_at: invite.created_at
      };

      invites.push(inviteRecord);

      // Emit content-free Invite-RDS
      await recordReceipt({
        type: 'Invite-RDS',
        ts: new Date().toISOString(),
        policy_version: 'v1.0',
        invite_id: invite.id,
        persona: profile.persona,
        inputs_hash: profile.inputs_hash,
        campaign: campaignCtx.campaign_id,
        metro: campaignCtx.metro,
        specialty: campaignCtx.specialty,
        channel: campaignCtx.channel
      });

    } catch (error) {
      console.error('Failed to create invite for profile:', error, profile);
    }
  }

  return invites;
}

/**
 * Send invites via configured provider
 */
export async function sendInvites(
  inviteIds: string[],
  provider: 'email' | 'sms' = 'email'
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  const { data: invites, error } = await supabase
    .from('prospect_invitations')
    .select('*')
    .in('id', inviteIds)
    .eq('status', 'pending');

  if (error || !invites) {
    throw new Error('Failed to fetch invites for sending');
  }

  for (const invite of invites) {
    try {
      // Call edge function to send via provider
      const { error: sendError } = await supabase.functions.invoke('leads-invite', {
        body: {
          invite_id: invite.id,
          email: invite.email,
          advisor_id: invite.advisor_id,
          magic_token: invite.magic_token
        }
      });

      if (sendError) {
        console.error('Failed to send invite:', sendError);
        failed++;
        continue;
      }

      // Mark as sent
      await supabase
        .from('prospect_invitations')
        .update({ status: 'sent' })
        .eq('id', invite.id);

      // Log sent event
      await recordInviteEvent(invite.id, 'sent', {
        provider,
        timestamp: new Date().toISOString()
      });

      sent++;

    } catch (error) {
      console.error('Failed to send invite:', error);
      failed++;
    }
  }

  // Emit Campaign-RDS
  await recordReceipt({
    type: 'Campaign-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    provider,
    batch_id: `batch_${Date.now()}`,
    sent_count: sent,
    failed_count: failed,
    invite_ids_hash: await inputs_hash({ invite_ids: inviteIds })
  });

  return { sent, failed };
}

/**
 * Record invite event (view, click, etc.)
 */
export async function recordInviteEvent(
  inviteId: string,
  event: 'sent' | 'view' | 'click' | 'opt_out' | 'reply' | 'convert',
  meta: Record<string, any> = {}
): Promise<void> {
  // Log event (simplified - using receipt system)
  console.log(`Invite event recorded: ${event} for ${inviteId}`, meta);
  const error = null; // No direct event table, using receipt system

  if (error) {
    console.error('Failed to record invite event:', error);
    return;
  }

  // Emit appropriate RDS
  let rdsType = 'Access-RDS';
  if (event === 'opt_out') rdsType = 'Consent-RDS';
  if (event === 'convert') rdsType = 'Conversion-RDS';

  await recordReceipt({
    type: rdsType,
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    invite_id: inviteId,
    event_type: event,
    metadata_hash: await inputs_hash(meta)
  });
}

/**
 * Handle view/click tracking for invite token
 */
export async function recordViewClick(
  token: string,
  type: 'view' | 'click',
  meta: Record<string, any> = {}
): Promise<string | null> {
  const token_hash = await inputs_hash({ token });

  // Find invite by token hash
  const { data: invite, error } = await supabase
    .from('prospect_invitations')
    .select('*')
    .eq('magic_token', token)
    .maybeSingle();

  if (error || !invite) {
    console.error('Invite not found for token');
    return null;
  }

  // Record the event
  await recordInviteEvent(invite.id, type, meta);

  // Update invite status if first view/click
  if (type === 'view' && invite.status === 'sent') {
    await supabase
      .from('prospect_invitations')
      .update({ status: 'viewed' })
      .eq('id', invite.id);
  } else if (type === 'click' && ['sent', 'viewed'].includes(invite.status)) {
    await supabase
      .from('prospect_invitations')
      .update({ status: 'clicked' })
      .eq('id', invite.id);
  }

  return invite.id;
}

/**
 * Record opt-out for invite token
 */
export async function recordOptOut(token: string): Promise<void> {
  const token_hash = await inputs_hash({ token });

  // Find and update invite
  const { data: invite, error } = await supabase
    .from('prospect_invitations')
    .update({ status: 'opted_out' })
    .eq('magic_token', token)
    .select()
    .maybeSingle();

  if (error || !invite) {
    console.error('Failed to opt out invite:', error);
    return;
  }

  // Record opt-out event
  await recordInviteEvent(invite.id, 'opt_out', {
    timestamp: new Date().toISOString()
  });

  // Emit Consent-RDS for suppression
  await recordReceipt({
    type: 'Consent-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    invite_id: invite.id,
    opt_out: true,
    suppression_action: 'email_suppressed'
  });
}

/**
 * Record conversion for invite
 */
export async function recordConversion(
  inviteId: string,
  conversionData: Record<string, any>
): Promise<void> {
  // Update invite status
  await supabase
    .from('prospect_invitations')
    .update({ status: 'activated' })
    .eq('id', inviteId);

  // Record conversion event
  await recordInviteEvent(inviteId, 'convert', {
    timestamp: new Date().toISOString(),
    data_hash: await inputs_hash(conversionData)
  });
}

/**
 * Get invite by token (for landing page resolution)
 */
export async function getInviteByToken(token: string): Promise<InviteRecord | null> {
  const token_hash = await inputs_hash({ token });

  const { data: invite, error } = await supabase
    .from('prospect_invitations')
    .select('*')
    .eq('magic_token', token)
    .maybeSingle();

  if (error || !invite) {
    return null;
  }

  // Convert to InviteRecord format
  return {
    id: invite.id,
    persona: 'family', // Default since prospect_invitations doesn't have persona
    token_hash,
    deep_link: `/invite/${invite.magic_token}`,
    status: invite.status,
    created_at: invite.created_at,
    context: {} as CampaignContext // Will be populated from campaign data
  };
}

/**
 * Get invite analytics for dashboard
 */
export async function getInviteAnalytics(campaignId?: string) {
  let query = supabase
    .from('prospect_invitations')
    .select(`
      id,
      status,
      created_at,
      advisor_id
    `)
    .order('created_at', { ascending: false });

  if (campaignId) {
    // Note: prospect_invitations doesn't have campaign context, filter by advisor
    query = query.eq('advisor_id', campaignId);
  }

  const { data: invites, error } = await query;

  if (error) {
    throw new Error('Failed to fetch invite analytics');
  }

  // Aggregate metrics
  const metrics = {
    total: invites?.length || 0,
    queued: 0,
    sent: 0,
    viewed: 0,
    clicked: 0,
    opted_out: 0,
    converted: 0,
    by_persona: { agent: 0, family: 0 }
  };

  invites?.forEach(invite => {
    metrics.by_persona.family++; // All prospect invitations are family persona
    
    switch (invite.status) {
      case 'pending': metrics.queued++; break;
      case 'sent': metrics.sent++; break;
      case 'viewed': metrics.viewed++; break;
      case 'clicked': metrics.clicked++; break;
      case 'opted_out': metrics.opted_out++; break;
      case 'activated': metrics.converted++; break;
    }
  });

  return { metrics, invites };
}