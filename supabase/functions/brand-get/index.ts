import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrandingResponse {
  name: string;
  logo_url: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  legal_footer: string | null;
  powered_by_bfo: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get host from request headers
    const host = req.headers.get('host') || '';
    console.log('Host header:', host);

    // Extract subdomain (first part before first dot)
    const subdomain = host.split('.')[0];
    console.log('Extracted subdomain:', subdomain);

    // Default BFO branding
    const defaultBranding: BrandingResponse = {
      name: 'Boutique Family Office',
      logo_url: null,
      colors: {
        primary: '#0b1a33',
        secondary: '#d4af37', 
        accent: '#0ea5a5'
      },
      legal_footer: null,
      powered_by_bfo: true
    };

    // If no subdomain or it's a default domain, return BFO branding
    if (!subdomain || subdomain === 'localhost' || subdomain === 'bfo' || host.includes('lovable.app')) {
      console.log('Using default BFO branding');
      return new Response(JSON.stringify(defaultBranding), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Try to find tenant by subdomain slug
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', subdomain)
      .single();

    if (error || !tenant) {
      console.log('Tenant not found, using default branding:', error?.message);
      return new Response(JSON.stringify(defaultBranding), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Return tenant branding
    const response: BrandingResponse = {
      name: tenant.name,
      logo_url: tenant.logo_url,
      colors: {
        primary: tenant.brand_primary || '#0b1a33',
        secondary: tenant.brand_secondary || '#d4af37',
        accent: tenant.brand_accent || '#0ea5a5'
      },
      legal_footer: tenant.legal_footer,
      powered_by_bfo: tenant.powered_by_bfo
    };

    console.log('Returning tenant branding:', response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in brand-get function:', error);
    
    // Return default branding on error
    const defaultBranding: BrandingResponse = {
      name: 'Boutique Family Office',
      logo_url: null,
      colors: {
        primary: '#0b1a33',
        secondary: '#d4af37',
        accent: '#0ea5a5'
      },
      legal_footer: null,
      powered_by_bfo: true
    };

    return new Response(JSON.stringify(defaultBranding), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);