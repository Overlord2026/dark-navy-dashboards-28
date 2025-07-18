/**
 * Standardized error handling for Edge Functions
 */

export interface ErrorContext {
  functionName: string;
  operation?: string;
  userId?: string;
  requestId?: string;
  additionalData?: Record<string, any>;
}

export interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
  CRITICAL: 'critical';
}

export const LOG_LEVELS: LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical'
};

export class StandardError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly context: ErrorContext;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    context: ErrorContext
  ) {
    super(message);
    this.name = 'StandardError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends StandardError {
  constructor(message: string, context: ErrorContext) {
    super(message, 400, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends StandardError {
  constructor(message: string, originalError: any, context: ErrorContext) {
    super(message, 500, 'DATABASE_ERROR', {
      ...context,
      additionalData: {
        ...context.additionalData,
        originalError: originalError.message,
        stack: originalError.stack
      }
    });
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends StandardError {
  constructor(message: string, service: string, context: ErrorContext) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', {
      ...context,
      additionalData: {
        ...context.additionalData,
        service
      }
    });
    this.name = 'ExternalServiceError';
  }
}

/**
 * Log an error with structured format
 */
export function logError(error: Error | StandardError, level: keyof LogLevel = 'ERROR') {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message: error.message,
    name: error.name,
    stack: error.stack,
    ...(error instanceof StandardError && {
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      context: error.context
    })
  };

  console.error(JSON.stringify(logEntry, null, 2));
}

/**
 * Log an info message with structured format
 */
export function logInfo(message: string, context: Partial<ErrorContext> = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: LOG_LEVELS.INFO,
    message,
    context
  };

  console.log(JSON.stringify(logEntry, null, 2));
}

/**
 * Log a debug message with structured format
 */
export function logDebug(message: string, data?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: LOG_LEVELS.DEBUG,
    message,
    data
  };

  console.debug(JSON.stringify(logEntry, null, 2));
}

/**
 * Handle errors and return appropriate HTTP response
 */
export function handleError(error: Error | StandardError, corsHeaders: Record<string, string>) {
  // Log the error
  logError(error);

  // Determine response based on error type
  if (error instanceof StandardError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: error.errorCode,
          message: error.message,
          timestamp: error.timestamp,
          ...(error.context.requestId && { requestId: error.context.requestId })
        }
      }),
      {
        status: error.statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Generic error response
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }
    }),
    {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Measure function execution time
 */
export function measureExecutionTime<T>(
  operation: () => Promise<T>,
  operationName: string,
  context: Partial<ErrorContext> = {}
): Promise<{ result: T; executionTime: number }> {
  return new Promise(async (resolve, reject) => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const executionTime = performance.now() - startTime;
      
      logInfo(`Operation completed: ${operationName}`, {
        ...context,
        additionalData: {
          executionTime: `${executionTime.toFixed(2)}ms`
        }
      });
      
      resolve({ result, executionTime });
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      logError(new StandardError(
        `Operation failed: ${operationName}`,
        500,
        'OPERATION_FAILED',
        {
          functionName: context.functionName || 'unknown',
          operation: operationName,
          additionalData: {
            executionTime: `${executionTime.toFixed(2)}ms`,
            ...context.additionalData
          }
        }
      ));
      
      reject(error);
    }
  });
}

/**
 * Generate a request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Standard CORS headers
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