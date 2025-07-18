import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { 
  handleError, 
  handleCORS, 
  logInfo, 
  logError,
  logDebug,
  generateRequestId,
  corsHeaders,
  StandardError,
  DatabaseError,
  ValidationError,
  ExternalServiceError
} from '../shared/errorHandler.ts'

interface ErrorTestRequest {
  testType: 'validation' | 'database' | 'external-service' | 'timeout' | 'memory' | 'comprehensive';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  count?: number;
}

interface ErrorTestResult {
  testType: string;
  success: boolean;
  errorsCaught: number;
  errorsLogged: number;
  responseTime: number;
  details: any[];
}

Deno.serve(async (req) => {
  const requestId = generateRequestId();
  const functionName = 'error-simulation-test';
  
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    logInfo(`Starting ${functionName}`, { functionName, requestId });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: ErrorTestRequest = await req.json();
    
    if (!body.testType) {
      throw new ValidationError('testType is required', { functionName, requestId });
    }

    const startTime = performance.now();
    let result: ErrorTestResult;

    switch (body.testType) {
      case 'validation':
        result = await testValidationErrors(body, functionName, requestId);
        break;
        
      case 'database':
        result = await testDatabaseErrors(supabase, body, functionName, requestId);
        break;
        
      case 'external-service':
        result = await testExternalServiceErrors(body, functionName, requestId);
        break;
        
      case 'timeout':
        result = await testTimeoutErrors(body, functionName, requestId);
        break;
        
      case 'memory':
        result = await testMemoryErrors(body, functionName, requestId);
        break;
        
      case 'comprehensive':
        result = await runComprehensiveErrorTests(supabase, body, functionName, requestId);
        break;
        
      default:
        throw new ValidationError(`Invalid test type: ${body.testType}`, { functionName, requestId });
    }

    result.responseTime = performance.now() - startTime;

    logInfo(`${functionName} completed`, { 
      functionName, 
      requestId, 
      testType: body.testType,
      responseTime: result.responseTime 
    });

    return new Response(
      JSON.stringify({
        success: true,
        requestId,
        testResults: result,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    return handleError(error, corsHeaders);
  }
});

async function testValidationErrors(
  config: ErrorTestRequest, 
  functionName: string, 
  requestId: string
): Promise<ErrorTestResult> {
  const count = config.count || 5;
  const errors: any[] = [];
  let errorsCaught = 0;
  let errorsLogged = 0;

  logDebug(`Testing validation errors`, { count, functionName, requestId });

  for (let i = 0; i < count; i++) {
    try {
      // Simulate various validation errors
      const errorType = i % 4;
      
      switch (errorType) {
        case 0:
          throw new ValidationError('Email format is invalid', { functionName, requestId });
        case 1:
          throw new ValidationError('Password must be at least 8 characters', { functionName, requestId });
        case 2:
          throw new ValidationError('Required field missing: user_id', { functionName, requestId });
        case 3:
          throw new ValidationError('Invalid date format', { functionName, requestId });
      }
      
    } catch (error) {
      errorsCaught++;
      if (error instanceof ValidationError) {
        logError(error);
        errorsLogged++;
        errors.push({
          type: 'ValidationError',
          message: error.message,
          statusCode: error.statusCode,
          errorCode: error.errorCode
        });
      }
    }
  }

  return {
    testType: 'validation',
    success: true,
    errorsCaught,
    errorsLogged,
    responseTime: 0, // Will be set by caller
    details: errors
  };
}

async function testDatabaseErrors(
  supabase: any,
  config: ErrorTestRequest, 
  functionName: string, 
  requestId: string
): Promise<ErrorTestResult> {
  const count = config.count || 3;
  const errors: any[] = [];
  let errorsCaught = 0;
  let errorsLogged = 0;

  logDebug(`Testing database errors`, { count, functionName, requestId });

  for (let i = 0; i < count; i++) {
    try {
      // Simulate various database errors
      const errorType = i % 3;
      
      switch (errorType) {
        case 0:
          // Invalid table name
          await supabase.from('nonexistent_table').select('*');
          break;
        case 1:
          // Invalid column reference
          await supabase.from('audit_logs').select('nonexistent_column');
          break;
        case 2:
          // Constraint violation (if we had constraints)
          await supabase.from('audit_logs').insert({
            event_type: null, // This should fail
            status: null
          });
          break;
      }
      
    } catch (originalError) {
      errorsCaught++;
      try {
        throw new DatabaseError('Database operation failed', originalError, { functionName, requestId });
      } catch (dbError) {
        logError(dbError);
        errorsLogged++;
        errors.push({
          type: 'DatabaseError',
          message: dbError.message,
          statusCode: dbError.statusCode,
          errorCode: dbError.errorCode,
          originalError: originalError.message
        });
      }
    }
  }

  return {
    testType: 'database',
    success: true,
    errorsCaught,
    errorsLogged,
    responseTime: 0,
    details: errors
  };
}

async function testExternalServiceErrors(
  config: ErrorTestRequest, 
  functionName: string, 
  requestId: string
): Promise<ErrorTestResult> {
  const count = config.count || 3;
  const errors: any[] = [];
  let errorsCaught = 0;
  let errorsLogged = 0;

  logDebug(`Testing external service errors`, { count, functionName, requestId });

  for (let i = 0; i < count; i++) {
    try {
      // Simulate external service calls that fail
      const errorType = i % 3;
      const service = ['EmailService', 'PaymentGateway', 'ThirdPartyAPI'][errorType];
      
      // Simulate HTTP calls to invalid endpoints
      await fetch(`https://invalid-service-${i}.example.com/api/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
    } catch (originalError) {
      errorsCaught++;
      try {
        const service = ['EmailService', 'PaymentGateway', 'ThirdPartyAPI'][i % 3];
        throw new ExternalServiceError(`${service} request failed`, service, { functionName, requestId });
      } catch (serviceError) {
        logError(serviceError);
        errorsLogged++;
        errors.push({
          type: 'ExternalServiceError',
          message: serviceError.message,
          statusCode: serviceError.statusCode,
          errorCode: serviceError.errorCode,
          service: serviceError.context.additionalData?.service
        });
      }
    }
  }

  return {
    testType: 'external-service',
    success: true,
    errorsCaught,
    errorsLogged,
    responseTime: 0,
    details: errors
  };
}

async function testTimeoutErrors(
  config: ErrorTestRequest, 
  functionName: string, 
  requestId: string
): Promise<ErrorTestResult> {
  const errors: any[] = [];
  let errorsCaught = 0;
  let errorsLogged = 0;

  logDebug(`Testing timeout errors`, { functionName, requestId });

  try {
    // Simulate a timeout scenario
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 100);
    });
    
    const longRunningOperation = new Promise(resolve => {
      setTimeout(resolve, 500); // This will timeout
    });
    
    await Promise.race([longRunningOperation, timeoutPromise]);
    
  } catch (originalError) {
    errorsCaught++;
    try {
      throw new StandardError(
        'Operation timed out after 100ms',
        408,
        'TIMEOUT_ERROR',
        { functionName, requestId, operation: 'long_running_test' }
      );
    } catch (timeoutError) {
      logError(timeoutError);
      errorsLogged++;
      errors.push({
        type: 'TimeoutError',
        message: timeoutError.message,
        statusCode: timeoutError.statusCode,
        errorCode: timeoutError.errorCode
      });
    }
  }

  return {
    testType: 'timeout',
    success: true,
    errorsCaught,
    errorsLogged,
    responseTime: 0,
    details: errors
  };
}

async function testMemoryErrors(
  config: ErrorTestRequest, 
  functionName: string, 
  requestId: string
): Promise<ErrorTestResult> {
  const errors: any[] = [];
  let errorsCaught = 0;
  let errorsLogged = 0;

  logDebug(`Testing memory errors`, { functionName, requestId });

  try {
    // Simulate memory pressure (but don't actually exhaust memory)
    const largeArray = new Array(100000).fill('test data');
    
    // Simulate memory allocation failure
    throw new Error('OutOfMemoryError: Cannot allocate memory');
    
  } catch (originalError) {
    errorsCaught++;
    try {
      throw new StandardError(
        'Memory allocation failed',
        507,
        'MEMORY_ERROR',
        { 
          functionName, 
          requestId, 
          additionalData: { 
            allocatedSize: '100000 items',
            memoryPressure: 'high'
          }
        }
      );
    } catch (memoryError) {
      logError(memoryError);
      errorsLogged++;
      errors.push({
        type: 'MemoryError',
        message: memoryError.message,
        statusCode: memoryError.statusCode,
        errorCode: memoryError.errorCode
      });
    }
  }

  return {
    testType: 'memory',
    success: true,
    errorsCaught,
    errorsLogged,
    responseTime: 0,
    details: errors
  };
}

async function runComprehensiveErrorTests(
  supabase: any,
  config: ErrorTestRequest, 
  functionName: string, 
  requestId: string
): Promise<ErrorTestResult> {
  logInfo(`Running comprehensive error test suite`, { functionName, requestId });

  const allResults = await Promise.allSettled([
    testValidationErrors({ ...config, count: 2 }, functionName, requestId),
    testDatabaseErrors(supabase, { ...config, count: 2 }, functionName, requestId),
    testExternalServiceErrors({ ...config, count: 2 }, functionName, requestId),
    testTimeoutErrors(config, functionName, requestId),
    testMemoryErrors(config, functionName, requestId)
  ]);

  const successfulTests = allResults.filter(r => r.status === 'fulfilled').length;
  const totalErrors = allResults
    .filter(r => r.status === 'fulfilled')
    .reduce((acc, r) => acc + (r.value as ErrorTestResult).errorsCaught, 0);
  
  const totalLogged = allResults
    .filter(r => r.status === 'fulfilled')
    .reduce((acc, r) => acc + (r.value as ErrorTestResult).errorsLogged, 0);

  return {
    testType: 'comprehensive',
    success: true,
    errorsCaught: totalErrors,
    errorsLogged: totalLogged,
    responseTime: 0,
    details: {
      testsRun: allResults.length,
      testsSucceeded: successfulTests,
      testsFailed: allResults.length - successfulTests,
      individualResults: allResults.map((result, index) => ({
        testIndex: index,
        status: result.status,
        ...(result.status === 'fulfilled' ? { data: result.value } : { error: result.reason?.message })
      }))
    }
  };
}