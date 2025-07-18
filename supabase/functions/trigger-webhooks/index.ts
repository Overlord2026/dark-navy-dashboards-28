import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookRequest {
  eventType: string;
  payload: Record<string, any>;
  tenantId?: string;
  webhookIds?: string[]; // Optional: specific webhook IDs to trigger
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { eventType, payload, tenantId, webhookIds }: WebhookRequest = await req.json();

    console.log('Triggering webhooks for event:', eventType);

    // Build webhook query
    let query = supabase
      .from('webhook_configs')
      .select('*')
      .eq('is_active', true);

    if (webhookIds && webhookIds.length > 0) {
      query = query.in('id', webhookIds);
    } else {
      // Filter by event type and tenant
      query = query.contains('events', [eventType]);
      
      if (tenantId) {
        query = query.or(`tenant_id.is.null,tenant_id.eq.${tenantId}`);
      } else {
        query = query.is('tenant_id', null);
      }
    }

    const { data: webhookConfigs, error } = await query;

    if (error) {
      throw error;
    }

    if (!webhookConfigs || webhookConfigs.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No active webhooks found for this event type',
          triggered: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Trigger all webhooks
    const results = await Promise.allSettled(
      webhookConfigs.map(config => sendWebhook(config, eventType, payload, supabase))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Webhook results: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        triggered: webhookConfigs.length,
        successful,
        failed,
        details: results.map((result, index) => ({
          webhook: webhookConfigs[index].name,
          status: result.status,
          error: result.status === 'rejected' ? result.reason?.message : null
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in trigger-webhooks function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

async function sendWebhook(config: any, eventType: string, payload: any, supabase: any) {
  const maxRetries = config.retry_attempts || 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      console.log(`Sending webhook ${config.name}, attempt ${attempt}`);

      const webhookPayload = {
        webhook_id: config.id,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        data: payload
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'FamilyOffice-Webhooks/1.0',
        ...config.headers
      };

      if (config.secret_key) {
        headers['X-Webhook-Secret'] = config.secret_key;
        headers['X-Webhook-Signature'] = await generateSignature(
          JSON.stringify(webhookPayload), 
          config.secret_key
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), (config.timeout_seconds || 30) * 1000);

      const response = await fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseBody = await response.text();

      // Log delivery
      await supabase.from('webhook_deliveries').insert({
        webhook_config_id: config.id,
        event_type: eventType,
        payload: webhookPayload,
        response_status: response.status,
        response_body: responseBody.slice(0, 1000),
        attempt_number: attempt,
        delivered_at: response.ok ? new Date().toISOString() : null
      });

      if (response.ok) {
        console.log(`Webhook ${config.name} delivered successfully`);
        return { success: true, webhook: config.name };
      } else {
        throw new Error(`HTTP ${response.status}: ${responseBody}`);
      }

    } catch (error) {
      console.error(`Webhook ${config.name} attempt ${attempt} failed:`, error);

      // Log failed delivery
      await supabase.from('webhook_deliveries').insert({
        webhook_config_id: config.id,
        event_type: eventType,
        payload: {
          webhook_id: config.id,
          event_type: eventType,
          timestamp: new Date().toISOString(),
          data: payload
        },
        error_message: error.message,
        attempt_number: attempt
      });

      if (attempt === maxRetries) {
        console.error(`Webhook ${config.name} failed after ${maxRetries} attempts`);
        throw error;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      attempt++;
    }
  }
}

async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `sha256=${hashHex}`;
}

serve(handler);