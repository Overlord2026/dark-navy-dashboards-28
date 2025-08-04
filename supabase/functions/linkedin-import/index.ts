import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirectUri } = await req.json();
    
    if (!code) {
      throw new Error('Authorization code is required');
    }

    // LinkedIn OAuth credentials
    const clientId = '78c9g8au2ddoil';
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    const actualRedirectUri = redirectUri || 'https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/linkedin-import';
    
    if (!clientSecret) {
      throw new Error('LinkedIn client secret not configured');
    }

    console.log('Exchange code for token with redirect URI:', actualRedirectUri);

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: actualRedirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token response error:', errorText);
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('Token acquired successfully');

    // Fetch comprehensive profile data from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,profilePicture(displayImage~:playableStreams),positions(elements*(title,companyName,description,timePeriod)),educations(elements*(schoolName,degreeName,fieldOfStudy)))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('Profile response error:', errorText);
      throw new Error(`Profile fetch failed: ${profileResponse.statusText}`);
    }

    const profileData = await profileResponse.json();

    // Fetch email address
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    }

    console.log('LinkedIn profile imported successfully:', profileData.id);

    // Extract profile photo URL
    let profilePhotoUrl = '';
    if (profileData.profilePicture?.displayImage?.elements?.length > 0) {
      const photoElement = profileData.profilePicture.displayImage.elements[0];
      if (photoElement.identifiers?.length > 0) {
        profilePhotoUrl = photoElement.identifiers[0].identifier;
      }
    }

    // Structure the response with all needed fields
    const structuredProfile = {
      id: profileData.id,
      firstName: profileData.firstName?.localized?.en_US || '',
      lastName: profileData.lastName?.localized?.en_US || '',
      headline: profileData.headline?.localized?.en_US || '',
      summary: profileData.summary?.localized?.en_US || '',
      profilePhotoUrl: profilePhotoUrl,
      email: email,
      experience: profileData.positions?.elements?.map((pos: any) => ({
        title: pos.title?.localized?.en_US || '',
        company: pos.companyName?.localized?.en_US || '',
        description: pos.description?.localized?.en_US || '',
        startDate: pos.timePeriod?.startDate ? `${pos.timePeriod.startDate.month}/${pos.timePeriod.startDate.year}` : '',
        endDate: pos.timePeriod?.endDate ? `${pos.timePeriod.endDate.month}/${pos.timePeriod.endDate.year}` : 'Present'
      })) || [],
      education: profileData.educations?.elements?.map((edu: any) => ({
        school: edu.schoolName?.localized?.en_US || '',
        degree: edu.degreeName?.localized?.en_US || '',
        field: edu.fieldOfStudy?.localized?.en_US || ''
      })) || []
    };

    return new Response(
      JSON.stringify({
        success: true,
        profile: structuredProfile,
        rawProfile: profileData // Keep for backward compatibility
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('LinkedIn import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to import LinkedIn profile' 
      }),
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});