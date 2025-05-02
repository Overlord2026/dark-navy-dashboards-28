
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Notifies an advisor with the specified type and data payload
 * @param type The notification type (e.g. 'investment_interest', 'budget_interest')
 * @param payload The data to include in the notification
 * @returns A promise that resolves to the notification ID if successful
 */
export const notifyAdvisor = async (type: string, payload: any): Promise<string | undefined> => {
  try {
    // Call the RPC function to notify the advisor
    const { data, error } = await supabase.rpc(
      'notify_advisor',
      {
        type,
        data: payload
      }
    );
    
    if (error) {
      throw error;
    }
    
    console.log(`Advisor notification success, ID: ${data}`);
    return data;
  } catch (error) {
    console.error(`Error notifying advisor (${type}):`, error);
    throw error;
  }
};
