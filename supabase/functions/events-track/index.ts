import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client with Deno.env
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ghlApiKey = Deno.env.get("GHL_API_KEY") || "";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EventData {
  event_type: string;
  user_id?: string;
  email?: string;
  event_data?: any;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  notify_ghl?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse authorization header
    const authHeader = req.headers.get("Authorization");
    let supabase;
    
    // Check if we have a user token or need to use service role
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Client has provided their own token
      const token = authHeader.split(" ")[1];
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
    } else {
      // Use service role for admin operations (external requests)
      supabase = createClient(supabaseUrl, supabaseServiceRole);
    }

    // Parse the request body
    const eventData: EventData = await req.json();

    // Basic validation
    if (!eventData.event_type) {
      return new Response(
        JSON.stringify({ error: "Event type is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Require either user_id or email
    if (!eventData.user_id && !eventData.email) {
      return new Response(
        JSON.stringify({ error: "Either user_id or email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let userId = eventData.user_id;
    
    // If only email is provided, look up the user ID
    if (!userId && eventData.email) {
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", eventData.email)
        .maybeSingle();

      if (userError) {
        console.error("Error looking up user:", userError);
        return new Response(
          JSON.stringify({ error: "Failed to lookup user", details: userError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (user) {
        userId = user.id;
      } else {
        // Create a new user profile if email exists but user doesn't
        // This allows tracking events for users who haven't signed up yet
        userId = crypto.randomUUID();
        
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: eventData.email,
            role: "client",
            utm_source: eventData.utm_source,
            utm_medium: eventData.utm_medium,
            utm_campaign: eventData.utm_campaign,
          });

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          return new Response(
            JSON.stringify({ error: "Failed to create user profile", details: insertError.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Insert the event into the user_events table
    const { data: eventRecord, error: eventError } = await supabase
      .from("user_events")
      .insert({
        user_id: userId,
        event_type: eventData.event_type,
        event_data: eventData.event_data || {},
        utm_data: {
          utm_source: eventData.utm_source,
          utm_medium: eventData.utm_medium,
          utm_campaign: eventData.utm_campaign,
        },
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error tracking event:", eventError);
      return new Response(
        JSON.stringify({ error: "Failed to track event", details: eventError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the user's last_active_at timestamp
    await supabase
      .from("profiles")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", userId);
      
    // Sync with GHL if requested and API key is available
    if (eventData.notify_ghl && ghlApiKey) {
      try {
        // Get user profile for GHL contact ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("ghl_contact_id, email")
          .eq("id", userId)
          .single();

        if (profile) {
          let ghlContactId = profile.ghl_contact_id;
          
          // If no GHL contact ID, look up by email
          if (!ghlContactId && profile.email) {
            const checkContact = await fetch(
              `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(
                profile.email
              )}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${ghlApiKey}`,
                  "Content-Type": "application/json",
                },
              }
            );
            
            const contactData = await checkContact.json();
            
            if (contactData && contactData.contacts && contactData.contacts.length > 0) {
              ghlContactId = contactData.contacts[0].id;
              
              // Update profile with GHL contact ID
              await supabase
                .from("profiles")
                .update({ ghl_contact_id: ghlContactId })
                .eq("id", userId);
            }
          }
          
          // Add event note to GHL contact
          if (ghlContactId) {
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}/notes`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                body: `[EVENT] ${eventData.event_type}: ${JSON.stringify(eventData.event_data || {})}`,
              }),
            });
            
            // Add tag based on event type
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}/tags`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tags: [`event_${eventData.event_type.replace(/\s+/g, '_')}`],
              }),
            });
            
            // Update the event record to mark as GHL synced
            await supabase
              .from("user_events")
              .update({ ghl_synced: true })
              .eq("id", eventRecord.id);
          }
        }
      } catch (ghlError) {
        console.error("Error syncing with GHL:", ghlError);
        // Continue processing even if GHL sync fails
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Event tracked successfully",
        event_id: eventRecord.id,
        user_id: userId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});