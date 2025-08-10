import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface TrackingRequest {
  event_name: string;
  contact_id?: string;
  segment?: string;
  org_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  payload?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const event = url.pathname.split("/").pop();
    
    console.log(`Tracking event: ${event}`);
    
    const body: TrackingRequest = await req.json().catch(() => ({}));
    const { contact_id, segment = 'sports', org_name, utm_source, utm_medium, utm_campaign, utm_content, payload = {} } = body;

    // Log the event
    const { error: eventError } = await supabase
      .from('outreach_events')
      .insert({
        contact_id,
        event_name: event || body.event_name,
        payload: {
          segment,
          org_name,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          ...payload,
          timestamp: new Date().toISOString(),
          user_agent: req.headers.get('user-agent'),
          referer: req.headers.get('referer')
        }
      });

    if (eventError) {
      console.error('Error inserting event:', eventError);
    }

    // If it's a page view with UTM parameters and org_name, try to find or create contact
    if ((event === 'invite_viewed' || event === 'landing_viewed') && org_name) {
      const { data: existingContact } = await supabase
        .from('outreach_contacts')
        .select('id')
        .eq('org_name', org_name)
        .eq('segment', segment)
        .single();

      if (!existingContact) {
        // Create new contact record
        const { data: newContact, error: contactError } = await supabase
          .from('outreach_contacts')
          .insert({
            segment,
            org_name,
            status: 'not_contacted',
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content
          })
          .select()
          .single();

        if (contactError) {
          console.error('Error creating contact:', contactError);
        } else {
          console.log(`Created new contact for ${org_name}`);
        }
      } else {
        // Update existing contact with latest UTM data
        await supabase
          .from('outreach_contacts')
          .update({
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingContact.id);
      }
    }

    return new Response(JSON.stringify({ success: true, event, timestamp: new Date().toISOString() }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in track-founding20 function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);