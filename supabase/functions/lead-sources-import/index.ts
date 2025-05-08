
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "../_shared/cors.ts";

interface ImportRequest {
  leadSourceId: string;
  rawData: Record<string, any>[];
  options?: {
    dryRun?: boolean;
    skipDuplicates?: boolean;
  };
}

interface ImportResponse {
  success: boolean;
  imported: number;
  failed: number;
  errors?: string[];
  message?: string;
  dryRun?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );

    // Parse request body
    const { leadSourceId, rawData, options }: ImportRequest = await req.json();
    const dryRun = options?.dryRun ?? false;
    const skipDuplicates = options?.skipDuplicates ?? true;

    if (!leadSourceId || !Array.isArray(rawData) || rawData.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid request parameters",
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Validate lead source existence
    const { data: leadSource, error: leadSourceError } = await supabaseClient
      .from("lead_sources")
      .select("id, name, source_type")
      .eq("id", leadSourceId)
      .single();

    if (leadSourceError || !leadSource) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Lead source not found",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404
        }
      );
    }

    // Fetch field mapping for this lead source
    const { data: mappingData, error: mappingError } = await supabaseClient
      .from("partner_api_mappings")
      .select("mapping")
      .eq("lead_source_id", leadSourceId)
      .maybeSingle();

    if (mappingError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error fetching field mapping",
          errors: [mappingError.message],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Use default mapping if none defined
    const fieldMap = mappingData?.mapping as Record<string, string> || {
      "first_name": "firstName",
      "last_name": "lastName",
      "email": "email",
      "phone": "phoneNumber",
      "unique_external_id": "id"
    };

    // Normalize the data based on field mappings
    const normalizedData = rawData.map(record => {
      const normalized: Record<string, any> = {
        lead_source_id: leadSourceId,
      };

      // Map fields according to the mapping
      for (const [systemField, partnerField] of Object.entries(fieldMap)) {
        normalized[systemField] = record[partnerField] ?? null;
      }

      // Ensure we have a unique_external_id
      if (!normalized.unique_external_id && record.id) {
        normalized.unique_external_id = record.id;
      } else if (!normalized.unique_external_id) {
        // Generate a reliable hash of the record for idempotency
        normalized.unique_external_id = `${leadSourceId}_${
          JSON.stringify(record).split("").reduce(
            (hash, char) => (((hash << 5) - hash) + char.charCodeAt(0)) | 0, 0
          )
        }`;
      }

      return normalized;
    });

    // If dry run, just return the normalized data
    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Dry run completed",
          dryRun: true,
          normalizedData,
          imported: 0,
          failed: 0,
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

    // Insert or update the prospects
    let importedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < normalizedData.length; i += batchSize) {
      const batch = normalizedData.slice(i, i + batchSize);
      
      // Upsert the batch
      const { data: insertedData, error: insertError } = await supabaseClient
        .from("prospects")
        .upsert(batch, {
          onConflict: skipDuplicates ? "unique_external_id,lead_source_id" : undefined,
          ignoreDuplicates: skipDuplicates,
          returning: "minimal",
        });

      if (insertError) {
        failedCount += batch.length;
        errors.push(`Batch ${i / batchSize} error: ${insertError.message}`);
        continue;
      }

      importedCount += batch.length;

      // Record events for successful imports
      await Promise.all(
        batch.map(async (prospect) => {
          try {
            // Get the inserted prospect ID
            const { data: prospectData } = await supabaseClient
              .from("prospects")
              .select("id")
              .eq("unique_external_id", prospect.unique_external_id)
              .eq("lead_source_id", leadSourceId)
              .limit(1)
              .single();

            if (prospectData?.id) {
              // Record the import event
              await supabaseClient.from("prospect_events").insert({
                prospect_id: prospectData.id,
                event_type: "imported",
              });

              // Trigger webhooks
              await triggerWebhooks(supabaseClient, leadSourceId, prospectData.id, "imported");
            }
          } catch (err) {
            console.error("Failed to process events:", err);
          }
        })
      );
    }

    // Update lead source log
    await supabaseClient.from("lead_source_logs").insert({
      lead_source_id: leadSourceId,
      status: failedCount > 0 ? "partial" : "completed",
      records_processed: normalizedData.length,
      records_imported: importedCount,
      records_failed: failedCount,
      message: failedCount > 0 ? "Some records failed to import" : "Import completed successfully",
      completed_at: new Date().toISOString(),
      details: errors.length > 0 ? { errors } : null,
    });

    return new Response(
      JSON.stringify({
        success: true,
        imported: importedCount,
        failed: failedCount,
        errors: errors.length > 0 ? errors : undefined,
        message: failedCount > 0 
          ? `Imported ${importedCount} prospects with ${failedCount} failures` 
          : `Successfully imported ${importedCount} prospects`,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Import error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        imported: 0,
        failed: 1,
        message: "Server error during import process",
        errors: [error.message],
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

async function triggerWebhooks(
  supabase: any,
  leadSourceId: string,
  prospectId: string,
  eventType: string
): Promise<void> {
  try {
    // Fetch active webhooks for this event type
    const { data: webhooks } = await supabase
      .from("partner_webhooks")
      .select("id, target_url")
      .eq("lead_source_id", leadSourceId)
      .eq("event_type", eventType)
      .eq("is_active", true);

    if (!webhooks || webhooks.length === 0) {
      return;
    }

    // Create a minimal payload with essential info
    const payload = {
      event_type: eventType,
      prospect_id: prospectId,
      lead_source_id: leadSourceId,
      timestamp: new Date().toISOString(),
    };

    // Dispatch to all webhooks with retry
    await Promise.all(
      webhooks.map(async (webhook) => {
        try {
          // Simple retry logic
          const maxRetries = 2;
          let retries = 0;
          let success = false;

          while (!success && retries <= maxRetries) {
            try {
              const response = await fetch(webhook.target_url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Hook-Signature": generateSignature(webhook.id, payload),
                },
                body: JSON.stringify(payload),
              });

              success = response.ok;
              
              if (!success) {
                retries++;
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
              }
            } catch (err) {
              retries++;
              // Exponential backoff
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            }
          }

          // Log webhook delivery status
          await supabase.from("audit_logs").insert({
            user_id: '00000000-0000-0000-0000-000000000000', // System user
            event_type: "webhook_delivery",
            status: success ? "success" : "failed",
            details: {
              webhook_id: webhook.id,
              target_url: webhook.target_url,
              event_type: eventType,
              prospect_id: prospectId,
              retries,
              success,
            },
          });
        } catch (error) {
          console.error("Webhook delivery failed:", error);
        }
      })
    );
  } catch (error) {
    console.error("Error processing webhooks:", error);
  }
}

function generateSignature(webhookId: string, payload: any): string {
  // In a real implementation, this would use a secure hashing algorithm with a secret key
  // For demonstration purposes, we're using a simple string concatenation
  return `webhook_${webhookId}_${Date.now()}`;
}
