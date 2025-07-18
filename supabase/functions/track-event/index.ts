import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackEventRequest {
  eventType: string;
  eventName: string;
  eventData?: Record<string, any>;
  userId?: string;
  tenantId?: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const {
      eventType,
      eventName,
      eventData = {},
      userId,
      tenantId,
      source = 'app'
    }: TrackEventRequest = await req.json();

    console.log('Tracking event:', { eventType, eventName, userId, tenantId });

    // Get client info
    const userAgent = req.headers.get('user-agent') || '';
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || '';
    const referrer = req.headers.get('referer') || '';

    // Insert into tracked_events
    const { data: trackedEvent, error: trackError } = await supabase
      .from('tracked_events')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        event_type: eventType,
        event_name: eventName,
        event_data: eventData,
        source,
        ip_address: ip,
        user_agent: userAgent,
        referrer
      })
      .select()
      .single();

    if (trackError) {
      console.error('Error tracking event:', trackError);
      throw trackError;
    }

    // Also insert into analytics_events for historical tracking
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        event_type: eventType,
        event_category: eventType.split('.')[0] || 'general',
        event_data: eventData,
        user_agent: userAgent,
        ip_address: ip
      });

    if (analyticsError) {
      console.log('Analytics insert warning:', analyticsError);
    }

    // Find active webhooks for this event type
    const { data: webhookConfigs } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('is_active', true)
      .or(`tenant_id.is.null,tenant_id.eq.${tenantId}`)
      .contains('events', [eventType]);

    // Trigger webhooks asynchronously
    if (webhookConfigs && webhookConfigs.length > 0) {
      const webhookPromises = webhookConfigs.map(config => 
        triggerWebhook(config, trackedEvent, supabase)
      );
      
      // Use waitUntil for background processing
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        EdgeRuntime.waitUntil(Promise.allSettled(webhookPromises));
      } else {
        // Fallback for local development
        Promise.allSettled(webhookPromises).catch(console.error);
      }
    }

    // Trigger CRM sync if applicable
    if (shouldSyncWithCRM(eventType)) {
      const crmSyncPromise = syncWithCRM(tenantId, trackedEvent, supabase);
      
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        EdgeRuntime.waitUntil(crmSyncPromise);
      } else {
        crmSyncPromise.catch(console.error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        eventId: trackedEvent.id,
        webhooksTriggered: webhookConfigs?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in track-event function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

async function triggerWebhook(config: any, event: any, supabase: any) {
  const maxRetries = config.retry_attempts || 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      console.log(`Triggering webhook ${config.name}, attempt ${attempt}`);

      const payload = {
        id: event.id,
        event_type: event.event_type,
        event_name: event.event_name,
        event_data: event.event_data,
        user_id: event.user_id,
        tenant_id: event.tenant_id,
        created_at: event.created_at,
        source: event.source
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'FamilyOffice-Webhooks/1.0',
        ...config.headers
      };

      if (config.secret_key) {
        headers['X-Webhook-Secret'] = config.secret_key;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), (config.timeout_seconds || 30) * 1000);

      const response = await fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseBody = await response.text();

      // Log delivery
      await supabase.from('webhook_deliveries').insert({
        webhook_config_id: config.id,
        event_id: event.id,
        event_type: event.event_type,
        payload,
        response_status: response.status,
        response_body: responseBody.slice(0, 1000), // Limit response body length
        attempt_number: attempt,
        delivered_at: response.ok ? new Date().toISOString() : null
      });

      if (response.ok) {
        console.log(`Webhook ${config.name} delivered successfully`);
        return;
      } else {
        throw new Error(`HTTP ${response.status}: ${responseBody}`);
      }

    } catch (error) {
      console.error(`Webhook ${config.name} attempt ${attempt} failed:`, error);

      // Log failed delivery
      await supabase.from('webhook_deliveries').insert({
        webhook_config_id: config.id,
        event_id: event.id,
        event_type: event.event_type,
        payload: {
          id: event.id,
          event_type: event.event_type,
          event_name: event.event_name,
          event_data: event.event_data,
          user_id: event.user_id,
          tenant_id: event.tenant_id,
          created_at: event.created_at,
          source: event.source
        },
        error_message: error.message,
        attempt_number: attempt
      });

      if (attempt === maxRetries) {
        console.error(`Webhook ${config.name} failed after ${maxRetries} attempts`);
        return;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      attempt++;
    }
  }
}

function shouldSyncWithCRM(eventType: string): boolean {
  const crmSyncEvents = [
    'user.registered',
    'user.onboarded',
    'lead.created',
    'lead.converted',
    'appointment.booked',
    'resource.downloaded',
    'profile.updated'
  ];
  return crmSyncEvents.includes(eventType);
}

async function syncWithCRM(tenantId: string, event: any, supabase: any) {
  try {
    if (!tenantId) return;

    // Get active CRM integrations for this tenant
    const { data: integrations } = await supabase
      .from('crm_integrations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .eq('sync_frequency', 'realtime');

    if (!integrations || integrations.length === 0) return;

    for (const integration of integrations) {
      try {
        await syncEventWithCRM(integration, event);
        
        // Update last sync time
        await supabase
          .from('crm_integrations')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', integration.id);

      } catch (error) {
        console.error(`CRM sync failed for ${integration.integration_type}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in CRM sync:', error);
  }
}

async function syncEventWithCRM(integration: any, event: any) {
  const { integration_type, api_endpoint, api_key_encrypted, settings, field_mappings } = integration;

  console.log(`Syncing event ${event.event_type} with ${integration_type}`);

  if (integration_type === 'gohighlevel') {
    await syncWithGoHighLevel(api_endpoint, api_key_encrypted, event, field_mappings, settings);
  } else if (integration_type === 'hubspot') {
    await syncWithHubSpot(api_key_encrypted, event, field_mappings, settings);
  } else if (integration_type === 'custom') {
    await syncWithCustomCRM(api_endpoint, api_key_encrypted, event, field_mappings, settings);
  }
  // Add more integrations as needed
}

async function syncWithGoHighLevel(endpoint: string, apiKey: string, event: any, mappings: any, settings: any) {
  if (!endpoint || !apiKey) return;

  const payload = mapEventToGHL(event, mappings);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`GHL API error: ${response.status} ${await response.text()}`);
  }
}

async function syncWithHubSpot(apiKey: string, event: any, mappings: any, settings: any) {
  if (!apiKey) return;

  const payload = mapEventToHubSpot(event, mappings);
  
  const response = await fetch('https://api.hubapi.com/contacts/v1/contact', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HubSpot API error: ${response.status} ${await response.text()}`);
  }
}

async function syncWithCustomCRM(endpoint: string, apiKey: string, event: any, mappings: any, settings: any) {
  if (!endpoint) return;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const payload = mapEventToCustomFormat(event, mappings);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Custom CRM API error: ${response.status} ${await response.text()}`);
  }
}

function mapEventToGHL(event: any, mappings: any) {
  return {
    email: event.event_data?.email || event.event_data?.user_email,
    firstName: event.event_data?.first_name || event.event_data?.name?.split(' ')[0],
    lastName: event.event_data?.last_name || event.event_data?.name?.split(' ').slice(1).join(' '),
    phone: event.event_data?.phone,
    source: 'Family Office App',
    tags: [event.event_type],
    customFields: {
      event_type: event.event_type,
      event_name: event.event_name,
      tenant_id: event.tenant_id,
      ...event.event_data
    }
  };
}

function mapEventToHubSpot(event: any, mappings: any) {
  return {
    properties: {
      email: event.event_data?.email || event.event_data?.user_email,
      firstname: event.event_data?.first_name || event.event_data?.name?.split(' ')[0],
      lastname: event.event_data?.last_name || event.event_data?.name?.split(' ').slice(1).join(' '),
      phone: event.event_data?.phone,
      lifecyclestage: 'lead',
      lead_source: 'Family Office App',
      last_event_type: event.event_type,
      last_event_name: event.event_name
    }
  };
}

function mapEventToCustomFormat(event: any, mappings: any) {
  if (!mappings) {
    return event;
  }

  const mapped: Record<string, any> = {};
  
  for (const [targetField, sourceField] of Object.entries(mappings)) {
    const value = getNestedValue(event, sourceField as string);
    if (value !== undefined) {
      mapped[targetField] = value;
    }
  }

  return mapped;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

serve(handler);