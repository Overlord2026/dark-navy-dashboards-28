import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject_user, scopes, conditions, valid_from, valid_to } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the issuer from the auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authorization required');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    // Validate scopes
    const requiredFields = ['jurisdiction', 'product', 'time', 'audience'];
    for (const field of requiredFields) {
      if (!scopes[field]) {
        throw new Error(`Missing required scope: ${field}`);
      }
    }

    // Check for conflicts with existing consents
    const { data: existingConsents } = await supabase
      .from('consent_tokens')
      .select('*')
      .eq('subject_user', subject_user)
      .eq('status', 'active')
      .overlaps('scopes->jurisdiction', [scopes.jurisdiction])
      .overlaps('scopes->product', [scopes.product]);

    if (existingConsents && existingConsents.length > 0) {
      // Check for exclusivity conflicts
      const hasConflict = existingConsents.some(consent => {
        const existing = consent.scopes as any;
        return existing.exclusivity && scopes.exclusivity && 
               existing.product === scopes.product;
      });

      if (hasConflict) {
        return new Response(
          JSON.stringify({
            error: 'CONFLICT_EXCLUSIVITY',
            message: 'Conflicting exclusive consent already exists',
            conflicts: existingConsents
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create consent token
    const { data: consent, error: insertError } = await supabase
      .from('consent_tokens')
      .insert({
        subject_user,
        issuer_user: user.id,
        scopes,
        conditions: conditions || {},
        valid_from: valid_from || new Date().toISOString(),
        valid_to
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Generate QR code data
    const qrData = {
      consent_id: consent.id,
      subject: subject_user,
      issuer: user.id,
      scopes: scopes,
      issued_at: consent.created_at
    };

    return new Response(
      JSON.stringify({
        consent_id: consent.id,
        qr_data: btoa(JSON.stringify(qrData)),
        token: consent,
        status: 'issued'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Issue consent error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});