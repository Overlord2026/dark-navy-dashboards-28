import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { bootEdgeFunction, handleCORS, successResponse, errorResponse } from "../_shared/edge-boot.ts"

interface FeatureFlagConfig {
  [key: string]: boolean | string | number;
}

interface EnvironmentConfig {
  environment: string;
  flags: FeatureFlagConfig;
  metadata: {
    updated_at: string;
    version: string;
    deployment_id?: string;
  };
}

serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const bootResult = await bootEdgeFunction({
      functionName: 'feature-flags',
      requiredSecrets: ['SUPABASE_URL'],
      enableCaching: true,
      enableMetrics: true
    });

    const { searchParams } = new URL(req.url);
    const environment = searchParams.get('env') || 'development';
    const action = searchParams.get('action') || 'get';

    // Define per-environment flag configurations
    const flagConfigs: Record<string, FeatureFlagConfig> = {
      development: {
        'nav.persona': true,
        'dashboard.familyHero': true,
        'calc.monte': true,
        'calc.rmd': true,
        'calc.socialSecurity': true,
        'guides.retirement': true,
        'guides.taxPlanning': true,
        'guides.estatePlanning': true,
        'pros.medicareRecordingBanner': false,
        'pros.complianceMode': false,
        'features.plaidIntegration': true,
        'features.docusignIntegration': false,
        'features.advancedReporting': true,
        'ui.experimentalDesign': true,
        'security.rlsPolicies': false,
        'security.auditLogging': true,
        'performance.edgeCaching': true,
        'debug.enableConsoleLogging': true
      },
      staging: {
        'nav.persona': true,
        'dashboard.familyHero': true,
        'calc.monte': true,
        'calc.rmd': true,
        'calc.socialSecurity': false,
        'guides.retirement': true,
        'guides.taxPlanning': true,
        'guides.estatePlanning': true,
        'pros.medicareRecordingBanner': true,
        'pros.complianceMode': true,
        'features.plaidIntegration': false,
        'features.docusignIntegration': false,
        'features.advancedReporting': false,
        'ui.experimentalDesign': false,
        'security.rlsPolicies': true,
        'security.auditLogging': true,
        'performance.edgeCaching': true,
        'debug.enableConsoleLogging': false
      },
      production: {
        'nav.persona': true,
        'dashboard.familyHero': true,
        'calc.monte': true,
        'calc.rmd': true,
        'calc.socialSecurity': false,
        'guides.retirement': true,
        'guides.taxPlanning': true,
        'guides.estatePlanning': true,
        'pros.medicareRecordingBanner': true,
        'pros.complianceMode': true,
        'features.plaidIntegration': false,
        'features.docusignIntegration': false,
        'features.advancedReporting': false,
        'ui.experimentalDesign': false,
        'security.rlsPolicies': true,
        'security.auditLogging': true,
        'performance.edgeCaching': true,
        'debug.enableConsoleLogging': false
      }
    };

    if (action === 'get') {
      const flags = flagConfigs[environment] || flagConfigs.development;
      
      const response: EnvironmentConfig = {
        environment,
        flags,
        metadata: {
          updated_at: new Date().toISOString(),
          version: '1.0.0',
          deployment_id: Deno.env.get('DEPLOYMENT_ID')
        }
      };

      return successResponse(response);
    }

    if (action === 'update' && req.method === 'POST') {
      const { flags: newFlags } = await req.json();
      
      // Validate flag updates
      const validatedFlags = { ...flagConfigs[environment] };
      for (const [key, value] of Object.entries(newFlags)) {
        if (key in validatedFlags) {
          validatedFlags[key] = value;
        }
      }

      // In a real implementation, this would update persistent storage
      flagConfigs[environment] = validatedFlags;

      return successResponse({
        message: 'Feature flags updated successfully',
        environment,
        updated_flags: Object.keys(newFlags),
        current_flags: validatedFlags
      });
    }

    if (action === 'list') {
      return successResponse({
        environments: Object.keys(flagConfigs),
        current_environment: environment,
        flag_count: Object.keys(flagConfigs[environment] || {}).length,
        available_flags: Object.keys(flagConfigs.development)
      });
    }

    return errorResponse('Invalid action. Use: get, update, or list', 400);

  } catch (error) {
    console.error('Feature flags error:', error);
    return errorResponse('Feature flags operation failed', 500, error.message);
  }
})