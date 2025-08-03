import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AttributionRequest {
  lead_id: string;
  click_id?: string;
  platform: 'facebook' | 'google';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  conversion_type?: string;
  conversion_value?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      lead_id,
      click_id,
      platform,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      conversion_type = 'lead_form_submit',
      conversion_value
    }: AttributionRequest = await req.json();

    if (!lead_id || !platform) {
      throw new Error('Missing required fields: lead_id and platform');
    }

    // Get lead details
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      throw new Error('Lead not found');
    }

    let attributionData: any = {
      lead_id: lead_id,
      platform: platform,
      conversion_type: conversion_type,
      attribution_window: 7, // 7-day attribution window
      created_at: new Date().toISOString()
    };

    // Track attribution based on platform
    if (platform === 'facebook' && click_id) {
      attributionData = await trackFacebookAttribution(lead, click_id, attributionData);
    } else if (platform === 'google' && click_id) {
      attributionData = await trackGoogleAttribution(lead, click_id, attributionData);
    } else {
      // UTM-based attribution
      attributionData = await trackUtmAttribution(lead, {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term
      }, attributionData);
    }

    // Store attribution data
    const { data: attribution, error: attributionError } = await supabase
      .from('lead_attributions')
      .insert([attributionData])
      .select()
      .single();

    if (attributionError) {
      throw attributionError;
    }

    // Send conversion event back to ad platform
    if (click_id) {
      await sendConversionEvent(platform, click_id, {
        lead_id: lead_id,
        conversion_type: conversion_type,
        conversion_value: conversion_value || lead.lead_value || 0,
        email: lead.email
      });
    }

    // Update lead with attribution data
    await supabase
      .from('leads')
      .update({
        attribution_source: utm_source || platform,
        attribution_medium: utm_medium || 'paid_ads',
        attribution_campaign: attributionData.campaign_name || utm_campaign,
        attribution_cost: attributionData.cost_attribution || 0
      })
      .eq('id', lead_id);

    return new Response(JSON.stringify({ 
      message: 'Lead attribution tracked successfully',
      attribution_id: attribution.id,
      attribution_data: attributionData
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in track-lead-attribution:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const trackFacebookAttribution = async (lead: any, clickId: string, baseData: any) => {
  try {
    // Get Facebook ad account
    const { data: account } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('platform', 'facebook')
      .eq('advisor_id', lead.advisor_id)
      .eq('is_active', true)
      .single();

    if (!account) {
      throw new Error('Facebook ad account not found');
    }

    // Query Facebook API for click details
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${clickId}?fields=ad_id,adset_id,campaign_id&access_token=${account.access_token}`
    );

    if (!response.ok) {
      console.error('Facebook API error:', response.statusText);
      return {
        ...baseData,
        click_id: clickId,
        cost_attribution: 0
      };
    }

    const clickData = await response.json();

    // Get campaign details
    const campaignResponse = await fetch(
      `https://graph.facebook.com/v18.0/${clickData.campaign_id}?fields=name&access_token=${account.access_token}`
    );

    let campaignName = 'Unknown Campaign';
    if (campaignResponse.ok) {
      const campaignData = await campaignResponse.json();
      campaignName = campaignData.name;
    }

    // Get cost data (simplified - would need more complex logic for accurate attribution)
    const costPerClick = 2.50; // Would calculate from actual campaign data
    
    return {
      ...baseData,
      campaign_id: clickData.campaign_id,
      campaign_name: campaignName,
      ad_set_id: clickData.adset_id,
      ad_id: clickData.ad_id,
      click_id: clickId,
      cost_attribution: costPerClick
    };

  } catch (error) {
    console.error('Error tracking Facebook attribution:', error);
    return {
      ...baseData,
      click_id: clickId,
      cost_attribution: 0
    };
  }
};

const trackGoogleAttribution = async (lead: any, gclid: string, baseData: any) => {
  try {
    // Get Google Ads account
    const { data: account } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('platform', 'google')
      .eq('advisor_id', lead.advisor_id)
      .eq('is_active', true)
      .single();

    if (!account) {
      throw new Error('Google Ads account not found');
    }

    // Note: Google Click ID attribution requires Google Ads API and more complex setup
    // This is a simplified version for demo purposes
    
    const costPerClick = 3.75; // Would calculate from actual campaign data
    
    return {
      ...baseData,
      click_id: gclid,
      cost_attribution: costPerClick,
      campaign_name: 'Google Ads Campaign' // Would get from API
    };

  } catch (error) {
    console.error('Error tracking Google attribution:', error);
    return {
      ...baseData,
      click_id: gclid,
      cost_attribution: 0
    };
  }
};

const trackUtmAttribution = async (lead: any, utmData: any, baseData: any) => {
  try {
    // Find matching campaign based on UTM parameters
    const { data: campaigns } = await supabase
      .from('ad_campaign_data')
      .select('*')
      .ilike('campaign_name', `%${utmData.utm_campaign || ''}%`)
      .limit(1);

    const campaign = campaigns?.[0];
    const costAttribution = campaign?.cost_per_lead || 0;

    return {
      ...baseData,
      campaign_id: campaign?.campaign_id,
      campaign_name: utmData.utm_campaign || 'Unknown Campaign',
      cost_attribution: costAttribution,
      utm_data: utmData
    };

  } catch (error) {
    console.error('Error tracking UTM attribution:', error);
    return {
      ...baseData,
      campaign_name: utmData.utm_campaign || 'Unknown Campaign',
      cost_attribution: 0,
      utm_data: utmData
    };
  }
};

const sendConversionEvent = async (platform: string, clickId: string, conversionData: any) => {
  try {
    if (platform === 'facebook') {
      await sendFacebookConversion(clickId, conversionData);
    } else if (platform === 'google') {
      await sendGoogleConversion(clickId, conversionData);
    }
  } catch (error) {
    console.error('Error sending conversion event:', error);
  }
};

const sendFacebookConversion = async (clickId: string, conversionData: any) => {
  try {
    const pixelId = Deno.env.get('FACEBOOK_PIXEL_ID');
    const accessToken = Deno.env.get('FACEBOOK_CONVERSION_TOKEN');

    if (!pixelId || !accessToken) {
      console.error('Missing Facebook Pixel ID or Conversion Token');
      return;
    }

    const eventData = {
      data: [{
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: conversionData.lead_id,
        user_data: {
          em: [conversionData.email] // Facebook expects hashed emails in production
        },
        custom_data: {
          value: conversionData.conversion_value,
          currency: 'USD',
          content_name: conversionData.conversion_type
        },
        event_source_url: 'https://yoursite.com',
        opt_out: false
      }],
      test_event_code: Deno.env.get('FACEBOOK_TEST_EVENT_CODE') // Remove in production
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      console.error('Facebook conversion API error:', await response.text());
    } else {
      console.log('Facebook conversion event sent successfully');
    }

  } catch (error) {
    console.error('Error sending Facebook conversion:', error);
  }
};

const sendGoogleConversion = async (gclid: string, conversionData: any) => {
  try {
    // Google Ads Conversion Tracking would require Google Ads API setup
    // This is a placeholder for the implementation
    console.log('Google conversion tracking not implemented yet');
    
    // Would implement Google Ads Conversion API call here
    // Reference: https://developers.google.com/google-ads/api/docs/conversions/overview

  } catch (error) {
    console.error('Error sending Google conversion:', error);
  }
};

serve(handler);