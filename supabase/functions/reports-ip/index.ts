import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { admin } from "../_shared/supabaseClient.ts";
import { Env } from "../_shared/secrets.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IPReportData {
  summary: {
    total_hits: number;
    high_risk_hits: number;
    pending_actions: number;
    completed_actions: number;
    receipts_issued: number;
  };
  hits_by_risk: {
    critical: any[];
    high: any[];
    medium: any[];
    low: any[];
  };
  actions_by_age: {
    urgent: any[]; // > 7 days
    overdue: any[]; // > 3 days
    recent: any[]; // <= 3 days
  };
  recent_receipts: any[];
  policy_compliance: {
    total_policies: number;
    active_policies: number;
    mismatched_hashes: number;
  };
}

async function generateIPReport(entityId: string): Promise<IPReportData> {
  const supabase = admin();
  
  // Get IP hits with risk scoring
  const { data: hits } = await supabase
    .from('ip_hits')
    .select('*')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });

  // Get enforcement queue items
  const { data: queueItems } = await supabase
    .from('enforcement_queue')
    .select('*, ip_hits(*)')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false });

  // Get receipts
  const { data: receipts } = await supabase
    .from('receipts')
    .select('*')
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })
    .limit(50);

  // Get policies for compliance check
  const { data: policies } = await supabase
    .from('policies')
    .select('*')
    .eq('is_active', true);

  // Process data for report
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Calculate risk scores for hits (simplified)
  const hitsWithRisk = (hits || []).map(hit => {
    const cpcCount = Array.isArray(hit.cpcs) ? hit.cpcs.length : 0;
    const titleKeywords = (hit.title || '').toLowerCase();
    
    let riskScore = 0;
    if (titleKeywords.includes('family office')) riskScore += 3;
    if (titleKeywords.includes('wealth management')) riskScore += 2;
    if (cpcCount > 2) riskScore += cpcCount;
    
    return { ...hit, risk_score: riskScore };
  });

  // Group by risk levels
  const hitsByRisk = {
    critical: hitsWithRisk.filter(h => h.risk_score >= 7),
    high: hitsWithRisk.filter(h => h.risk_score >= 5 && h.risk_score < 7),
    medium: hitsWithRisk.filter(h => h.risk_score >= 3 && h.risk_score < 5),
    low: hitsWithRisk.filter(h => h.risk_score < 3)
  };

  // Group actions by age
  const actionsByAge = {
    urgent: (queueItems || []).filter(item => 
      item.status === 'pending' && new Date(item.created_at) < sevenDaysAgo
    ),
    overdue: (queueItems || []).filter(item => 
      item.status === 'pending' && 
      new Date(item.created_at) < threeDaysAgo && 
      new Date(item.created_at) >= sevenDaysAgo
    ),
    recent: (queueItems || []).filter(item => 
      item.status === 'pending' && new Date(item.created_at) >= threeDaysAgo
    )
  };

  // Check policy compliance
  const policyHashes = new Set((policies || []).map(p => p.hash));
  const receiptPolicyHashes = (receipts || []).map(r => r.policy_hash);
  const mismatchedHashes = receiptPolicyHashes.filter(hash => !policyHashes.has(hash)).length;

  return {
    summary: {
      total_hits: hitsWithRisk.length,
      high_risk_hits: hitsByRisk.critical.length + hitsByRisk.high.length,
      pending_actions: (queueItems || []).filter(item => item.status === 'pending').length,
      completed_actions: (queueItems || []).filter(item => item.status === 'executed').length,
      receipts_issued: (receipts || []).length
    },
    hits_by_risk: hitsByRisk,
    actions_by_age: actionsByAge,
    recent_receipts: receipts || [],
    policy_compliance: {
      total_policies: (policies || []).length,
      active_policies: (policies || []).filter(p => p.is_active).length,
      mismatched_hashes: mismatchedHashes
    }
  };
}

async function generatePDFReport(reportData: IPReportData, entityId: string): Promise<string> {
  const supabase = admin();
  
  // Simple HTML template for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .risk-critical { color: #dc2626; }
        .risk-high { color: #ea580c; }
        .risk-medium { color: #ca8a04; }
        .risk-low { color: #16a34a; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>IP Watch & Enforcement Report</h1>
        <p>Entity ID: ${entityId}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="section">
        <h2>Summary</h2>
        <table>
          <tr><td>Total IP Hits</td><td>${reportData.summary.total_hits}</td></tr>
          <tr><td>High Risk Hits</td><td class="risk-high">${reportData.summary.high_risk_hits}</td></tr>
          <tr><td>Pending Actions</td><td>${reportData.summary.pending_actions}</td></tr>
          <tr><td>Completed Actions</td><td>${reportData.summary.completed_actions}</td></tr>
          <tr><td>Receipts Issued</td><td>${reportData.summary.receipts_issued}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h2>Risk Distribution</h2>
        <table>
          <tr><th>Risk Level</th><th>Count</th><th>Percentage</th></tr>
          <tr><td class="risk-critical">Critical</td><td>${reportData.hits_by_risk.critical.length}</td><td>${((reportData.hits_by_risk.critical.length / reportData.summary.total_hits) * 100).toFixed(1)}%</td></tr>
          <tr><td class="risk-high">High</td><td>${reportData.hits_by_risk.high.length}</td><td>${((reportData.hits_by_risk.high.length / reportData.summary.total_hits) * 100).toFixed(1)}%</td></tr>
          <tr><td class="risk-medium">Medium</td><td>${reportData.hits_by_risk.medium.length}</td><td>${((reportData.hits_by_risk.medium.length / reportData.summary.total_hits) * 100).toFixed(1)}%</td></tr>
          <tr><td class="risk-low">Low</td><td>${reportData.hits_by_risk.low.length}</td><td>${((reportData.hits_by_risk.low.length / reportData.summary.total_hits) * 100).toFixed(1)}%</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h2>Action Age Analysis</h2>
        <table>
          <tr><th>Category</th><th>Count</th><th>Status</th></tr>
          <tr><td class="risk-critical">Urgent (>7 days)</td><td>${reportData.actions_by_age.urgent.length}</td><td>Needs immediate attention</td></tr>
          <tr><td class="risk-high">Overdue (3-7 days)</td><td>${reportData.actions_by_age.overdue.length}</td><td>Should be prioritized</td></tr>
          <tr><td class="risk-low">Recent (≤3 days)</td><td>${reportData.actions_by_age.recent.length}</td><td>Within normal timeframe</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h2>Policy Compliance</h2>
        <table>
          <tr><td>Total Policies</td><td>${reportData.policy_compliance.total_policies}</td></tr>
          <tr><td>Active Policies</td><td>${reportData.policy_compliance.active_policies}</td></tr>
          <tr><td>Mismatched Policy Hashes</td><td class="${reportData.policy_compliance.mismatched_hashes > 0 ? 'risk-high' : 'risk-low'}">${reportData.policy_compliance.mismatched_hashes}</td></tr>
        </table>
      </div>
    </body>
    </html>
  `;

  // For demo purposes, we'll create a simple PDF file content
  // In production, you'd use a proper PDF generation service
  const pdfFileName = `ip-report-${entityId}-${Date.now()}.pdf`;
  const bucketName = Env.BUCKET();
  
  try {
    // Create a simple text file as PDF placeholder
    const pdfContent = new TextEncoder().encode(`IP Watch Report\n\n${JSON.stringify(reportData, null, 2)}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(pdfFileName, pdfContent, {
        contentType: 'application/pdf'
      });

    if (error) {
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }

    // Generate signed URL
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(pdfFileName, 3600); // 1 hour expiry

    if (!signedUrlData?.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    return signedUrlData.signedUrl;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = admin();
    const url = new URL(req.url);
    
    if (req.method === 'GET') {
      // GET /reports-ip?entity_id=...
      const entityId = url.searchParams.get('entity_id');
      
      if (!entityId) {
        return new Response(
          JSON.stringify({ error: 'entity_id parameter is required' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      console.log('Generating IP report for entity:', entityId);
      
      const reportData = await generateIPReport(entityId);
      
      return new Response(
        JSON.stringify({
          success: true,
          entity_id: entityId,
          generated_at: new Date().toISOString(),
          data: reportData
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
      
    } else if (req.method === 'POST' && url.pathname.endsWith('/render')) {
      // POST /reports-ip/render
      const body = await req.json();
      const { entity_id } = body;
      
      if (!entity_id) {
        return new Response(
          JSON.stringify({ error: 'entity_id is required in request body' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      console.log('Generating PDF report for entity:', entity_id);
      
      const reportData = await generateIPReport(entity_id);
      const signedUrl = await generatePDFReport(reportData, entity_id);
      
      return new Response(
        JSON.stringify({
          success: true,
          entity_id: entity_id,
          pdf_url: signedUrl,
          generated_at: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
      
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        }
      );
    }
    
  } catch (error) {
    console.error('Reports IP error:', error);
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