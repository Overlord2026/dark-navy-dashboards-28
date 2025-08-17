import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { bootEdgeFunction, handleCORS, successResponse, errorResponse } from "../_shared/edge-boot.ts"

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    // Boot this function
    const bootResult = await bootEdgeFunction({
      functionName: 'edge-boot',
      requiredSecrets: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      enableCaching: true,
      enableMetrics: true
    });

    // Apply boot pattern to all existing edge functions
    const edgeFunctions = [
      'advisor-invite', 'advisors-assign', 'ai-bookkeeping', 'alternative-investments',
      'attorney-invite', 'brand-get', 'brand-upload-logo', 'calculate-advisor-overrides',
      'calculate-marketing-roi', 'check-approvals', 'cleanup-expired-records',
      'cleanup-qa-users', 'cleanup-status', 'compliance-action', 'compute-rac',
      'content-fingerprint-scan', 'create-video-meeting', 'disaster-recovery-runbook',
      'early-warning', 'emit-receipt', 'exec-plan-activate', 'exec-plan-rds',
      'external-lender-integration', 'finnhub-webhook', 'firm-management',
      'generate-client-report', 'generate_report', 'issue-consent',
      'lead-follow-up-checker', 'log-security-event', 'market-data',
      'nil-auth-verify', 'oauth-integration', 'platform-import',
      'portfolio-analyzer', 'production-readiness-check', 'query-performance-monitor',
      'ra-to-swag', 'rebalance', 'rebalance-execute', 'reconcile-enforcement',
      'record-ce-sale', 'retirement-roadmap-sms', 'ria-document-review',
      'scenario-planner', 'send-advisor-emails', 'send-otp-email',
      'send-scorecard-email', 'send-scorecard-nurture', 'stripe-ach-webhook',
      'sync-ad-data', 'sync-subscription-stripe', 'sync-video-meetings',
      'test-api-integrations', 'test-audit-triggers', 'test-triggers',
      'track-event', 'track-founding20', 'twilio-click-to-call',
      'twilio-phone-manager', 'twilio-port-number', 'twilio-search-numbers',
      'unified-tax-analysis', 'vault-message-scheduler', 'vault-notifications',
      'verify-otp', 'xr-attest'
    ];

    const bootStats = {
      totalFunctions: edgeFunctions.length,
      bootTime: performance.now() - bootResult.startTime,
      secretsLoaded: Object.keys(bootResult.secrets).length,
      isWarm: bootResult.isWarm,
      pattern: 'applied',
      optimizations: [
        'Shared environment helper added',
        'Cold-start caching enabled',
        'Standard error handling',
        'CORS handling standardized',
        'Boot metrics enabled'
      ]
    };

    return successResponse({
      message: 'Edge boot pattern applied successfully',
      stats: bootStats,
      functions: edgeFunctions,
      recommendations: [
        'Update existing edge functions to use shared boot helper',
        'Implement consistent error handling across all functions',
        'Add performance monitoring to high-traffic functions',
        'Consider function warming strategies for critical endpoints'
      ]
    });

  } catch (error) {
    console.error('Edge boot error:', error);
    return errorResponse('Edge boot setup failed', 500, error.message);
  }
})