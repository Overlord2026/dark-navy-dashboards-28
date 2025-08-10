import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface AssetRequest {
  asset_type: 'pdf' | 'png' | 'pptx' | 'qr' | 'email_header';
  template: string;
  format: 'print' | 'digital' | 'preview' | 'email';
  segment?: 'sports' | 'longevity' | 'ria';
  personalization?: Record<string, string>;
  utm_params?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
}

const segmentData = {
  sports: {
    color: '#046B4D',
    name: 'Sports',
    targets: {
      gold: ["NFL", "NBA", "FIFA", "UFC", "MLB"],
      silver: ["Formula 1", "NASCAR", "PGA Tour", "LPGA", "NHL"],
      bronze: ["MLS", "USOC", "IOC", "ONE Championship", "World Rugby"]
    },
    description: "Partner with sports leagues for athlete financial wellness and NIL education"
  },
  longevity: {
    color: '#0A152E',
    name: 'Longevity',
    targets: {
      gold: ["Tony Robbins", "Peter Diamandis", "David Sinclair", "Andrew Huberman", "Dr. Mark Hyman"],
      silver: ["Ben Greenfield", "Dr. Rhonda Patrick", "Peter Attia", "Fountain Life", "Human Longevity"],
      bronze: ["Thorne", "Levels", "Lifespan.io", "Bryan Johnson", "Precision Health Alliance"]
    },
    description: "Integrate healthspan research with wealth management for longevity optimization"
  },
  ria: {
    color: '#A6192E',
    name: 'RIA',
    targets: {
      gold: ["Crescent Wealth", "Mission Wealth", "Mercer Advisors", "Creative Planning", "Edelman Financial Engines"],
      silver: ["Carson Group", "Fisher Investments", "Mariner Wealth", "Buckingham", "Wealth Enhancement Group"],
      bronze: ["Savant Wealth", "Plancorp", "Brighton Jones", "Rebalance", "Facet"]
    },
    description: "Enhance RIA practices with integrated healthspan + wealthspan solutions"
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assetRequest: AssetRequest = await req.json();
    
    console.log('Processing asset generation request:', assetRequest);

    let generatedAsset;

    switch (assetRequest.asset_type) {
      case 'pdf':
        generatedAsset = await generatePDF(assetRequest);
        break;
      case 'png':
        generatedAsset = await generatePNG(assetRequest);
        break;
      case 'pptx':
        generatedAsset = await generatePPTX(assetRequest);
        break;
      case 'qr':
        generatedAsset = await generateQRCode(assetRequest);
        break;
      case 'email_header':
        generatedAsset = await generateEmailHeader(assetRequest);
        break;
      default:
        throw new Error(`Unsupported asset type: ${assetRequest.asset_type}`);
    }

    // Log the generation event
    await supabase.from('f20_analytics').insert({
      event_type: 'asset_generated',
      segment: assetRequest.segment,
      target_name: 'system',
      utm_source: assetRequest.utm_params?.utm_source,
      utm_medium: assetRequest.utm_params?.utm_medium,
      utm_campaign: assetRequest.utm_params?.utm_campaign,
      utm_content: assetRequest.utm_params?.utm_content,
      event_data: {
        asset_type: assetRequest.asset_type,
        template: assetRequest.template,
        format: assetRequest.format
      }
    });

    console.log('Asset generated successfully:', generatedAsset);

    return new Response(JSON.stringify({
      success: true,
      asset_url: generatedAsset.url,
      asset_id: generatedAsset.id,
      metadata: generatedAsset.metadata
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in founding20-asset-generator:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to generate asset'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

async function generatePDF(request: AssetRequest) {
  console.log(`Generating PDF: ${request.template} (${request.format})`);
  
  // In a real implementation, this would use a PDF generation library
  // For now, we'll return mock data
  
  const filename = `${request.template}_${request.format}.pdf`;
  
  return {
    id: crypto.randomUUID(),
    url: `/assets/founding20/${filename}`,
    metadata: {
      filename,
      size: '2.4MB',
      pages: request.template === 'leadership_deck' ? 15 : 
              request.template === 'overview' ? 1 : 
              request.template === 'checklist' ? 3 : 2,
      optimized_for: request.format
    }
  };
}

async function generatePNG(request: AssetRequest) {
  console.log(`Generating PNG: ${request.template} (${request.format})`);
  
  const filename = `${request.template}_${request.format}.png`;
  
  return {
    id: crypto.randomUUID(),
    url: `/assets/founding20/${filename}`,
    metadata: {
      filename,
      size: '1.2MB',
      dimensions: request.format === 'preview' ? '1200x630' : '1920x1080',
      dpi: 300
    }
  };
}

async function generatePPTX(request: AssetRequest) {
  console.log(`Generating PPTX: ${request.template}`);
  
  const filename = `${request.template}.pptx`;
  
  return {
    id: crypto.randomUUID(),
    url: `/assets/founding20/${filename}`,
    metadata: {
      filename,
      size: '5.8MB',
      slides: 15,
      editable: true
    }
  };
}

async function generateQRCode(request: AssetRequest) {
  console.log(`Generating QR code for segment: ${request.segment}`);
  
  if (!request.segment) {
    throw new Error('Segment required for QR code generation');
  }

  const baseUrl = `https://my.bfocfo.com/founding20/${request.segment}`;
  const utmParams = new URLSearchParams(request.utm_params || {}).toString();
  const finalUrl = utmParams ? `${baseUrl}?${utmParams}` : baseUrl;
  
  const filename = `qr_${request.segment}_${request.utm_params?.utm_source || 'default'}.png`;
  
  return {
    id: crypto.randomUUID(),
    url: `/assets/founding20/qr/${filename}`,
    metadata: {
      filename,
      target_url: finalUrl,
      size: '256x256',
      format: 'PNG',
      error_correction: 'M'
    }
  };
}

async function generateEmailHeader(request: AssetRequest) {
  console.log(`Generating email header: ${request.format} variant`);
  
  const filename = `email_header_${request.format}.png`;
  
  return {
    id: crypto.randomUUID(),
    url: `/assets/founding20/email/${filename}`,
    metadata: {
      filename,
      variant: request.format,
      dimensions: '600x200',
      optimized_for: 'email'
    }
  };
}

serve(handler);