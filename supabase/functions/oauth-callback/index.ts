import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Contains user JWT token

    if (!provider || !code || !state) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${state}` },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response('Authentication required', { status: 401 });
    }

    let tokenResponse;
    
    switch (provider) {
      case 'zoom':
        tokenResponse = await exchangeZoomCode(code);
        break;
      case 'google_meet':
        tokenResponse = await exchangeGoogleCode(code);
        break;
      case 'teams':
        tokenResponse = await exchangeTeamsCode(code);
        break;
      default:
        return new Response('Unsupported provider', { status: 400 });
    }

    if (!tokenResponse.success) {
      console.error(`${provider} token exchange failed:`, tokenResponse.error);
      return new Response(`Failed to exchange ${provider} code`, { status: 500 });
    }

    // Store the integration
    const { error: insertError } = await supabaseClient
      .from('video_meeting_integrations')
      .upsert({
        user_id: user.id,
        provider,
        access_token: tokenResponse.data.access_token,
        refresh_token: tokenResponse.data.refresh_token,
        expires_at: tokenResponse.data.expires_at,
        is_active: true
      }, {
        onConflict: 'user_id,provider'
      });

    if (insertError) {
      console.error('Error storing integration:', insertError);
      return new Response('Failed to store integration', { status: 500 });
    }

    // Return success page that closes the popup
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body { font-family: system-ui; text-align: center; padding: 2rem; }
            .success { color: #059669; }
          </style>
        </head>
        <body>
          <h1 class="success">✓ ${provider.replace('_', ' ')} Connected Successfully!</h1>
          <p>You can close this window now.</p>
          <script>
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});

async function exchangeZoomCode(code: string) {
  try {
    const clientId = Deno.env.get('ZOOM_CLIENT_ID');
    const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      return { success: false, error: 'Zoom credentials not configured' };
    }

    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback?provider=zoom`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data };
    }

    return {
      success: true,
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString()
      }
    };
  } catch (error) {
    return { success: false, error };
  }
}

async function exchangeGoogleCode(code: string) {
  try {
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      return { success: false, error: 'Google credentials not configured' };
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback?provider=google_meet`,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data };
    }

    return {
      success: true,
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString()
      }
    };
  } catch (error) {
    return { success: false, error };
  }
}

async function exchangeTeamsCode(code: string) {
  try {
    const clientId = Deno.env.get('TEAMS_CLIENT_ID');
    const clientSecret = Deno.env.get('TEAMS_CLIENT_SECRET');
    const tenantId = Deno.env.get('TEAMS_TENANT_ID');
    
    if (!clientId || !clientSecret || !tenantId) {
      return { success: false, error: 'Teams credentials not configured' };
    }

    const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-callback?provider=teams`,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/OnlineMeetings.ReadWrite'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data };
    }

    return {
      success: true,
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString()
      }
    };
  } catch (error) {
    return { success: false, error };
  }
}