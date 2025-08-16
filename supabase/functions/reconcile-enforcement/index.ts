import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { admin } from "../_shared/supabaseClient.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscalationResult {
  escalated_items: number;
  receipts_emitted: number;
  errors: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = admin();
    
    console.log('Starting enforcement reconciliation process');
    
    // Configuration
    const ESCALATION_DAYS = 7; // Items older than 7 days get escalated
    const BATCH_SIZE = 50; // Process items in batches
    
    const result: EscalationResult = {
      escalated_items: 0,
      receipts_emitted: 0,
      errors: []
    };
    
    // 1. Find enforcement items older than N days that are still pending
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ESCALATION_DAYS);
    
    const { data: oldItems, error: queryError } = await supabase
      .from('enforcement_queue')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', cutoffDate.toISOString())
      .order('priority', { ascending: true }) // Handle high priority first
      .limit(BATCH_SIZE);
    
    if (queryError) {
      throw new Error(`Failed to query old enforcement items: ${queryError.message}`);
    }
    
    console.log(`Found ${oldItems?.length || 0} items to escalate`);
    
    if (!oldItems || oldItems.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No items found for escalation',
          ...result
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // 2. Process each item for escalation
    for (const item of oldItems) {
      try {
        console.log(`Processing escalation for item: ${item.item_id}`);
        
        // Get the related IP hit for context
        const { data: hit } = await supabase
          .from('ip_hits')
          .select('*')
          .eq('hit_id', item.ref_hit_id)
          .single();
        
        // Determine escalation action
        let newAction = item.action;
        let newPriority = Math.max(1, item.priority - 1); // Increase priority
        
        switch (item.action) {
          case 'notify':
            newAction = 'review';
            break;
          case 'review':
            newAction = 'escalate';
            break;
          case 'escalate':
            newAction = 'urgent_review';
            newPriority = 1; // Highest priority
            break;
        }
        
        // 3. Emit delta receipt for escalation
        const inputs_json = {
          original_item_id: item.item_id,
          original_action: item.action,
          new_action: newAction,
          escalation_reason: 'timeout_escalation',
          days_pending: ESCALATION_DAYS,
          hit_context: hit ? {
            hit_id: hit.hit_id,
            title: hit.title,
            source: hit.source
          } : null,
          timestamp: new Date().toISOString()
        };
        
        const policy_json = {
          policy_name: 'enforcement_escalation_v1',
          escalation_rules: {
            timeout_days: ESCALATION_DAYS,
            escalation_chain: ['notify', 'review', 'escalate', 'urgent_review']
          },
          automated: true
        };
        
        // Call receipt_emit function for the escalation
        const { data: receiptId, error: receiptError } = await supabase
          .rpc('receipt_emit', {
            inputs_json,
            policy_json,
            outcome: 'escalate',
            reasons: ['timeout_escalation', 'automated_process'],
            entity_id: item.entity_id
          });
        
        if (receiptError) {
          result.errors.push(`Receipt emission failed for item ${item.item_id}: ${receiptError.message}`);
          console.error('Receipt emission failed:', receiptError);
          continue;
        }
        
        result.receipts_emitted++;
        console.log('Escalation receipt emitted:', receiptId);
        
        // 4. Update the enforcement queue item
        const { error: updateError } = await supabase
          .from('enforcement_queue')
          .update({
            action: newAction,
            priority: newPriority,
            status: 'escalated',
            updated_at: new Date().toISOString()
          })
          .eq('item_id', item.item_id);
        
        if (updateError) {
          result.errors.push(`Update failed for item ${item.item_id}: ${updateError.message}`);
          console.error('Update failed:', updateError);
          continue;
        }
        
        // 5. Create new enforcement queue item for the escalated action
        const { error: insertError } = await supabase
          .from('enforcement_queue')
          .insert({
            entity_id: item.entity_id,
            action: newAction,
            status: 'pending',
            priority: newPriority,
            ref_hit_id: item.ref_hit_id
          });
        
        if (insertError) {
          result.errors.push(`New queue item creation failed for ${item.item_id}: ${insertError.message}`);
          console.error('New queue item creation failed:', insertError);
          continue;
        }
        
        result.escalated_items++;
        console.log(`Successfully escalated item ${item.item_id}: ${item.action} -> ${newAction}`);
        
      } catch (error) {
        result.errors.push(`Processing failed for item ${item.item_id}: ${error.message}`);
        console.error('Item processing failed:', error);
      }
    }
    
    // 6. Log completion
    console.log(`Enforcement reconciliation completed. Escalated: ${result.escalated_items}, Receipts: ${result.receipts_emitted}, Errors: ${result.errors.length}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Reconciliation completed`,
        ...result,
        processed_date: new Date().toISOString(),
        cutoff_date: cutoffDate.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Enforcement reconciliation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        escalated_items: 0,
        receipts_emitted: 0,
        errors: [error.message]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});