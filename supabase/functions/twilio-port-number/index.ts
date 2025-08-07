import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PortRequest {
  currentNumber: string;
  currentProvider: string;
  accountNumber: string;
  pin: string;
  authorizedName: string;
  billingAddress: string;
  advisorId: string;
}

serve(async (req) => {
  console.log('Number port request:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const portData: PortRequest = await req.json();

    // Validate required fields
    const requiredFields = ['currentNumber', 'currentProvider', 'accountNumber', 'pin', 'authorizedName', 'billingAddress', 'advisorId'];
    for (const field of requiredFields) {
      if (!portData[field as keyof PortRequest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Get advisor's tenant info
    const { data: advisor } = await supabase
      .from('advisor_profiles')
      .select('user_id')
      .eq('id', portData.advisorId)
      .single();

    if (!advisor) {
      throw new Error('Advisor not found');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', advisor.user_id)
      .single();

    if (!profile) {
      throw new Error('Advisor profile not found');
    }

    // Store port request in database
    const { data: portRecord, error: dbError } = await supabase
      .from('number_port_requests')
      .insert({
        advisor_id: portData.advisorId,
        tenant_id: profile.tenant_id,
        current_number: portData.currentNumber,
        current_provider: portData.currentProvider,
        account_number: portData.accountNumber,
        account_pin: portData.pin,
        authorized_name: portData.authorizedName,
        billing_address: portData.billingAddress,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save port request');
    }

    // In a real implementation, you would also:
    // 1. Create a port-in request with Twilio
    // 2. Upload required documentation
    // 3. Set up status callbacks

    console.log('Port request submitted:', portRecord.id);

    // Send confirmation email/SMS to advisor
    await supabase.functions.invoke('send-port-confirmation', {
      body: {
        advisorId: portData.advisorId,
        portRequestId: portRecord.id,
        phoneNumber: portData.currentNumber
      }
    });

    return new Response(JSON.stringify({
      success: true,
      portRequestId: portRecord.id,
      status: 'submitted',
      estimatedCompletion: '2-5 business days'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Port request error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});