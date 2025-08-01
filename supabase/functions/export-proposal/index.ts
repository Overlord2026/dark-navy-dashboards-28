import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProposalData {
  client: {
    name: string;
    proposal_date: string;
    advisor: string;
  };
  executive_summary: any;
  current_portfolio: any;
  recommended_changes: any[];
  implementation_plan: any[];
  fee_structure: any;
  disclaimers: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { 
      proposal_data, 
      portfolio, 
      client_name, 
      client_email, 
      format, 
      include_ai_insights,
      ai_insights 
    } = await req.json();

    console.log('Exporting proposal:', { client_name, format });

    if (format === 'pdf') {
      const pdfData = await generatePDF(proposal_data, portfolio, include_ai_insights ? ai_insights : '');
      
      return new Response(JSON.stringify({
        pdf_data: pdfData,
        filename: `Portfolio_Proposal_${client_name.replace(/\s+/g, '_')}.pdf`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    if (format === 'email') {
      await sendProposalEmail(proposal_data, portfolio, client_email, client_name, ai_insights);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Proposal sent successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid export format');

  } catch (error) {
    console.error('Error in export-proposal function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to export proposal'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generatePDF(proposalData: ProposalData, portfolio: any, aiInsights: string): Promise<string> {
  // Generate comprehensive PDF using a PDF library
  // For now, return a mock base64 PDF
  
  const htmlContent = generateProposalHTML(proposalData, portfolio, aiInsights);
  
  // Would use a service like Puppeteer or similar to generate PDF
  // For demo purposes, return mock base64 data
  const mockPDFData = btoa(`
    Mock PDF Content for ${proposalData.client.name}
    
    Generated on: ${proposalData.client.proposal_date}
    
    Executive Summary:
    - Portfolio Value: $${proposalData.current_portfolio.total_value.toLocaleString()}
    - Risk Score: ${proposalData.current_portfolio.risk_score}
    - Annual Income: $${proposalData.current_portfolio.annual_income.toLocaleString()}
    
    This would be a comprehensive PDF report with charts, analysis, and recommendations.
    
    ${aiInsights ? `AI Insights: ${aiInsights}` : ''}
  `);
  
  return mockPDFData;
}

function generateProposalHTML(proposalData: ProposalData, portfolio: any, aiInsights: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Investment Proposal - ${proposalData.client.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin: 30px 0; }
        .metric { display: inline-block; margin: 10px 20px; }
        .chart-placeholder { width: 100%; height: 200px; background: #f5f5f5; border: 1px solid #ddd; }
        .recommendation { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
        .footer { margin-top: 50px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Investment Proposal</h1>
        <h2>Prepared for ${proposalData.client.name}</h2>
        <p>Date: ${proposalData.client.proposal_date}</p>
      </div>
      
      <div class="section">
        <h3>Executive Summary</h3>
        <div class="metric">
          <strong>Portfolio Value:</strong> $${proposalData.current_portfolio.total_value.toLocaleString()}
        </div>
        <div class="metric">
          <strong>Risk Score:</strong> ${proposalData.current_portfolio.risk_score}/100
        </div>
        <div class="metric">
          <strong>Annual Income:</strong> $${proposalData.current_portfolio.annual_income.toLocaleString()}
        </div>
      </div>
      
      <div class="section">
        <h3>Current Portfolio Analysis</h3>
        <div class="chart-placeholder">Asset Allocation Chart</div>
      </div>
      
      <div class="section">
        <h3>Recommended Changes</h3>
        ${proposalData.recommended_changes.map(change => `
          <div class="recommendation">
            <strong>${change.action}:</strong> ${change.security}<br>
            <em>${change.rationale}</em>
          </div>
        `).join('')}
      </div>
      
      ${aiInsights ? `
        <div class="section">
          <h3>AI-Generated Insights</h3>
          <p>${aiInsights}</p>
        </div>
      ` : ''}
      
      <div class="section">
        <h3>Implementation Plan</h3>
        ${proposalData.implementation_plan.map((phase, index) => `
          <h4>Phase ${index + 1}: ${phase.phase}</h4>
          <p><strong>Timeframe:</strong> ${phase.timeframe}</p>
          <ul>
            ${phase.actions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        `).join('')}
      </div>
      
      <div class="section">
        <h3>Fee Structure</h3>
        <p><strong>Advisory Fee:</strong> ${proposalData.fee_structure.advisory_fee}% annually</p>
        <p><strong>Estimated Annual Cost:</strong> $${proposalData.fee_structure.estimated_annual_cost.toLocaleString()}</p>
      </div>
      
      <div class="footer">
        <h4>Important Disclaimers</h4>
        ${proposalData.disclaimers.map(disclaimer => `<p>• ${disclaimer}</p>`).join('')}
      </div>
    </body>
    </html>
  `;
}

async function sendProposalEmail(
  proposalData: ProposalData, 
  portfolio: any, 
  clientEmail: string, 
  clientName: string,
  aiInsights: string
): Promise<void> {
  // Would integrate with email service (SendGrid, etc.)
  console.log('Sending proposal email to:', clientEmail);
  
  const emailContent = generateEmailContent(proposalData, portfolio, clientName, aiInsights);
  
  // Mock email sending - would integrate with actual email service
  console.log('Email content generated:', emailContent.substring(0, 200) + '...');
  
  // Log the email send event
  console.log(`Proposal email sent to ${clientEmail} for ${clientName}`);
}

function generateEmailContent(
  proposalData: ProposalData, 
  portfolio: any, 
  clientName: string,
  aiInsights: string
): string {
  return `
    Dear ${clientName},

    Thank you for the opportunity to review your investment portfolio. I've completed a comprehensive analysis and have prepared a detailed proposal for your consideration.

    Executive Summary:
    • Current Portfolio Value: $${proposalData.current_portfolio.total_value.toLocaleString()}
    • Current Risk Score: ${proposalData.current_portfolio.risk_score}/100
    • Annual Income: $${proposalData.current_portfolio.annual_income.toLocaleString()}

    Key Recommendations:
    ${proposalData.recommended_changes.slice(0, 3).map(change => 
      `• ${change.action} ${change.security}: ${change.rationale}`
    ).join('\n')}

    ${aiInsights ? `
    AI-Generated Insights:
    ${aiInsights.substring(0, 500)}...
    ` : ''}

    I'd be happy to schedule a meeting to discuss these recommendations in detail and answer any questions you may have.

    Best regards,
    ${proposalData.client.advisor}

    ---
    This proposal is confidential and prepared specifically for ${clientName}. 
    Past performance does not guarantee future results.
  `;
}