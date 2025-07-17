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

interface AssignmentRequest {
  client_id?: string;
  client_email?: string;
  advisor_id: string;
  notes?: string;
  lead_stage?: string;
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
    // Create a Supabase client with the service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceRole);
    
    // Parse the request body
    const assignmentData: AssignmentRequest = await req.json();
    
    // Basic validation
    if (!assignmentData.advisor_id) {
      return new Response(
        JSON.stringify({ error: "Advisor ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (!assignmentData.client_id && !assignmentData.client_email) {
      return new Response(
        JSON.stringify({ error: "Either client_id or client_email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Verify advisor exists
    const { data: advisor, error: advisorError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role")
      .eq("id", assignmentData.advisor_id)
      .single();
      
    if (advisorError || !advisor) {
      return new Response(
        JSON.stringify({ error: "Invalid advisor ID" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Verify advisor has correct role
    if (advisor.role !== "advisor" && advisor.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "The specified user is not an advisor" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Get client ID from email if not provided
    let clientId = assignmentData.client_id;
    
    if (!clientId && assignmentData.client_email) {
      const { data: client, error: clientError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", assignmentData.client_email)
        .maybeSingle();
        
      if (clientError) {
        return new Response(
          JSON.stringify({ error: "Error looking up client", details: clientError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (client) {
        clientId = client.id;
      } else {
        return new Response(
          JSON.stringify({ error: "Client not found with the provided email" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }
    
    // Update client's profile with advisor ID and lead stage if provided
    const updateData: any = { advisor_id: assignmentData.advisor_id };
    
    if (assignmentData.lead_stage) {
      updateData.lead_stage = assignmentData.lead_stage;
    }
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", clientId);
      
    if (updateError) {
      return new Response(
        JSON.stringify({ error: "Failed to update client profile", details: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Create or update advisor assignment record
    const { data: existingAssignment } = await supabase
      .from("advisor_assignments")
      .select("id")
      .eq("client_id", clientId)
      .eq("advisor_id", assignmentData.advisor_id)
      .maybeSingle();
      
    if (existingAssignment) {
      // Update existing assignment
      await supabase
        .from("advisor_assignments")
        .update({
          status: "active",
          notes: assignmentData.notes,
          assigned_at: new Date().toISOString(),
        })
        .eq("id", existingAssignment.id);
    } else {
      // Create new assignment
      await supabase
        .from("advisor_assignments")
        .insert({
          advisor_id: assignmentData.advisor_id,
          client_id: clientId,
          status: "active",
          notes: assignmentData.notes,
        });
    }
    
    // Track event in user_events
    await supabase.from("user_events").insert({
      user_id: clientId,
      event_type: "advisor_assigned",
      event_data: {
        advisor_id: assignmentData.advisor_id,
        lead_stage: assignmentData.lead_stage,
        notes: assignmentData.notes,
      },
    });
    
    // Sync with GHL if requested and API key is available
    if (assignmentData.notify_ghl && ghlApiKey) {
      try {
        // Get client profile for GHL contact ID
        const { data: clientProfile } = await supabase
          .from("profiles")
          .select("ghl_contact_id, email")
          .eq("id", clientId)
          .single();
          
        if (clientProfile) {
          let ghlContactId = clientProfile.ghl_contact_id;
          
          // If no GHL contact ID, look up by email
          if (!ghlContactId && clientProfile.email) {
            const checkContact = await fetch(
              `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(
                clientProfile.email
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
                .eq("id", clientId);
            }
          }
          
          // Update GHL contact with advisor assignment
          if (ghlContactId) {
            // Add note about advisor assignment
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}/notes`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                body: `Assigned to advisor: ${advisor.first_name} ${advisor.last_name}${
                  assignmentData.notes ? `\nNotes: ${assignmentData.notes}` : ""
                }`,
              }),
            });
            
            // Update custom fields
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}`, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customField: {
                  advisor_id: assignmentData.advisor_id,
                  advisor_name: `${advisor.first_name} ${advisor.last_name}`,
                  lead_stage: assignmentData.lead_stage,
                },
              }),
            });
            
            // Add advisor assignment tag
            await fetch(`https://rest.gohighlevel.com/v1/contacts/${ghlContactId}/tags`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghlApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                tags: ["Has Advisor", `Advisor: ${advisor.first_name} ${advisor.last_name}`],
              }),
            });
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
        message: "Advisor assigned successfully",
        client_id: clientId,
        advisor_id: assignmentData.advisor_id,
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