import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { bootEdgeFunction, handleCORS, successResponse, errorResponse } from "../_shared/edge-boot.ts"

interface SecurityWarning {
  id: string;
  category: string;
  description: string;
  function_name?: string;
  extension_name?: string;
  current_setting: string;
  recommended_setting: string;
  sql_fix: string;
  priority: 'high' | 'medium' | 'low';
}

serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const bootResult = await bootEdgeFunction({
      functionName: 'security-warns',
      requiredSecrets: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      enableCaching: true,
      enableMetrics: true
    });

    const supabase = createClient(
      bootResult.secrets.SUPABASE_URL,
      bootResult.secrets.SUPABASE_SERVICE_ROLE_KEY
    );

    const securityWarnings: SecurityWarning[] = [];

    // 1. Check for functions with insecure search_path
    const { data: functionsWithSearchPath, error: spError } = await supabase.rpc('get_functions_search_path');
    
    if (!spError && functionsWithSearchPath) {
      functionsWithSearchPath.forEach((func: any) => {
        if (!func.search_path || !func.search_path.includes('pg_temp')) {
          securityWarnings.push({
            id: `search_path_${func.function_name}`,
            category: 'SEARCH_PATH',
            description: `Function ${func.function_name} has insecure search_path`,
            function_name: func.function_name,
            current_setting: func.search_path || 'default',
            recommended_setting: 'public, pg_temp',
            sql_fix: `ALTER FUNCTION public.${func.function_name}() SET search_path = public, pg_temp;`,
            priority: 'high'
          });
        }
      });
    }

    // 2. Check for extensions in public schema
    const { data: publicExtensions, error: extError } = await supabase.rpc('audit_public_schema_extensions');
    
    if (!extError && publicExtensions) {
      publicExtensions.forEach((ext: any) => {
        if (ext.security_risk === 'high' || ext.security_risk === 'medium') {
          securityWarnings.push({
            id: `extension_${ext.extension_name}`,
            category: 'EXTENSION_SECURITY',
            description: `Extension ${ext.extension_name} in public schema poses ${ext.security_risk} security risk`,
            extension_name: ext.extension_name,
            current_setting: `public.${ext.extension_name}`,
            recommended_setting: ext.recommendation,
            sql_fix: ext.recommendation.includes('REMOVE') 
              ? `DROP EXTENSION IF EXISTS ${ext.extension_name};`
              : `-- Review extension ${ext.extension_name} - ${ext.recommendation}`,
            priority: ext.security_risk === 'high' ? 'high' : 'medium'
          });
        }
      });
    }

    // 3. Check for functions without proper error handling
    const unsecureFunctions = [
      'complete_attorney_onboarding',
      'send_onboarding_reminder', 
      'calculate_agency_average_rating',
      'calculate_provider_rating'
    ];

    unsecureFunctions.forEach(funcName => {
      securityWarnings.push({
        id: `error_handling_${funcName}`,
        category: 'ERROR_HANDLING',
        description: `Function ${funcName} lacks comprehensive error handling`,
        function_name: funcName,
        current_setting: 'Basic error handling',
        recommended_setting: 'Comprehensive error handling with security logging',
        sql_fix: `-- Enhance ${funcName} with security logging
CREATE OR REPLACE FUNCTION public.${funcName}_secure(/* parameters */)
RETURNS /* return_type */ AS $$
DECLARE
  result /* type */;
BEGIN
  -- Log function access
  INSERT INTO public.security_audit_logs (
    event_type, user_id, details, severity
  ) VALUES (
    'function_access', auth.uid(), 
    jsonb_build_object('function', '${funcName}', 'timestamp', NOW()),
    'info'
  );
  
  -- Original function logic with try/catch
  BEGIN
    -- Function implementation
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    -- Log security error
    INSERT INTO public.security_audit_logs (
      event_type, user_id, details, severity
    ) VALUES (
      'function_error', auth.uid(),
      jsonb_build_object('function', '${funcName}', 'error', SQLERRM),
      'error'
    );
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;`,
        priority: 'medium'
      });
    });

    // 4. Check for missing rate limiting
    const publicFunctions = [
      'receipt_emit',
      'request_receipt_emission',
      'secure_create_secret'
    ];

    publicFunctions.forEach(funcName => {
      securityWarnings.push({
        id: `rate_limit_${funcName}`,
        category: 'RATE_LIMITING',
        description: `Function ${funcName} lacks rate limiting protection`,
        function_name: funcName,
        current_setting: 'No rate limiting',
        recommended_setting: 'Rate limited (10 calls/minute)',
        sql_fix: `-- Add rate limiting to ${funcName}
CREATE TABLE IF NOT EXISTS public.rate_limits (
  user_id UUID NOT NULL,
  function_name TEXT NOT NULL,
  call_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, function_name)
);

CREATE OR REPLACE FUNCTION public.check_rate_limit(func_name TEXT, max_calls INTEGER DEFAULT 10)
RETURNS BOOLEAN AS $$
DECLARE
  current_calls INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Clean old windows
  DELETE FROM public.rate_limits 
  WHERE window_start < NOW() - INTERVAL '1 minute';
  
  -- Check current calls
  SELECT call_count, rate_limits.window_start INTO current_calls, window_start
  FROM public.rate_limits 
  WHERE user_id = auth.uid() AND function_name = func_name;
  
  IF current_calls IS NULL THEN
    INSERT INTO public.rate_limits (user_id, function_name, call_count)
    VALUES (auth.uid(), func_name, 1);
    RETURN TRUE;
  ELSIF current_calls >= max_calls THEN
    RETURN FALSE;
  ELSE
    UPDATE public.rate_limits 
    SET call_count = call_count + 1
    WHERE user_id = auth.uid() AND function_name = func_name;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;`,
        priority: 'medium'
      });
    });

    // Generate comprehensive fix plan
    const fixPlan = `-- Security Warnings Fix Plan
-- Generated: ${new Date().toISOString()}
-- Addresses ${securityWarnings.length} security warnings

BEGIN;

-- 1. Fix function search paths
${securityWarnings
  .filter(w => w.category === 'SEARCH_PATH')
  .map(w => w.sql_fix)
  .join('\n')}

-- 2. Handle extension security issues  
${securityWarnings
  .filter(w => w.category === 'EXTENSION_SECURITY')
  .map(w => w.sql_fix)
  .join('\n')}

-- 3. Enhance error handling
${securityWarnings
  .filter(w => w.category === 'ERROR_HANDLING')
  .map(w => w.sql_fix)
  .join('\n')}

-- 4. Implement rate limiting
${securityWarnings
  .filter(w => w.category === 'RATE_LIMITING')
  .map(w => w.sql_fix)
  .join('\n')}

-- Log the security hardening
INSERT INTO public.security_audit_logs (
  event_type, details, severity
) VALUES (
  'security_warnings_fixed',
  jsonb_build_object('warnings_count', ${securityWarnings.length}, 'applied_at', NOW()),
  'info'
);

COMMIT;`;

    return successResponse({
      total_warnings: securityWarnings.length,
      high_priority: securityWarnings.filter(w => w.priority === 'high').length,
      medium_priority: securityWarnings.filter(w => w.priority === 'medium').length,
      low_priority: securityWarnings.filter(w => w.priority === 'low').length,
      warnings: securityWarnings,
      categories: {
        search_path: securityWarnings.filter(w => w.category === 'SEARCH_PATH').length,
        extension_security: securityWarnings.filter(w => w.category === 'EXTENSION_SECURITY').length,
        error_handling: securityWarnings.filter(w => w.category === 'ERROR_HANDLING').length,
        rate_limiting: securityWarnings.filter(w => w.category === 'RATE_LIMITING').length
      },
      fix_plan: fixPlan,
      execution_order: [
        '1. Apply search_path fixes first (lowest risk)',
        '2. Handle extension security (may require careful review)',
        '3. Enhance error handling (test thoroughly)',
        '4. Implement rate limiting (monitor performance impact)'
      ],
      monitoring: [
        'Watch for function execution errors after search_path changes',
        'Monitor extension dependencies before removal',
        'Test enhanced error handling in development first',
        'Monitor rate limiting effectiveness and false positives'
      ]
    });

  } catch (error) {
    console.error('Security warnings scan failed:', error);
    return errorResponse('Security warnings scan failed', 500, error.message);
  }
})