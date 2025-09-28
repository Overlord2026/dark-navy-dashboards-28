import { supabase } from "@/integrations/supabase/client";

type EventName =
  | "legacy.flow_started"
  | "legacy.checklist_completed"
  | "legacy.export_created"
  | "legacy.share_granted"
  | "legacy.reminder_scheduled"
  | "legacy.item_updated";

type EventPayload = {
  household_id?: string | null;
  plan_key?: string | null;
  advisor_firm_id?: string | null;
  export_hash?: string | null;
  data?: Record<string, unknown> | null;
};

export async function logLegacy(event: EventName, payload: EventPayload = {}) {
  const { household_id = null, plan_key = null, advisor_firm_id = null, export_hash = null, data = {} } = payload;
  
  try {
    // Note: Function may not be typed yet in generated types, using type assertion
    const { error } = await supabase.rpc("app_event_log" as any, {
      p_event: event,
      p_household_id: household_id,
      p_plan_key: plan_key,
      p_advisor_firm_id: advisor_firm_id,
      p_export_hash: export_hash,
      p_data: data
    });
    
    if (error) {
      console.warn("[telemetry] app_event_log failed", { event, error });
    }
  } catch (error) {
    // Keep non-blocking for production reliability
    console.warn("[telemetry] telemetry error", { event, error });
  }
}

// Convenience functions for common legacy events
export const trackFlowStarted = (householdId: string, planKey?: string) => 
  logLegacy("legacy.flow_started", { household_id: householdId, plan_key: planKey });

export const trackChecklistCompleted = (householdId: string, planKey?: string) => 
  logLegacy("legacy.checklist_completed", { household_id: householdId, plan_key: planKey });

export const trackExportCreated = (householdId: string, exportHash: string, planKey?: string) => 
  logLegacy("legacy.export_created", { household_id: householdId, export_hash: exportHash, plan_key: planKey });

export const trackShareGranted = (householdId: string, planKey?: string) => 
  logLegacy("legacy.share_granted", { household_id: householdId, plan_key: planKey });

export const trackItemUpdated = (householdId: string, itemData: Record<string, unknown>, planKey?: string) => 
  logLegacy("legacy.item_updated", { household_id: householdId, data: itemData, plan_key: planKey });

export const trackReminderScheduled = (householdId: string, planKey?: string, reminderData?: Record<string, unknown>) => 
  logLegacy("legacy.reminder_scheduled", { household_id: householdId, plan_key: planKey, data: reminderData });
