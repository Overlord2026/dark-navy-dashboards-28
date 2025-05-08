
import { supabase } from "@/integrations/supabase/client";

/**
 * Import prospects from partner data into the system
 * @param leadSourceId - The ID of the lead source
 * @param rawData - Array of raw prospect data from the partner
 * @param options - Import options
 * @returns Import results
 */
export async function importProspects(
  leadSourceId: string,
  rawData: Record<string, any>[],
  options?: {
    dryRun?: boolean;
    skipDuplicates?: boolean;
  }
) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "lead-sources-import",
      {
        body: {
          leadSourceId,
          rawData,
          options: options || { skipDuplicates: true }
        }
      }
    );

    if (error) {
      console.error("Import error:", error);
      throw new Error(`Failed to import prospects: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Import service error:", error);
    throw new Error(`Import service error: ${error.message}`);
  }
}

/**
 * Create a field mapping for a lead source
 * @param leadSourceId - The ID of the lead source
 * @param mapping - Object mapping system field names to partner field names
 */
export async function createFieldMapping(
  leadSourceId: string,
  mapping: Record<string, string>
) {
  try {
    const { data, error } = await supabase
      .from("partner_api_mappings")
      .upsert(
        {
          lead_source_id: leadSourceId,
          mapping,
          updated_at: new Date().toISOString() // Convert Date to string
        },
        { onConflict: "lead_source_id" }
      );

    if (error) {
      console.error("Mapping creation error:", error);
      throw new Error(`Failed to create field mapping: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Mapping service error:", error);
    throw new Error(`Mapping service error: ${error.message}`);
  }
}

/**
 * Create a webhook subscription for a lead source
 * @param leadSourceId - The ID of the lead source
 * @param eventType - Event type to subscribe to (e.g., "imported", "qualified")
 * @param targetUrl - URL to deliver webhook payloads to
 */
export async function subscribeToWebhook(
  leadSourceId: string,
  eventType: string,
  targetUrl: string
) {
  try {
    const { data, error } = await supabase
      .from("partner_webhooks")
      .insert({
        lead_source_id: leadSourceId,
        event_type: eventType,
        target_url: targetUrl,
        is_active: true
      });

    if (error) {
      console.error("Webhook subscription error:", error);
      throw new Error(`Failed to subscribe to webhook: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Webhook service error:", error);
    throw new Error(`Webhook service error: ${error.message}`);
  }
}

/**
 * List prospect events for a given prospect
 * @param prospectId - The ID of the prospect
 * @returns Array of events for the prospect
 */
export async function getProspectEvents(prospectId: string) {
  try {
    const { data, error } = await supabase
      .from("prospect_events")
      .select("*")
      .eq("prospect_id", prospectId)
      .order("occurred_at", { ascending: false });

    if (error) {
      console.error("Events retrieval error:", error);
      throw new Error(`Failed to retrieve prospect events: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Events service error:", error);
    throw new Error(`Events service error: ${error.message}`);
  }
}
