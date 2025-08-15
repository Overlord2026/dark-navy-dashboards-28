import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface IssuePBATRequest {
  policy_id: string;
  subject_id: string;
  scope: string[];
  token_type?: 'access' | 'delegation' | 'emergency';
  expires_in_hours?: number;
  constraints?: Record<string, any>;
  max_usage_count?: number;
}

interface ValidatePBATRequest {
  token: string;
  required_scope?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.pathname.split('/').pop();

  try {
    if (action === 'issue' && req.method === 'POST') {
      const body: IssuePBATRequest = await req.json();
      
      // Generate secure random token
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const tokenValue = btoa(String.fromCharCode(...tokenBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      // Create token hash for storage
      const encoder = new TextEncoder();
      const tokenData = encoder.encode(tokenValue);
      const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (body.expires_in_hours || 24));

      // Insert PBAT token
      const { data: pbatToken, error: tokenError } = await supabase
        .from("pbat_tokens")
        .insert({
          token_hash: tokenHash,
          policy_id: body.policy_id,
          subject_id: body.subject_id,
          token_type: body.token_type || 'access',
          scope: body.scope,
          constraints: body.constraints || {},
          expires_at: expiresAt.toISOString(),
          max_usage_count: body.max_usage_count
        })
        .select()
        .single();

      if (tokenError) {
        console.error('Error creating PBAT token:', tokenError);
        throw tokenError;
      }

      // Emit domain event
      await supabase.functions.invoke('emit-receipt', {
        body: {
          event_type: 'pbat_token_issued',
          aggregate_id: pbatToken.id,
          aggregate_type: 'pbat_token',
          event_data: {
            token_id: pbatToken.id,
            policy_id: body.policy_id,
            subject_id: body.subject_id,
            token_type: body.token_type || 'access',
            scope: body.scope,
            expires_at: expiresAt.toISOString()
          }
        }
      });

      return new Response(
        JSON.stringify({
          ok: true,
          token: tokenValue,
          token_id: pbatToken.id,
          expires_at: expiresAt.toISOString(),
          scope: body.scope,
          token_type: body.token_type || 'access'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'validate' && req.method === 'POST') {
      const body: ValidatePBATRequest = await req.json();
      
      // Create token hash
      const encoder = new TextEncoder();
      const tokenData = encoder.encode(body.token);
      const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Find and validate token
      const { data: tokenRecord, error: findError } = await supabase
        .from("pbat_tokens")
        .select("*")
        .eq("token_hash", tokenHash)
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString())
        .single();

      if (findError || !tokenRecord) {
        return new Response(
          JSON.stringify({
            valid: false,
            reason: 'token_not_found_or_expired'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check scope if required
      if (body.required_scope) {
        const scope = Array.isArray(tokenRecord.scope) ? tokenRecord.scope : [];
        if (!scope.includes(body.required_scope)) {
          return new Response(
            JSON.stringify({
              valid: false,
              reason: 'insufficient_scope',
              required_scope: body.required_scope,
              available_scope: scope
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      // Check usage limits
      if (tokenRecord.max_usage_count && tokenRecord.usage_count >= tokenRecord.max_usage_count) {
        return new Response(
          JSON.stringify({
            valid: false,
            reason: 'usage_limit_exceeded'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update usage tracking
      const { error: updateError } = await supabase
        .from("pbat_tokens")
        .update({
          last_used_at: new Date().toISOString(),
          usage_count: (tokenRecord.usage_count || 0) + 1
        })
        .eq("id", tokenRecord.id);

      if (updateError) {
        console.error('Error updating token usage:', updateError);
      }

      // Emit usage event
      await supabase.functions.invoke('emit-receipt', {
        body: {
          event_type: 'pbat_token_used',
          aggregate_id: tokenRecord.id,
          aggregate_type: 'pbat_token',
          event_data: {
            token_id: tokenRecord.id,
            subject_id: tokenRecord.subject_id,
            policy_id: tokenRecord.policy_id,
            required_scope: body.required_scope,
            usage_count: (tokenRecord.usage_count || 0) + 1
          }
        }
      });

      return new Response(
        JSON.stringify({
          valid: true,
          subject_id: tokenRecord.subject_id,
          scope: tokenRecord.scope,
          token_type: tokenRecord.token_type,
          policy_id: tokenRecord.policy_id,
          usage_count: (tokenRecord.usage_count || 0) + 1,
          max_usage_count: tokenRecord.max_usage_count,
          expires_at: tokenRecord.expires_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action or method' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (e) {
    console.error('PBAT error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});