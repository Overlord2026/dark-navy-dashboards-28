import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { admin } from "../_shared/supabaseClient.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IPWatchRequest {
  cpcs: string[];
  keywords: string[];
  window_days: number;
  entity_id: string;
}

interface IPHit {
  title: string;
  abstract: string;
  url: string;
  cpcs: string[];
  risk_score: number;
  reason_codes: string[];
}

// Mock parser for Google Patents (respects robots.txt guidelines)
async function parseGooglePatents(query: string): Promise<IPHit[]> {
  // In production, this would make actual HTTP requests with proper rate limiting
  // For now, return mock data to demonstrate the flow
  console.log(`Mock parsing Google Patents for query: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    {
      title: `Patent related to ${query}`,
      abstract: `This patent describes technology similar to ${query} with potential overlap`,
      url: `https://patents.google.com/patent/mock-${Date.now()}`,
      cpcs: query.includes('family office') ? ['G06Q40/06', 'G06Q40/00'] : ['G06F16/00'],
      risk_score: Math.random() * 10,
      reason_codes: query.includes('family office') ? ['keyword_match', 'cpc_overlap'] : ['keyword_match']
    }
  ];
}

// Calculate risk score based on overlaps
function calculateRiskScore(hit: Partial<IPHit>, targetCpcs: string[], keywords: string[]): { score: number, reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  
  // CPC overlap scoring
  if (hit.cpcs) {
    const cpcOverlap = hit.cpcs.filter(cpc => targetCpcs.includes(cpc)).length;
    if (cpcOverlap > 0) {
      score += cpcOverlap * 2;
      reasons.push('cpc_overlap');
    }
  }
  
  // Keyword matching
  const titleText = hit.title?.toLowerCase() || '';
  const abstractText = hit.abstract?.toLowerCase() || '';
  const keywordMatches = keywords.filter(keyword => 
    titleText.includes(keyword.toLowerCase()) || abstractText.includes(keyword.toLowerCase())
  ).length;
  
  if (keywordMatches > 0) {
    score += keywordMatches * 1.5;
    reasons.push('keyword_match');
  }
  
  // High relevance threshold
  if (score > 5) {
    reasons.push('high_relevance');
  }
  
  return { score, reasons };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = admin();
    const body: IPWatchRequest = await req.json();
    
    console.log('Starting IP Watch poll for entity:', body.entity_id);
    
    const { cpcs, keywords, window_days, entity_id } = body;
    const processedHits: IPHit[] = [];
    const RISK_THRESHOLD = 4.0; // Configurable threshold
    
    // Process each search query (keywords + CPCs)
    for (const keyword of keywords) {
      try {
        const hits = await parseGooglePatents(keyword);
        
        for (const hit of hits) {
          const { score, reasons } = calculateRiskScore(hit, cpcs, keywords);
          
          const processedHit: IPHit = {
            ...hit,
            risk_score: score,
            reason_codes: reasons
          };
          
          // Upsert into ip_hits
          const { data: hitData, error: hitError } = await supabase
            .from('ip_hits')
            .upsert({
              source: 'google_patents',
              ref: hit.url,
              title: hit.title,
              abstract: hit.abstract,
              cpcs: hit.cpcs,
              entity_id: entity_id,
              ts: new Date().toISOString()
            }, { 
              onConflict: 'ref',
              ignoreDuplicates: false 
            })
            .select()
            .single();
          
          if (hitError) {
            console.error('Error upserting IP hit:', hitError);
            continue;
          }
          
          console.log(`Processed hit: ${hit.title} (risk: ${score})`);
          
          // If hit crosses threshold, emit receipt and queue enforcement
          if (score >= RISK_THRESHOLD) {
            const inputs_json = {
              hit_id: hitData.hit_id,
              title: hit.title,
              abstract: hit.abstract,
              cpcs: hit.cpcs,
              url: hit.url,
              risk_score: score,
              timestamp: new Date().toISOString()
            };
            
            const policy_json = {
              policy_name: 'ip_watch_monitoring_v1',
              threshold: RISK_THRESHOLD,
              window_days: window_days,
              detection_methods: ['keyword_match', 'cpc_overlap', 'content_similarity']
            };
            
            // Call receipt_emit function
            const { data: receiptId, error: receiptError } = await supabase
              .rpc('receipt_emit', {
                inputs_json,
                policy_json,
                outcome: 'watchlist_add',
                reasons: reasons,
                entity_id: entity_id
              });
            
            if (receiptError) {
              console.error('Error emitting receipt:', receiptError);
            } else {
              console.log('Receipt emitted:', receiptId);
            }
            
            // Insert into enforcement queue
            const priority = score >= 7 ? 1 : score >= 6 ? 2 : 3;
            const action = score >= 7 ? 'review' : 'notify';
            
            const { error: queueError } = await supabase
              .from('enforcement_queue')
              .insert({
                entity_id: entity_id,
                action: action,
                status: 'pending',
                priority: priority,
                ref_hit_id: hitData.hit_id
              });
            
            if (queueError) {
              console.error('Error queueing enforcement:', queueError);
            } else {
              console.log(`Queued enforcement: ${action} (priority: ${priority})`);
            }
          }
          
          processedHits.push(processedHit);
        }
      } catch (error) {
        console.error(`Error processing keyword "${keyword}":`, error);
      }
    }
    
    console.log(`IP Watch poll completed. Processed ${processedHits.length} hits`);
    
    return new Response(
      JSON.stringify({
        success: true,
        processed_hits: processedHits.length,
        high_risk_hits: processedHits.filter(hit => hit.risk_score >= RISK_THRESHOLD).length,
        entity_id: entity_id,
        threshold_used: RISK_THRESHOLD
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('IP Watch poll error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});