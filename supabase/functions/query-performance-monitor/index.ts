import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { 
  handleError, 
  handleCORS, 
  logInfo, 
  logError,
  measureExecutionTime,
  generateRequestId,
  corsHeaders,
  StandardError,
  DatabaseError,
  ValidationError
} from '../shared/errorHandler.ts'

interface QueryPerformanceRequest {
  action: 'monitor' | 'load-test' | 'get-metrics';
  tableNames?: string[];
  testDuration?: number; // seconds
  concurrentUsers?: number;
  queryTypes?: string[];
}

interface PerformanceMetrics {
  totalQueries: number;
  avgExecutionTime: number;
  maxExecutionTime: number;
  slowQueryCount: number;
  cacheHitRate: number;
  tableMetrics: Record<string, any>;
}

Deno.serve(async (req) => {
  const requestId = generateRequestId();
  const functionName = 'query-performance-monitor';
  
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    logInfo(`Starting ${functionName}`, { functionName, requestId });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: QueryPerformanceRequest = await req.json();
    
    if (!body.action) {
      throw new ValidationError('Action is required', { functionName, requestId });
    }

    let result: any;

    switch (body.action) {
      case 'monitor':
        result = await monitorTablePerformance(supabase, body.tableNames || ['analytics_events', 'tracked_events', 'webhook_deliveries'], functionName);
        break;
        
      case 'load-test':
        result = await performLoadTest(supabase, body, functionName, requestId);
        break;
        
      case 'get-metrics':
        result = await getPerformanceMetrics(supabase, functionName);
        break;
        
      default:
        throw new ValidationError(`Invalid action: ${body.action}`, { functionName, requestId });
    }

    logInfo(`${functionName} completed successfully`, { functionName, requestId, action: body.action });

    return new Response(
      JSON.stringify({
        success: true,
        requestId,
        data: result
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

async function monitorTablePerformance(
  supabase: any, 
  tableNames: string[], 
  functionName: string
): Promise<PerformanceMetrics> {
  const metrics: PerformanceMetrics = {
    totalQueries: 0,
    avgExecutionTime: 0,
    maxExecutionTime: 0,
    slowQueryCount: 0,
    cacheHitRate: 0,
    tableMetrics: {}
  };

  for (const tableName of tableNames) {
    try {
      // Monitor queries to each table with performance logging
      const { result: queryResult, executionTime } = await measureExecutionTime(
        async () => {
          // Simulate monitoring query
          const { data, error } = await supabase
            .from(tableName)
            .select('id')
            .limit(10);
          
          if (error) throw new DatabaseError(`Query failed for ${tableName}`, error, { functionName });
          return data;
        },
        `monitor_${tableName}`,
        { functionName }
      );

      // Log performance data
      await logQueryPerformance(supabase, {
        tableName,
        operationType: 'SELECT',
        executionTime,
        rowsAffected: queryResult?.length || 0,
        functionName
      });

      metrics.tableMetrics[tableName] = {
        lastQueryTime: executionTime,
        rowCount: queryResult?.length || 0,
        status: 'healthy'
      };

    } catch (error) {
      logError(error);
      metrics.tableMetrics[tableName] = {
        error: error.message,
        status: 'error'
      };
    }
  }

  return metrics;
}

async function performLoadTest(
  supabase: any, 
  config: QueryPerformanceRequest, 
  functionName: string,
  requestId: string
): Promise<any> {
  const duration = config.testDuration || 30; // seconds
  const concurrentUsers = config.concurrentUsers || 10;
  const tables = ['analytics_events', 'tracked_events', 'webhook_deliveries'];
  
  logInfo(`Starting load test`, { 
    functionName, 
    requestId, 
    duration, 
    concurrentUsers, 
    tables 
  });

  const results = {
    testConfig: { duration, concurrentUsers, tables },
    startTime: new Date().toISOString(),
    results: [] as any[]
  };

  const endTime = Date.now() + (duration * 1000);
  const promises: Promise<any>[] = [];

  // Create concurrent "users" running queries
  for (let user = 0; user < concurrentUsers; user++) {
    promises.push(simulateUser(supabase, tables, endTime, user, functionName));
  }

  const userResults = await Promise.allSettled(promises);
  results.results = userResults.map((result, index) => ({
    user: index,
    status: result.status,
    ...(result.status === 'fulfilled' ? { data: result.value } : { error: result.reason?.message })
  }));

  results.endTime = new Date().toISOString();
  
  logInfo(`Load test completed`, { functionName, requestId, results: results.results.length });
  
  return results;
}

async function simulateUser(
  supabase: any, 
  tables: string[], 
  endTime: number, 
  userId: number, 
  functionName: string
): Promise<any> {
  const queries = [];
  let queryCount = 0;

  while (Date.now() < endTime) {
    for (const table of tables) {
      try {
        const { result, executionTime } = await measureExecutionTime(
          async () => {
            // Mix of different query types
            const queryType = Math.random() > 0.5 ? 'select' : 'count';
            
            if (queryType === 'select') {
              const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(5)
                .order('created_at', { ascending: false });
              
              if (error) throw error;
              return data;
            } else {
              const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
              
              if (error) throw error;
              return { count };
            }
          },
          `load_test_${table}_user${userId}`,
          { functionName }
        );

        // Log performance
        await logQueryPerformance(supabase, {
          tableName: table,
          operationType: 'SELECT',
          executionTime,
          rowsAffected: Array.isArray(result) ? result.length : 1,
          functionName,
          queryHash: `load_test_${table}_${queryCount}`
        });

        queries.push({
          table,
          executionTime,
          success: true,
          timestamp: new Date().toISOString()
        });

        queryCount++;
        
        // Small delay to simulate real usage
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
      } catch (error) {
        queries.push({
          table,
          error: error.message,
          success: false,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  return {
    userId,
    totalQueries: queries.length,
    successfulQueries: queries.filter(q => q.success).length,
    avgExecutionTime: queries
      .filter(q => q.success && q.executionTime)
      .reduce((acc, q) => acc + q.executionTime, 0) / queries.filter(q => q.success).length || 0,
    queries: queries.slice(-10) // Keep only last 10 for brevity
  };
}

async function getPerformanceMetrics(supabase: any, functionName: string): Promise<any> {
  try {
    // Get critical table performance
    const { data: criticalMetrics, error: criticalError } = await supabase
      .from('critical_table_performance')
      .select('*')
      .order('hour_bucket', { ascending: false })
      .limit(24);

    if (criticalError) throw new DatabaseError('Failed to fetch critical metrics', criticalError, { functionName });

    // Get overall performance summary
    const { data: summaryMetrics, error: summaryError } = await supabase
      .from('query_performance_summary')
      .select('*')
      .order('hour_bucket', { ascending: false })
      .limit(24);

    if (summaryError) throw new DatabaseError('Failed to fetch summary metrics', summaryError, { functionName });

    // Get top slow queries
    const { data: slowQueries, error: slowError } = await supabase
      .rpc('get_top_slow_queries', { p_hours_back: 24, p_limit: 10 });

    if (slowError) throw new DatabaseError('Failed to fetch slow queries', slowError, { functionName });

    return {
      criticalTableMetrics: criticalMetrics || [],
      overallMetrics: summaryMetrics || [],
      topSlowQueries: slowQueries || [],
      reportGeneratedAt: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new DatabaseError('Failed to generate performance metrics', error, { functionName });
  }
}

async function logQueryPerformance(supabase: any, params: {
  tableName: string;
  operationType: string;
  executionTime: number;
  rowsAffected?: number;
  functionName: string;
  queryHash?: string;
}): Promise<void> {
  try {
    const queryHash = params.queryHash || `${params.tableName}_${params.operationType}_${Date.now()}`;
    
    await supabase.rpc('log_query_performance', {
      p_table_name: params.tableName,
      p_operation_type: params.operationType,
      p_query_hash: queryHash,
      p_execution_time_ms: params.executionTime,
      p_rows_affected: params.rowsAffected || null,
      p_function_name: params.functionName,
      p_user_id: null // System monitoring
    });
  } catch (error) {
    // Log but don't fail the main operation
    logError(new DatabaseError('Failed to log query performance', error, { functionName: params.functionName }));
  }
}