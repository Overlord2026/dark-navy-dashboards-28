import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailNotification {
  to: string
  subject: string
  html: string
  from?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const body = await req.json()
    const { action, ...params } = body

    switch (action) {
      case 'process_scheduled_notifications':
        return await processScheduledNotifications(supabase)
      case 'send_notification':
        return await sendNotification(supabase, params)
      case 'check_delivery_triggers':
        return await checkDeliveryTriggers(supabase)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function processScheduledNotifications(supabase: any) {
  const now = new Date().toISOString()
  
  // Get pending notifications that are due
  const { data: notifications, error } = await supabase
    .from('vault_notifications')
    .select(`
      *,
      family_vaults!inner(vault_name),
      vault_members!inner(email, first_name, last_name)
    `)
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .limit(50)

  if (error) throw error

  const results = []
  for (const notification of notifications) {
    try {
      const result = await sendEmailNotification({
        to: notification.vault_members.email,
        subject: notification.title,
        html: generateNotificationHtml(notification),
        from: 'Family Vault <noreply@familyvault.com>'
      })

      // Update notification status
      await supabase
        .from('vault_notifications')
        .update({
          status: result.success ? 'sent' : 'failed',
          sent_at: result.success ? now : null,
          metadata: { ...notification.metadata, error: result.error }
        })
        .eq('id', notification.id)

      results.push({ id: notification.id, success: result.success })
    } catch (error) {
      console.error(`Failed to send notification ${notification.id}:`, error)
      results.push({ id: notification.id, success: false, error: error.message })
    }
  }

  return new Response(
    JSON.stringify({ processed: results.length, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function sendNotification(supabase: any, params: any) {
  const { vaultId, recipientId, type, title, message, deliveryMethod = 'email', scheduledFor } = params

  const { data: notification, error } = await supabase
    .from('vault_notifications')
    .insert({
      vault_id: vaultId,
      recipient_id: recipientId,
      notification_type: type,
      title,
      message,
      delivery_method: deliveryMethod,
      scheduled_for: scheduledFor || new Date().toISOString(),
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, notificationId: notification.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function checkDeliveryTriggers(supabase: any) {
  const now = new Date().toISOString()
  
  // Check for date-based triggers
  const { data: dateRules, error: dateError } = await supabase
    .from('legacy_delivery_rules')
    .select(`
      *,
      legacy_items!inner(*),
      legacy_recipients!inner(*)
    `)
    .eq('trigger_type', 'date')
    .eq('delivery_status', 'pending')
    .lte('trigger_date', now)

  if (dateError) throw dateError

  // Process date-based deliveries
  for (const rule of dateRules) {
    if (rule.executor_approval_required && !rule.executor_approved_by) {
      // Send approval request to executor
      await sendExecutorApprovalRequest(supabase, rule)
    } else {
      // Deliver the message
      await deliverLegacyItem(supabase, rule)
    }
  }

  return new Response(
    JSON.stringify({ processed: dateRules.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function sendEmailNotification(emailData: EmailNotification) {
  // In production, integrate with your email service (Resend, SendGrid, etc.)
  // For now, we'll simulate email sending
  console.log('Sending email:', emailData)
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return { success: true }
}

async function sendExecutorApprovalRequest(supabase: any, rule: any) {
  // Get executor details
  const { data: executor } = await supabase
    .from('vault_members')
    .select('email, first_name, last_name')
    .eq('vault_id', rule.legacy_items.vault_id)
    .eq('is_executor', true)
    .eq('status', 'active')
    .single()

  if (executor) {
    await supabase
      .from('vault_notifications')
      .insert({
        vault_id: rule.legacy_items.vault_id,
        recipient_id: executor.user_id,
        notification_type: 'executor_approval',
        title: 'Legacy Message Approval Required',
        message: `A legacy message "${rule.legacy_items.title}" is ready for delivery and requires your approval.`,
        delivery_method: 'email',
        metadata: { rule_id: rule.id }
      })
  }
}

async function deliverLegacyItem(supabase: any, rule: any) {
  // Update delivery status
  await supabase
    .from('legacy_delivery_rules')
    .update({
      delivery_status: 'delivered',
      delivered_at: new Date().toISOString()
    })
    .eq('id', rule.id)

  // Send notifications to recipients
  for (const recipient of rule.legacy_recipients) {
    await supabase
      .from('vault_notifications')
      .insert({
        vault_id: rule.legacy_items.vault_id,
        recipient_id: recipient.vault_member_id,
        notification_type: 'legacy_delivery',
        title: `New Legacy Message: ${rule.legacy_items.title}`,
        message: `You have received a new legacy message from your family vault.`,
        delivery_method: 'email',
        metadata: { 
          legacy_item_id: rule.legacy_items.id,
          personal_message: recipient.personal_message 
        }
      })
  }
}

function generateNotificationHtml(notification: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${notification.title}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏛️ Family Legacy Vault</h1>
        <p>From ${notification.family_vaults.vault_name}</p>
      </div>
      <div class="content">
        <h2>${notification.title}</h2>
        <p>${notification.message}</p>
        ${notification.metadata?.legacy_item_id ? 
          `<a href="#" class="button">View Legacy Message</a>` : ''
        }
      </div>
      <div class="footer">
        <p>This message was sent from your Family Legacy Vault</p>
      </div>
    </body>
    </html>
  `
}