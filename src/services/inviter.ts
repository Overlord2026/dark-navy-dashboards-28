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
  channel: 'email' | 'sms' | 'linkedin';
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

      // Insert invite record
      const { data: invite, error } = await supabase
        .from('invites')
        .insert({
          persona: profile.persona,
          inviter_id: campaignCtx.inviter_id,
          target_profile_url: profile.profile_url,
          email_hash: profile.email_hash,
          phone_hash: profile.phone_hash,
          token_hash,
          deep_link,
          context: campaignCtx,
          status: 'queued'
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create invite:', error);
        continue;
      }

      invites.push(invite);

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
    .from('invites')
    .select('*')
    .in('id', inviteIds)
    .eq('status', 'queued');

  if (error || !invites) {
    throw new Error('Failed to fetch invites for sending');
  }

  for (const invite of invites) {
    try {
      // Call edge function to send via provider
      const { error: sendError } = await supabase.functions.invoke('send-invite', {
        body: {
          invite_id: invite.id,
          provider,
          deep_link: invite.deep_link,
          persona: invite.persona,
          context: invite.context
        }
      });

      if (sendError) {
        console.error('Failed to send invite:', sendError);
        failed++;
        continue;
      }

      // Mark as sent
      await supabase
        .from('invites')
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
  // Insert event record
  const { error } = await supabase
    .from('invite_events')
    .insert({
      invite_id: inviteId,
      event,
      meta
    });

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
    .from('invites')
    .select('*')
    .eq('token_hash', token_hash)
    .single();

  if (error || !invite) {
    console.error('Invite not found for token');
    return null;
  }

  // Record the event
  await recordInviteEvent(invite.id, type, meta);

  // Update invite status if first view/click
  if (type === 'view' && invite.status === 'sent') {
    await supabase
      .from('invites')
      .update({ status: 'viewed' })
      .eq('id', invite.id);
  } else if (type === 'click' && ['sent', 'viewed'].includes(invite.status)) {
    await supabase
      .from('invites')
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
    .from('invites')
    .update({ status: 'opted_out' })
    .eq('token_hash', token_hash)
    .select()
    .single();

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
    .from('invites')
    .update({ status: 'converted' })
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
    .from('invites')
    .select('*')
    .eq('token_hash', token_hash)
    .single();

  if (error || !invite) {
    return null;
  }

  return invite;
}

/**
 * Get invite analytics for dashboard
 */
export async function getInviteAnalytics(campaignId?: string) {
  let query = supabase
    .from('invites')
    .select(`
      id,
      persona,
      status,
      created_at,
      context,
      invite_events(event, ts)
    `)
    .order('created_at', { ascending: false });

  if (campaignId) {
    query = query.eq('context->>campaign_id', campaignId);
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
    metrics.by_persona[invite.persona as 'agent' | 'family']++;
    
    switch (invite.status) {
      case 'queued': metrics.queued++; break;
      case 'sent': metrics.sent++; break;
      case 'viewed': metrics.viewed++; break;
      case 'clicked': metrics.clicked++; break;
      case 'opted_out': metrics.opted_out++; break;
      case 'converted': metrics.converted++; break;
    }
  });

  return { metrics, invites };
}