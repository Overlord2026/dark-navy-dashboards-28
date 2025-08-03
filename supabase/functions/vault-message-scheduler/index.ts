import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScheduledMessage {
  id: string;
  vault_id: string;
  recipient_id: string;
  message_id: string;
  delivery_type: 'scheduled' | 'event' | 'upon_death';
  trigger_date?: string;
  event_type?: string;
  event_conditions?: Record<string, any>;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, messageId, scheduleData } = await req.json();

    switch (action) {
      case 'schedule_message':
        return await scheduleMessage(supabaseClient, messageId, scheduleData);
      case 'process_scheduled_messages':
        return await processScheduledMessages(supabaseClient);
      case 'cancel_scheduled_message':
        return await cancelScheduledMessage(supabaseClient, messageId);
      default:
        throw new Error('Invalid action');
    }
  } catch (error: any) {
    console.error('Error in vault-message-scheduler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function scheduleMessage(supabaseClient: any, messageId: string, scheduleData: any) {
  console.log('Scheduling message:', messageId, scheduleData);

  // Insert scheduled message record
  const { data: scheduledMessage, error } = await supabaseClient
    .from('vault_scheduled_messages')
    .insert({
      message_id: messageId,
      vault_id: scheduleData.vault_id,
      recipient_id: scheduleData.recipient_id,
      delivery_type: scheduleData.delivery_type,
      trigger_date: scheduleData.trigger_date,
      event_type: scheduleData.event_type,
      event_conditions: scheduleData.event_conditions,
      notification_preferences: scheduleData.notification_preferences,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // If it's a scheduled message with a specific date, calculate delivery time
  if (scheduleData.delivery_type === 'scheduled' && scheduleData.trigger_date) {
    const deliveryTime = new Date(scheduleData.trigger_date);
    const now = new Date();
    
    if (deliveryTime > now) {
      // Schedule for future delivery
      console.log(`Message ${messageId} scheduled for delivery at ${deliveryTime}`);
    } else {
      // Immediate delivery if date is in the past
      await deliverMessage(supabaseClient, scheduledMessage);
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      scheduled_message_id: scheduledMessage.id,
      message: 'Message scheduled successfully' 
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function processScheduledMessages(supabaseClient: any) {
  console.log('Processing scheduled messages...');

  const now = new Date();
  
  // Get messages due for delivery
  const { data: dueMessages, error } = await supabaseClient
    .from('vault_scheduled_messages')
    .select(`
      *,
      legacy_items(*),
      vault_members:recipient_id(*)
    `)
    .eq('status', 'pending')
    .or(`trigger_date.lte.${now.toISOString()},delivery_type.eq.event`);

  if (error) throw error;

  console.log(`Found ${dueMessages?.length || 0} messages to process`);

  const results = [];
  
  for (const message of dueMessages || []) {
    try {
      // Check if event-based message conditions are met
      if (message.delivery_type === 'event') {
        const shouldDeliver = await checkEventConditions(supabaseClient, message);
        if (!shouldDeliver) continue;
      }

      await deliverMessage(supabaseClient, message);
      results.push({ id: message.id, status: 'sent' });
    } catch (error) {
      console.error(`Failed to deliver message ${message.id}:`, error);
      
      // Mark as failed
      await supabaseClient
        .from('vault_scheduled_messages')
        .update({ 
          status: 'failed', 
          error_message: error.message,
          attempted_at: now.toISOString()
        })
        .eq('id', message.id);
        
      results.push({ id: message.id, status: 'failed', error: error.message });
    }
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      processed: results.length,
      results 
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function deliverMessage(supabaseClient: any, scheduledMessage: ScheduledMessage) {
  console.log('Delivering message:', scheduledMessage.id);

  const { legacy_items: message, vault_members: recipient } = scheduledMessage as any;

  if (!message || !recipient) {
    throw new Error('Message or recipient not found');
  }

  // Send notifications based on preferences
  const notifications = [];

  if (scheduledMessage.notification_preferences.email) {
    notifications.push(sendEmailNotification(supabaseClient, message, recipient));
  }

  if (scheduledMessage.notification_preferences.sms) {
    notifications.push(sendSMSNotification(supabaseClient, message, recipient));
  }

  if (scheduledMessage.notification_preferences.push) {
    notifications.push(sendPushNotification(supabaseClient, message, recipient));
  }

  // Wait for all notifications to complete
  await Promise.allSettled(notifications);

  // Mark as delivered
  const deliveredAt = new Date().toISOString();
  await supabaseClient
    .from('vault_scheduled_messages')
    .update({ 
      status: 'sent', 
      delivered_at: deliveredAt 
    })
    .eq('id', scheduledMessage.id);

  // Log the delivery
  await supabaseClient
    .from('vault_access_logs')
    .insert({
      vault_id: scheduledMessage.vault_id,
      user_id: recipient.user_id,
      action_type: 'message_delivered',
      resource_type: 'legacy_item',
      resource_id: message.id,
      details: {
        message_title: message.title,
        delivery_type: scheduledMessage.delivery_type,
        recipient_email: recipient.email,
        delivered_at: deliveredAt
      }
    });

  console.log(`Message ${scheduledMessage.id} delivered successfully`);
}

async function sendEmailNotification(supabaseClient: any, message: any, recipient: any) {
  console.log('Sending email notification to:', recipient.email);
  
  // Call the vault-notifications function for email delivery
  const { error } = await supabaseClient.functions.invoke('vault-notifications', {
    body: {
      type: 'email',
      recipient: {
        email: recipient.email,
        name: `${recipient.first_name || ''} ${recipient.last_name || ''}`.trim() || recipient.email
      },
      message: {
        title: message.title,
        content: message.description || 'You have received a new message in your family vault.',
        vault_url: `${Deno.env.get('SITE_URL')}/family-vault/${message.vault_id}`,
        item_id: message.id
      }
    }
  });

  if (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
}

async function sendSMSNotification(supabaseClient: any, message: any, recipient: any) {
  console.log('Sending SMS notification to:', recipient.phone);
  
  if (!recipient.phone) {
    console.log('No phone number available for SMS');
    return;
  }

  // Call the vault-notifications function for SMS delivery
  const { error } = await supabaseClient.functions.invoke('vault-notifications', {
    body: {
      type: 'sms',
      recipient: {
        phone: recipient.phone,
        name: `${recipient.first_name || ''} ${recipient.last_name || ''}`.trim() || recipient.email
      },
      message: {
        title: message.title,
        content: `You have a new message in your family vault: "${message.title}". Check your vault to view it.`,
        vault_url: `${Deno.env.get('SITE_URL')}/family-vault/${message.vault_id}`
      }
    }
  });

  if (error) {
    console.error('Failed to send SMS notification:', error);
    throw error;
  }
}

async function sendPushNotification(supabaseClient: any, message: any, recipient: any) {
  console.log('Sending push notification to:', recipient.user_id);
  
  // Call the vault-notifications function for push delivery
  const { error } = await supabaseClient.functions.invoke('vault-notifications', {
    body: {
      type: 'push',
      recipient: {
        user_id: recipient.user_id,
        name: `${recipient.first_name || ''} ${recipient.last_name || ''}`.trim() || recipient.email
      },
      message: {
        title: 'New Family Vault Message',
        content: `"${message.title}" - ${message.description || 'You have received a new message.'}`,
        vault_url: `${Deno.env.get('SITE_URL')}/family-vault/${message.vault_id}`,
        item_id: message.id
      }
    }
  });

  if (error) {
    console.error('Failed to send push notification:', error);
    throw error;
  }
}

async function checkEventConditions(supabaseClient: any, scheduledMessage: ScheduledMessage) {
  // This function would check if event-based conditions are met
  // For now, return true (implement specific event logic as needed)
  
  switch (scheduledMessage.event_type) {
    case 'birthday':
      // Check if today matches the birthday
      const today = new Date();
      const triggerDate = new Date(scheduledMessage.trigger_date || '');
      return today.getMonth() === triggerDate.getMonth() && 
             today.getDate() === triggerDate.getDate();
             
    case 'anniversary':
      // Similar logic for anniversaries
      const anniversaryDate = new Date(scheduledMessage.trigger_date || '');
      const currentDate = new Date();
      return currentDate.getMonth() === anniversaryDate.getMonth() && 
             currentDate.getDate() === anniversaryDate.getDate();
             
    case 'milestone_age':
      // Check if recipient has reached milestone age
      // This would require birthday data and age calculation
      return false; // Implement based on your data structure
      
    case 'upon_death':
      // This would be triggered manually or through external systems
      return false; // Implement based on your requirements
      
    default:
      return false;
  }
}

async function cancelScheduledMessage(supabaseClient: any, messageId: string) {
  console.log('Cancelling scheduled message:', messageId);

  const { error } = await supabaseClient
    .from('vault_scheduled_messages')
    .update({ 
      status: 'cancelled', 
      cancelled_at: new Date().toISOString() 
    })
    .eq('message_id', messageId);

  if (error) throw error;

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Scheduled message cancelled successfully' 
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

serve(handler);