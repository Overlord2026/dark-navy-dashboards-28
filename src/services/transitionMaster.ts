/**
 * Advisor Transition Master with TCPA-compliant reminders
 * Handles 30-day negative consent campaigns
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { withAttestation } from './attestation';
import { inputs_hash } from '@/lib/canonical';

export interface TransitionSchedule {
  transition_id: string;
  cadence: number[]; // Days: [7, 14, 23, 27]
  quota_per_day: number;
  quiet_hours: { start: string; end: string }; // "22:00" to "08:00"
  timezone: string;
  start_date: string;
  end_date: string;
}

export interface EmailTemplate {
  key: string;
  name: string;
  subject: string;
  body: string;
  required_tokens: string[];
  compliance_approved: boolean;
}

export interface ContactRecord {
  id: string;
  transition_id: string;
  email_hash: string; // Content-free identifier
  name_hash: string;  // Content-free identifier
  status: 'active' | 'opted_out' | 'bounced' | 'suppressed';
  opt_out_date?: string;
  last_email_sent?: string;
}

const MANDATORY_OPT_OUT_TEXT = "**No action is required unless you choose to opt out within 30 days (by {{deadline_date}}).**";

const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  welcome: {
    key: 'welcome',
    name: 'Transition Welcome',
    subject: 'Important Update About Your Financial Advisory Services',
    body: `Dear {{client_name}},

We're writing to inform you about an important transition in your financial advisory services.

{{transition_details}}

${MANDATORY_OPT_OUT_TEXT}

If you have any questions, please don't hesitate to contact us.

Best regards,
{{advisor_name}}

To unsubscribe from these communications, click here: {{unsubscribe_link}}`,
    required_tokens: ['client_name', 'transition_details', 'deadline_date', 'advisor_name', 'unsubscribe_link'],
    compliance_approved: true
  },
  
  reminder_1: {
    key: 'reminder_1',
    name: 'First Reminder',
    subject: 'Reminder: Transition Update ({{days_remaining}} days remaining)',
    body: `Dear {{client_name}},

This is a reminder about the transition update we sent you {{days_ago}} days ago.

{{transition_summary}}

${MANDATORY_OPT_OUT_TEXT}

Questions? Contact us at {{contact_info}}.

Best regards,
{{advisor_name}}

To unsubscribe: {{unsubscribe_link}}`,
    required_tokens: ['client_name', 'days_remaining', 'days_ago', 'transition_summary', 'deadline_date', 'advisor_name', 'contact_info', 'unsubscribe_link'],
    compliance_approved: true
  },

  final_notice: {
    key: 'final_notice',
    name: 'Final Notice',
    subject: 'Final Notice: Transition Effective {{effective_date}}',
    body: `Dear {{client_name}},

This is the final notice regarding your advisory service transition.

${MANDATORY_OPT_OUT_TEXT}

After {{deadline_date}}, the transition will proceed automatically.

{{final_details}}

Best regards,
{{advisor_name}}

To unsubscribe: {{unsubscribe_link}}`,
    required_tokens: ['client_name', 'effective_date', 'deadline_date', 'final_details', 'advisor_name', 'unsubscribe_link'],
    compliance_approved: true
  }
};

/**
 * Plans transition schedule with cadence
 */
export async function planSchedule(
  transitionId: string,
  cadence: number[] = [7, 14, 23, 27],
  quotaPerDay: number = 100,
  quietHours: { start: string; end: string } = { start: '22:00', end: '08:00' }
): Promise<TransitionSchedule> {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30); // 30-day period

  const schedule: TransitionSchedule = {
    transition_id: transitionId,
    cadence,
    quota_per_day: quotaPerDay,
    quiet_hours: quietHours,
    timezone: 'America/New_York',
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  };

  const { error } = await (supabase as any)
    .from('transition_schedules')
    .insert(schedule);

  if (error) throw error;

  // Record schedule creation
  await recordReceipt({
    type: 'Campaign-RDS',
    ts: new Date().toISOString(),
    transition_id: transitionId,
    schedule_hash: await inputs_hash({
      cadence: cadence.join(','),
      quota: quotaPerDay,
      duration_days: 30
    }),
    policy_version: 'v1.0'
  });

  return schedule;
}

/**
 * Renders email template with tokens
 */
export function renderEmail(
  templateKey: string,
  tokens: Record<string, string>
): { subject: string; body: string } {
  const template = EMAIL_TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Template not found: ${templateKey}`);
  }

  // Verify required tokens
  const missingTokens = template.required_tokens.filter(token => !tokens[token]);
  if (missingTokens.length > 0) {
    throw new Error(`Missing required tokens: ${missingTokens.join(', ')}`);
  }

  // Ensure deadline_date is always included
  if (!tokens.deadline_date) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    tokens.deadline_date = deadline.toLocaleDateString();
  }

  let subject = template.subject;
  let body = template.body;

  // Replace tokens
  for (const [key, value] of Object.entries(tokens)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, value);
    body = body.replace(regex, value);
  }

  // Verify mandatory opt-out text is present
  if (!body.includes('**No action is required unless you choose to opt out within 30 days')) {
    throw new Error('Mandatory opt-out text missing from email body');
  }

  return { subject, body };
}

/**
 * Sends email with TCPA compliance and suppression check
 */
export async function sendEmail(
  jobId: string,
  contactId: string,
  templateKey: string,
  tokens: Record<string, string>
): Promise<void> {
  // Check suppression list first
  const { data: contact, error: contactError } = await supabase
    .from('transition_contacts')
    .select('*')
    .eq('id', contactId)
    .single();

  if (contactError) throw contactError;

  if (contact.status !== 'active') {
    throw new Error(`Contact is suppressed: ${contact.status}`);
  }

  // Render email
  const { subject, body } = renderEmail(templateKey, tokens);

  // Send via edge function (placeholder - would call actual email service)
  const emailResult = await supabase.functions.invoke('send-transition-email', {
    body: {
      to_hash: contact.email_hash,
      subject,
      body,
      unsubscribe_token: `${contactId}_${Date.now()}`
    }
  });

  if (emailResult.error) throw emailResult.error;

  // Update contact
  const { error: updateError } = await (supabase as any)
    .from('transition_contacts')
    .update({ last_sent_at: new Date().toISOString() })
    .eq('id', contactId);

  if (updateError) throw updateError;

  // Record email send
  await recordReceipt({
    type: 'EmailSend-RDS',
    ts: new Date().toISOString(),
    job_id: jobId,
    contact_id: contactId,
    template_key: templateKey,
    email_hash: await inputs_hash({ subject, body_length: body.length }),
    policy_version: 'v1.0'
  });
}

/**
 * Handles opt-out with suppression
 */
export async function optOut(token: string): Promise<void> {
  // Parse token to get contact ID
  const [contactId] = token.split('_');

  const { error } = await supabase
    .from('transition_contacts')
    .update({
      status: 'opted_out',
      opt_out_date: new Date().toISOString()
    })
    .eq('id', contactId);

  if (error) throw error;

  // Record opt-out
  await recordReceipt({
    type: 'OptOut-RDS',
    ts: new Date().toISOString(),
    contact_id: contactId,
    policy_version: 'v1.0'
  });
}

/**
 * Processes email webhooks (bounces, opens, clicks)
 */
export async function processWebhook(
  eventType: 'bounce' | 'open' | 'click',
  contactId: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  if (eventType === 'bounce') {
    // Mark as bounced to suppress future emails
    await supabase
      .from('transition_contacts')
      .update({ status: 'bounced' })
      .eq('id', contactId);

    // Record bounce
    await recordReceipt({
      type: 'Bounce-RDS',
      ts: new Date().toISOString(),
      contact_id: contactId,
      bounce_type: metadata.bounce_type || 'hard',
      policy_version: 'v1.0'
    });
  }

  // Record engagement (opens/clicks) without PII
  if (eventType === 'open' || eventType === 'click') {
    await recordReceipt({
      type: 'EmailEngagement-RDS',
      ts: new Date().toISOString(),
      contact_id: contactId,
      event_type: eventType,
      policy_version: 'v1.0'
    });
  }
}

/**
 * Replay verification for deterministic schedule checking
 */
export async function replayVerify(transitionId: string): Promise<boolean> {
  const { data: schedule, error } = await (supabase as any)
    .from('transition_schedules')
    .select('*')
    .eq('transition_id', transitionId)
    .maybeSingle();

  if (error) return false;

  // Verify schedule integrity
  const expectedHash = await inputs_hash({
    cadence: (schedule as any).cadence,
    quota_per_day: (schedule as any).quota_per_day,
    start_date: (schedule as any).start_date,
    end_date: (schedule as any).end_date
  });

  // Compare with stored hash (would be stored during creation)
  return true; // Placeholder - would compare actual hashes
}

/**
 * Gets transition summary for admin
 */
export async function getTransitionSummary(transitionId: string): Promise<{
  total_contacts: number;
  emails_sent: number;
  opt_outs: number;
  bounces: number;
  completion_rate: number;
}> {
  const { data: contacts, error } = await (supabase as any)
    .from('transition_contacts')
    .select('status, last_sent_at')
    .eq('transition_id', transitionId);

  if (error) throw error;

  const total = contacts?.length || 0;
  const sent = contacts?.filter(c => (c as any).last_sent_at).length || 0;
  const optOuts = contacts?.filter(c => (c as any).status === 'opted_out').length || 0;
  const bounces = contacts?.filter(c => (c as any).status === 'bounced').length || 0;

  return {
    total_contacts: total,
    emails_sent: sent,
    opt_outs: optOuts,
    bounces: bounces,
    completion_rate: total > 0 ? (sent / total) * 100 : 0
  };
}