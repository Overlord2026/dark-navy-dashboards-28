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

interface InviteRequest {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  segment?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  lead_stage?: string;
  advisor_id?: string;
  email_opt_in?: boolean;
  sms_opt_in?: boolean;
  send_invite?: boolean;
  redirect_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Parse the request body
    const inviteData: InviteRequest = await req.json();
    
    // Basic validation
    if (!inviteData.email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Try to find an existing user with this email
    const { data: existingUser, error: userError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", inviteData.email)
      .maybeSingle();

    let userId;
    
    // If user doesn't exist, create a new one
    if (!existingUser) {
      console.log("Creating new user for email:", inviteData.email);
      
      // Extract name components or use provided values
      let firstName = inviteData.firstName;
      let lastName = inviteData.lastName;
      
      if (inviteData.name && (!firstName || !lastName)) {
        const nameParts = inviteData.name.split(" ");
        if (nameParts.length > 0 && !firstName) {
          firstName = nameParts[0];
        }
        if (nameParts.length > 1 && !lastName) {
          lastName = nameParts.slice(1).join(" ");
        }
      }
      
      // Create user in auth.users if send_invite is true
      if (inviteData.send_invite) {
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
          email: inviteData.email,
          email_confirm: true,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
          },
          password: null, // No password, will use magic link
        });

        if (createError) {
          console.error("Error creating user:", createError);
          return new Response(
            JSON.stringify({ error: "Failed to create user", details: createError.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        userId = authUser.user.id;
        
        // Send invite email with magic link
        if (inviteData.redirect_url) {
          await supabase.auth.admin.generateLink({
            type: "magiclink",
            email: inviteData.email,
            options: {
              redirectTo: inviteData.redirect_url,
            },
          });
        }
      } else {
        // Create a placeholder user ID for the profile if not sending an invite
        userId = crypto.randomUUID();
      }
      
      // Create profile record
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: inviteData.email,
          first_name: firstName,
          last_name: lastName,
          phone: inviteData.phone,
          client_segment: inviteData.segment,
          utm_source: inviteData.utm_source,
          utm_medium: inviteData.utm_medium,
          utm_campaign: inviteData.utm_campaign,
          lead_stage: inviteData.lead_stage || "prospect",
          advisor_id: inviteData.advisor_id,
          email_opt_in: inviteData.email_opt_in || false,
          sms_opt_in: inviteData.sms_opt_in || false,
          role: "client",
        })
        .select()
        .single();
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Failed to create profile", details: profileError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Track lead creation in user_events
      await supabase.from("user_events").insert({
        user_id: userId,
        event_type: "lead_created",
        event_data: { source: "api_invite" },
        utm_data: {
          utm_source: inviteData.utm_source,
          utm_medium: inviteData.utm_medium,
          utm_campaign: inviteData.utm_campaign,
        },
      });
      
      // If GHL integration is enabled and API key is available
      if (ghlApiKey) {
        try {
          // Check if contact exists in GHL
          const checkContact = await fetch(
            `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(
              inviteData.email
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
          let ghlContactId;
          
          // If contact exists, update it, otherwise create new one
          if (contactData && contactData.contacts && contactData.contacts.length > 0) {
            ghlContactId = contactData.contacts[0].id;
            
            // Update existing contact
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                phone: inviteData.phone,
                tags: [inviteData.segment, "API Invite"],
                customField: {
                  segment: inviteData.segment,
                  lead_stage: inviteData.lead_stage || "prospect",
                  utm_source: inviteData.utm_source,
                  utm_medium: inviteData.utm_medium,
                  utm_campaign: inviteData.utm_campaign,
                },
              }),
            });
          } else {
            // Create new contact
            const createContact = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: inviteData.email,
                firstName: firstName,
                lastName: lastName,
                phone: inviteData.phone,
                tags: [inviteData.segment, "API Invite"],
                customField: {
                  segment: inviteData.segment,
                  lead_stage: inviteData.lead_stage || "prospect",
                  utm_source: inviteData.utm_source,
                  utm_medium: inviteData.utm_medium,
                  utm_campaign: inviteData.utm_campaign,
                },
              }),
            });
            
            const newContact = await createContact.json();
            ghlContactId = newContact.contact.id;
          }
          
          // Update the profile with the GHL contact ID
          await supabase
            .from("profiles")
            .update({ ghl_contact_id: ghlContactId })
            .eq("id", userId);
            
        } catch (ghlError) {
          console.error("Error syncing with GHL:", ghlError);
          // Continue processing even if GHL sync fails
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "User created successfully",
          user_id: userId,
          invite_sent: inviteData.send_invite || false,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // User exists, update their profile with new information
      userId = existingUser.id;
      
      const updateData: any = {};
      
      // Only update fields that were provided
      if (inviteData.firstName) updateData.first_name = inviteData.firstName;
      if (inviteData.lastName) updateData.last_name = inviteData.lastName;
      if (inviteData.phone) updateData.phone = inviteData.phone;
      if (inviteData.segment) updateData.client_segment = inviteData.segment;
      if (inviteData.utm_source) updateData.utm_source = inviteData.utm_source;
      if (inviteData.utm_medium) updateData.utm_medium = inviteData.utm_medium;
      if (inviteData.utm_campaign) updateData.utm_campaign = inviteData.utm_campaign;
      if (inviteData.lead_stage) updateData.lead_stage = inviteData.lead_stage;
      if (inviteData.advisor_id) updateData.advisor_id = inviteData.advisor_id;
      if (inviteData.email_opt_in !== undefined) updateData.email_opt_in = inviteData.email_opt_in;
      if (inviteData.sms_opt_in !== undefined) updateData.sms_opt_in = inviteData.sms_opt_in;
      
      // Only update if there are fields to update
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", userId);
          
        if (updateError) {
          console.error("Error updating profile:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to update profile", details: updateError.message }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
      
      // Track lead update in user_events
      await supabase.from("user_events").insert({
        user_id: userId,
        event_type: "lead_updated",
        event_data: { source: "api_invite", fields_updated: Object.keys(updateData) },
        utm_data: {
          utm_source: inviteData.utm_source,
          utm_medium: inviteData.utm_medium,
          utm_campaign: inviteData.utm_campaign,
        },
      });
      
      // If GHL integration is enabled
      if (ghlApiKey) {
        try {
          // Check if profile has GHL contact ID
          const { data: profile } = await supabase
            .from("profiles")
            .select("ghl_contact_id")
            .eq("id", userId)
            .single();
            
          if (profile?.ghl_contact_id) {
            // Update existing GHL contact
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${profile.ghl_contact_id}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firstName: inviteData.firstName,
                lastName: inviteData.lastName,
                phone: inviteData.phone,
                tags: inviteData.segment ? [inviteData.segment] : undefined,
                customField: {
                  segment: inviteData.segment,
                  lead_stage: inviteData.lead_stage,
                  utm_source: inviteData.utm_source,
                  utm_medium: inviteData.utm_medium,
                  utm_campaign: inviteData.utm_campaign,
                },
              }),
            });
          } else {
            // Look up contact in GHL by email
            const checkContact = await fetch(
              `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(
                inviteData.email
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
            let ghlContactId;
            
            if (contactData && contactData.contacts && contactData.contacts.length > 0) {
              ghlContactId = contactData.contacts[0].id;
              
              // Update existing contact
              await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${ghlApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firstName: inviteData.firstName,
                  lastName: inviteData.lastName,
                  phone: inviteData.phone,
                  tags: inviteData.segment ? [inviteData.segment] : undefined,
                  customField: {
                    segment: inviteData.segment,
                    lead_stage: inviteData.lead_stage,
                    utm_source: inviteData.utm_source,
                    utm_medium: inviteData.utm_medium,
                    utm_campaign: inviteData.utm_campaign,
                  },
                }),
              });
            } else {
              // Create new contact
              const createContact = await fetch("https://rest.gohighlevel.com/v1/contacts/", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${ghlApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: inviteData.email,
                  firstName: inviteData.firstName,
                  lastName: inviteData.lastName,
                  phone: inviteData.phone,
                  tags: inviteData.segment ? [inviteData.segment] : undefined,
                  customField: {
                    segment: inviteData.segment,
                    lead_stage: inviteData.lead_stage,
                    utm_source: inviteData.utm_source,
                    utm_medium: inviteData.utm_medium,
                    utm_campaign: inviteData.utm_campaign,
                  },
                }),
              });
              
              const newContact = await createContact.json();
              ghlContactId = newContact.contact.id;
            }
            
            // Update the profile with the GHL contact ID
            await supabase
              .from("profiles")
              .update({ ghl_contact_id: ghlContactId })
              .eq("id", userId);
          }
        } catch (ghlError) {
          console.error("Error syncing with GHL:", ghlError);
          // Continue processing even if GHL sync fails
        }
      }
      
      // Send magic link if requested
      if (inviteData.send_invite && inviteData.redirect_url) {
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email: inviteData.email,
          options: {
            redirectTo: inviteData.redirect_url,
          },
        });
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "User updated successfully",
          user_id: userId,
          invite_sent: inviteData.send_invite || false,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
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