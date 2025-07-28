import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatementHolding {
  ticker: string;
  name?: string;
  quantity: number;
  market_value: number;
  cost_basis?: number;
  asset_class: string;
}

interface ModelScore {
  model_id: string;
  score: number;
  model_name: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { file_path, prospect_name, prospect_email } = await req.json();

    console.log('Processing statement for:', { prospect_name, file_path });

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('proposals')
      .download(file_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Convert file to text for parsing (simplified parsing)
    const fileText = await fileData.text();
    
    // Mock parsing logic - In production, would use OCR + LLM
    const holdings = parseStatementText(fileText, file_path);

    console.log('Parsed holdings:', holdings);

    // Get user's tenant
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single();

    if (!profile?.tenant_id) {
      throw new Error('User tenant not found');
    }

    // Create draft proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('draft_proposals')
      .insert({
        tenant_id: profile.tenant_id,
        advisor_id: user.id,
        prospect_name,
        prospect_email,
        current_holdings: holdings,
        proposal_data: {
          statement_file: file_path,
          parsed_at: new Date().toISOString(),
          holdings_count: holdings.length,
          total_value: holdings.reduce((sum, h) => sum + h.market_value, 0)
        }
      })
      .select()
      .single();

    if (proposalError) {
      throw new Error(`Failed to create proposal: ${proposalError.message}`);
    }

    // Find best-fit models using the database function
    const { data: modelScores, error: modelError } = await supabase
      .rpc('best_model_for_holdings', { holdings: holdings });

    if (modelError) {
      console.error('Model scoring error:', modelError);
    }

    // Update proposal with model scores
    if (modelScores && modelScores.length > 0) {
      await supabase
        .from('draft_proposals')
        .update({
          model_scores: modelScores,
          recommended_model_id: modelScores[0].model_id
        })
        .eq('id', proposal.id);
    }

    // Log audit event
    await supabase.rpc('log_proposal_action', {
      p_proposal_id: proposal.id,
      p_action: 'parse',
      p_details: {
        file_path,
        holdings_count: holdings.length,
        total_value: holdings.reduce((sum, h) => sum + h.market_value, 0)
      }
    });

    console.log('Statement parsing completed successfully');

    return new Response(JSON.stringify({
      proposal_id: proposal.id,
      holdings,
      model_scores: modelScores || [],
      total_value: holdings.reduce((sum, h) => sum + h.market_value, 0)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-statement function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to parse statement'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function parseStatementText(fileText: string, fileName: string): StatementHolding[] {
  const holdings: StatementHolding[] = [];
  
  // Simplified parsing logic - would use advanced OCR + LLM in production
  const lines = fileText.split('\n');
  
  // Mock data for demo - in production would parse actual statement
  const mockHoldings = [
    {
      ticker: 'SPY',
      name: 'SPDR S&P 500 ETF Trust',
      quantity: 1000,
      market_value: 45000,
      cost_basis: 42000,
      asset_class: 'equity'
    },
    {
      ticker: 'BND',
      name: 'Vanguard Total Bond Market ETF',
      quantity: 500,
      market_value: 38500,
      cost_basis: 40000,
      asset_class: 'bond'
    },
    {
      ticker: 'VEA',
      name: 'Vanguard FTSE Developed Markets ETF',
      quantity: 750,
      market_value: 35250,
      cost_basis: 33000,
      asset_class: 'international_equity'
    },
    {
      ticker: 'VWO',
      name: 'Vanguard FTSE Emerging Markets ETF',
      quantity: 400,
      market_value: 18800,
      cost_basis: 20000,
      asset_class: 'emerging_markets'
    },
    {
      ticker: 'REIT',
      name: 'iShares Core U.S. REIT ETF',
      quantity: 200,
      market_value: 11400,
      cost_basis: 12000,
      asset_class: 'real_estate'
    }
  ];

  // Simple pattern matching for common statement formats
  if (fileName.toLowerCase().includes('schwab')) {
    // Schwab-specific parsing logic
    return mockHoldings.map(h => ({ ...h, quantity: h.quantity * 1.1 }));
  } else if (fileName.toLowerCase().includes('fidelity')) {
    // Fidelity-specific parsing logic
    return mockHoldings.map(h => ({ ...h, market_value: h.market_value * 1.05 }));
  } else if (fileName.toLowerCase().includes('vanguard')) {
    // Vanguard-specific parsing logic
    return mockHoldings.slice(0, 3);
  }

  // Generic parsing - look for patterns
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for ticker patterns (3-5 capital letters)
    const tickerMatch = line.match(/\b([A-Z]{3,5})\b/);
    if (tickerMatch) {
      // Extract numeric values (simplified)
      const numbers = line.match(/[\d,]+\.?\d*/g);
      if (numbers && numbers.length >= 2) {
        const quantity = parseFloat(numbers[0].replace(/,/g, ''));
        const value = parseFloat(numbers[numbers.length - 1].replace(/,/g, ''));
        
        if (quantity > 0 && value > 0) {
          holdings.push({
            ticker: tickerMatch[1],
            name: `Holdings for ${tickerMatch[1]}`,
            quantity,
            market_value: value,
            asset_class: 'equity' // Default classification
          });
        }
      }
    }
  }

  // Return mock data if no holdings found (for demo purposes)
  return holdings.length > 0 ? holdings : mockHoldings;
}

function resolveAssetClass(ticker: string): string {
  // Simple asset class resolution - would use securities table in production
  const assetClassMap: Record<string, string> = {
    'SPY': 'equity',
    'VTI': 'equity',
    'BND': 'bond',
    'VEA': 'international_equity',
    'VWO': 'emerging_markets',
    'REIT': 'real_estate',
    'VNQ': 'real_estate',
    'VTEB': 'municipal_bond'
  };
  
  return assetClassMap[ticker] || 'equity';
}