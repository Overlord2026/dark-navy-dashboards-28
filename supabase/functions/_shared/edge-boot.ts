/**
 * Edge Function Boot Helper
 * Provides shared environment loading and cold-start optimization
 */

export interface EdgeBootConfig {
  functionName: string;
  requiredSecrets?: string[];
  optionalSecrets?: string[];
  enableCaching?: boolean;
  enableMetrics?: boolean;
}

export interface BootResult {
  secrets: Record<string, string>;
  config: EdgeBootConfig;
  startTime: number;
  isWarm: boolean;
}

// Global cache for warm starts
const globalCache = new Map<string, any>();
let isBootstrapped = false;

/**
 * Bootstrap edge function with optimized cold-start handling
 */
export async function bootEdgeFunction(config: EdgeBootConfig): Promise<BootResult> {
  const startTime = performance.now();
  const cacheKey = `boot_${config.functionName}`;
  
  // Check if already warmed up
  const isWarm = globalCache.has(cacheKey) && isBootstrapped;
  
  if (isWarm && config.enableCaching) {
    return globalCache.get(cacheKey);
  }

  // Load environment variables
  const secrets: Record<string, string> = {};
  
  // Required secrets - function will fail if missing
  for (const secretName of config.requiredSecrets || []) {
    const value = Deno.env.get(secretName);
    if (!value) {
      throw new Error(`Missing required secret: ${secretName}`);
    }
    secrets[secretName] = value;
  }

  // Optional secrets - won't fail if missing
  for (const secretName of config.optionalSecrets || []) {
    const value = Deno.env.get(secretName);
    if (value) {
      secrets[secretName] = value;
    }
  }

  const bootResult: BootResult = {
    secrets,
    config,
    startTime,
    isWarm
  };

  // Cache for warm starts
  if (config.enableCaching) {
    globalCache.set(cacheKey, bootResult);
  }

  // Log boot metrics
  if (config.enableMetrics) {
    const bootTime = performance.now() - startTime;
    console.log(JSON.stringify({
      function: config.functionName,
      bootTime: `${bootTime.toFixed(2)}ms`,
      isWarm,
      secretsLoaded: Object.keys(secrets).length,
      timestamp: new Date().toISOString()
    }));
  }

  isBootstrapped = true;
  return bootResult;
}

/**
 * Standard CORS headers for edge functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

/**
 * Handle CORS preflight requests
 */
export function handleCORS(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

/**
 * Standard error response with proper headers
 */
export function errorResponse(message: string, status: number = 500, details?: any) {
  return new Response(
    JSON.stringify({ 
      error: message, 
      details,
      timestamp: new Date().toISOString() 
    }),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Standard success response with proper headers
 */
export function successResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Request context helper
 */
export function getRequestContext(req: Request) {
  return {
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent'),
    origin: req.headers.get('origin'),
    authorization: req.headers.get('authorization'),
    timestamp: new Date().toISOString()
  };
}