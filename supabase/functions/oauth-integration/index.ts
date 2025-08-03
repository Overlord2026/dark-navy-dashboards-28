import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OAuthRequest {
  provider: 'zoom' | 'google' | 'facebook';
  action: 'initiate' | 'callback';
  code?: string;
  state?: string;
  return_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Handle OAuth callback
    if (searchParams.get('code')) {
      return await handleOAuthCallback(req);
    }

    // Handle initiate OAuth
    const { provider, return_url }: OAuthRequest = await req.json();
    return await initiateOAuth(provider, return_url);

  } catch (error: any) {
    console.error("Error in oauth-integration:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const initiateOAuth = async (provider: string, returnUrl?: string) => {
  try {
    let authUrl = '';
    let scope = '';
    let clientId = '';
    let redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-integration`;

    switch (provider) {
      case 'zoom':
        clientId = Deno.env.get('ZOOM_CLIENT_ID') || '';
        scope = 'meeting:write meeting:read user:read';
        authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${provider}`;
        break;

      case 'google':
        clientId = Deno.env.get('GOOGLE_CLIENT_ID') || '';
        scope = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/meetings';
        authUrl = `https://accounts.google.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${provider}&access_type=offline&prompt=consent`;
        break;

      case 'facebook':
        clientId = Deno.env.get('FACEBOOK_APP_ID') || '';
        scope = 'ads_management ads_read business_management';
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${provider}&response_type=code`;
        break;

      default:
        throw new Error('Unsupported provider');
    }

    return new Response(JSON.stringify({ 
      auth_url: authUrl,
      provider: provider
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error initiating OAuth:', error);
    throw error;
  }
};

const handleOAuthCallback = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // provider
    const error = url.searchParams.get('error');

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code || !state) {
      throw new Error('Missing code or state parameter');
    }

    let tokenData: any;
    switch (state) {
      case 'zoom':
        tokenData = await exchangeZoomCode(code);
        break;
      case 'google':
        tokenData = await exchangeGoogleCode(code);
        break;
      case 'facebook':
        tokenData = await exchangeFacebookCode(code);
        break;
      default:
        throw new Error('Unknown provider');
    }

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Store integration data
    const { error: insertError } = await supabase
      .from('user_integrations')
      .upsert([{
        user_id: userId,
        provider: state,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        account_info: tokenData.account_info || {},
        is_active: true
      }], {
        onConflict: 'user_id,provider'
      });

    if (insertError) {
      throw insertError;
    }

    // Return success page that closes popup
    const successHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #4CAF50; }
          </style>
        </head>
        <body>
          <h1 class="success">✓ Authorization Successful</h1>
          <p>You can now close this window.</p>
          <script>
            // Close popup window
            if (window.opener) {
              window.opener.postMessage({ type: 'oauth-success', provider: '${state}' }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    return new Response(successHtml, {
      headers: { ...corsHeaders, "Content-Type": "text/html" },
    });

  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #f44336; }
          </style>
        </head>
        <body>
          <h1 class="error">✗ Authorization Failed</h1>
          <p>${error.message}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'oauth-error', error: '${error.message}' }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    return new Response(errorHtml, {
      headers: { ...corsHeaders, "Content-Type": "text/html" },
    });
  }
};

const exchangeZoomCode = async (code: string) => {
  const clientId = Deno.env.get('ZOOM_CLIENT_ID');
  const clientSecret = Deno.env.get('ZOOM_CLIENT_SECRET');
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-integration`;

  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    throw new Error(`Zoom token exchange failed: ${response.statusText}`);
  }

  const tokenData = await response.json();

  // Get user info
  const userResponse = await fetch('https://api.zoom.us/v2/users/me', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  });

  const userInfo = userResponse.ok ? await userResponse.json() : {};

  return {
    ...tokenData,
    account_info: userInfo
  };
};

const exchangeGoogleCode = async (code: string) => {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-integration`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!
    })
  });

  if (!response.ok) {
    throw new Error(`Google token exchange failed: ${response.statusText}`);
  }

  const tokenData = await response.json();

  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  });

  const userInfo = userResponse.ok ? await userResponse.json() : {};

  return {
    ...tokenData,
    account_info: userInfo
  };
};

const exchangeFacebookCode = async (code: string) => {
  const clientId = Deno.env.get('FACEBOOK_APP_ID');
  const clientSecret = Deno.env.get('FACEBOOK_APP_SECRET');
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-integration`;

  const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!
    })
  });

  if (!response.ok) {
    throw new Error(`Facebook token exchange failed: ${response.statusText}`);
  }

  const tokenData = await response.json();

  // Get user info and ad accounts
  const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`);
  const adAccountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${tokenData.access_token}`);

  const userInfo = userResponse.ok ? await userResponse.json() : {};
  const adAccounts = adAccountsResponse.ok ? await adAccountsResponse.json() : {};

  return {
    ...tokenData,
    account_info: {
      ...userInfo,
      ad_accounts: adAccounts.data || []
    }
  };
};

serve(handler);