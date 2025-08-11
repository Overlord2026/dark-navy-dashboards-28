// Policy Evaluator - Executes compiled decision graphs
// Fast policy evaluation with detailed reasoning and scope extraction

import { DecisionGraph, DecisionNode } from './Compiler';
import { PolicyContext } from './DSL';

export interface PolicyDecision {
  effect: 'ALLOW' | 'DENY';
  confidence: number;
  reason: string;
  scopes: string[];
  execution_path: string[];
  evaluation_time_ms: number;
  conditions_evaluated: number;
  cache_hit?: boolean;
}

export interface ScopeExtraction {
  granted_actions: string[];
  accessible_resources: string[];
  conditions_applied: Array<{
    field: string;
    operator: string;
    value: any;
    result: boolean;
  }>;
  jurisdiction: string;
}

export interface EvaluationOptions {
  enable_caching: boolean;
  cache_ttl_seconds: number;
  max_evaluation_depth: number;
  collect_detailed_trace: boolean;
  timeout_ms: number;
}

export class PolicyEvaluator {
  private evaluationCache = new Map<string, { decision: PolicyDecision; timestamp: number }>();
  private evaluationMetrics = {
    total_evaluations: 0,
    cache_hits: 0,
    avg_evaluation_time: 0,
    max_evaluation_time: 0
  };

  async evaluate(
    graph: DecisionGraph,
    context: PolicyContext,
    action: string,
    resource: string,
    options: EvaluationOptions = this.getDefaultOptions()
  ): Promise<PolicyDecision> {
    const startTime = performance.now();
    this.evaluationMetrics.total_evaluations++;

    // Check cache first
    if (options.enable_caching) {
      const cached = this.checkCache(graph, context, action, resource, options);
      if (cached) {
        this.evaluationMetrics.cache_hits++;
        return { ...cached, cache_hit: true };
      }
    }

    // Prepare evaluation context
    const evaluationContext = this.prepareEvaluationContext(context, action, resource);
    const executionPath: string[] = [];
    let conditionsEvaluated = 0;

    try {
      // Execute decision graph
      const result = await this.executeDecisionGraph(
        graph,
        evaluationContext,
        executionPath,
        conditionsEvaluated,
        options
      );

      const evaluationTime = performance.now() - startTime;
      this.updateMetrics(evaluationTime);

      const decision: PolicyDecision = {
        effect: result.effect,
        confidence: result.confidence,
        reason: result.reason,
        scopes: result.scopes,
        execution_path: executionPath,
        evaluation_time_ms: evaluationTime,
        conditions_evaluated: conditionsEvaluated
      };

      // Cache the result
      if (options.enable_caching) {
        this.cacheResult(graph, context, action, resource, decision, options);
      }

      return decision;

    } catch (error) {
      const evaluationTime = performance.now() - startTime;
      
      return {
        effect: 'DENY',
        confidence: 1.0,
        reason: `Policy evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        scopes: [],
        execution_path: executionPath,
        evaluation_time_ms: evaluationTime,
        conditions_evaluated: conditionsEvaluated
      };
    }
  }

  private async executeDecisionGraph(
    graph: DecisionGraph,
    context: any,
    executionPath: string[],
    conditionsEvaluated: number,
    options: EvaluationOptions,
    currentNodeId?: string,
    depth = 0
  ): Promise<{ effect: 'ALLOW' | 'DENY'; confidence: number; reason: string; scopes: string[] }> {
    
    // Check maximum depth
    if (depth > options.max_evaluation_depth) {
      throw new Error(`Maximum evaluation depth exceeded: ${options.max_evaluation_depth}`);
    }

    const nodeId = currentNodeId || graph.root_node_id;
    const node = graph.nodes.get(nodeId);
    
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    executionPath.push(nodeId);

    // Handle result nodes
    if (node.type === 'result') {
      return {
        effect: node.effect!,
        confidence: node.confidence || 1.0,
        reason: node.reason || `${node.effect} by policy`,
        scopes: this.extractScopes(context, node.effect!)
      };
    }

    // Handle condition nodes
    if (node.type === 'condition' && node.condition) {
      conditionsEvaluated++;
      
      const conditionResult = await this.evaluateCondition(node.condition, context);
      
      if (options.collect_detailed_trace) {
        console.log(`Condition ${node.condition.field} ${node.condition.operator} ${node.condition.value}: ${conditionResult}`);
      }

      const nextNodeId = conditionResult ? node.true_branch : node.false_branch;
      
      if (!nextNodeId) {
        throw new Error(`No branch defined for condition result: ${conditionResult}`);
      }

      return this.executeDecisionGraph(
        graph,
        context,
        executionPath,
        conditionsEvaluated,
        options,
        nextNodeId,
        depth + 1
      );
    }

    throw new Error(`Invalid node type or missing condition: ${nodeId}`);
  }

  private async evaluateCondition(
    condition: { field: string; operator: string; value: any },
    context: any
  ): Promise<boolean> {
    
    // Handle special synthetic conditions
    if (condition.field === '__action_match__') {
      return this.matchesPattern(context.__action__, condition.value);
    }
    
    if (condition.field === '__resource_match__') {
      return this.matchesPattern(context.__resource__, condition.value);
    }

    if (condition.field === '__statement_check__') {
      // This is used for statement chaining - always evaluate as true for simplicity
      return true;
    }

    // Get field value from context
    const fieldValue = this.getFieldValue(context, condition.field);

    // Evaluate condition based on operator
    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value;
      
      case 'ne':
        return fieldValue !== condition.value;
      
      case 'gt':
        return fieldValue > condition.value;
      
      case 'lt':
        return fieldValue < condition.value;
      
      case 'gte':
        return fieldValue >= condition.value;
      
      case 'lte':
        return fieldValue <= condition.value;
      
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      
      case 'nin':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
      
      case 'matches':
        if (Array.isArray(condition.value)) {
          return condition.value.some(pattern => this.matchesPattern(fieldValue, pattern));
        }
        return this.matchesPattern(fieldValue, condition.value);
      
      default:
        throw new Error(`Unknown operator: ${condition.operator}`);
    }
  }

  private matchesPattern(value: string, pattern: string | string[]): boolean {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    
    return patterns.some(p => {
      if (p.includes('*')) {
        // Wildcard matching
        const regex = new RegExp('^' + p.replace(/\*/g, '.*') + '$');
        return regex.test(value);
      } else {
        // Exact match
        return value === p;
      }
    });
  }

  private getFieldValue(context: any, field: string): any {
    const parts = field.split('.');
    let value: any = context;
    
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  private extractScopes(context: any, effect: 'ALLOW' | 'DENY'): string[] {
    const scopes: string[] = [];
    
    if (effect === 'ALLOW') {
      // Build scopes based on the action and resource
      const action = context.__action__;
      const resource = context.__resource__;
      
      scopes.push(`${action}:${resource}`);
      
      // Add persona-specific scopes
      if (context.persona) {
        scopes.push(`persona:${context.persona}`);
      }
      
      // Add role-based scopes
      if (context.roles && Array.isArray(context.roles)) {
        context.roles.forEach((role: string) => {
          scopes.push(`role:${role}`);
        });
      }
      
      // Add compliance-based scopes
      if (context.compliance_status) {
        Object.entries(context.compliance_status).forEach(([key, value]) => {
          if (value === true) {
            scopes.push(`compliance:${key}`);
          }
        });
      }
    }
    
    return scopes;
  }

  private prepareEvaluationContext(
    context: PolicyContext,
    action: string,
    resource: string
  ): any {
    return {
      ...context,
      __action__: action,
      __resource__: resource,
      __timestamp__: Date.now()
    };
  }

  private checkCache(
    graph: DecisionGraph,
    context: PolicyContext,
    action: string,
    resource: string,
    options: EvaluationOptions
  ): PolicyDecision | null {
    const cacheKey = this.getCacheKey(graph, context, action, resource);
    const cached = this.evaluationCache.get(cacheKey);
    
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < options.cache_ttl_seconds * 1000) {
        return cached.decision;
      } else {
        // Expired, remove from cache
        this.evaluationCache.delete(cacheKey);
      }
    }
    
    return null;
  }

  private cacheResult(
    graph: DecisionGraph,
    context: PolicyContext,
    action: string,
    resource: string,
    decision: PolicyDecision,
    options: EvaluationOptions
  ): void {
    const cacheKey = this.getCacheKey(graph, context, action, resource);
    this.evaluationCache.set(cacheKey, {
      decision,
      timestamp: Date.now()
    });
  }

  private getCacheKey(
    graph: DecisionGraph,
    context: PolicyContext,
    action: string,
    resource: string
  ): string {
    // Create a cache key based on relevant context fields
    const relevantContext = {
      user_id: context.user_id,
      tenant_id: context.tenant_id,
      persona: context.persona,
      roles: context.roles,
      action,
      resource
    };
    
    return `${graph.policy_metadata.name}:${graph.policy_metadata.version}:${JSON.stringify(relevantContext)}`;
  }

  private updateMetrics(evaluationTime: number): void {
    this.evaluationMetrics.max_evaluation_time = Math.max(
      this.evaluationMetrics.max_evaluation_time,
      evaluationTime
    );
    
    // Update running average
    const total = this.evaluationMetrics.total_evaluations;
    const prevAvg = this.evaluationMetrics.avg_evaluation_time;
    this.evaluationMetrics.avg_evaluation_time = (prevAvg * (total - 1) + evaluationTime) / total;
  }

  private getDefaultOptions(): EvaluationOptions {
    return {
      enable_caching: true,
      cache_ttl_seconds: 300, // 5 minutes
      max_evaluation_depth: 50,
      collect_detailed_trace: false,
      timeout_ms: 1000 // 1 second
    };
  }

  // Batch evaluation for multiple actions/resources
  async evaluateBatch(
    graph: DecisionGraph,
    context: PolicyContext,
    requests: Array<{ action: string; resource: string }>,
    options?: EvaluationOptions
  ): Promise<PolicyDecision[]> {
    const promises = requests.map(request => 
      this.evaluate(graph, context, request.action, request.resource, options)
    );
    
    return Promise.all(promises);
  }

  // Extract all allowed scopes for a user
  async extractUserScopes(
    graphs: DecisionGraph[],
    context: PolicyContext,
    options?: EvaluationOptions
  ): Promise<ScopeExtraction> {
    const grantedActions: string[] = [];
    const accessibleResources: string[] = [];
    const conditionsApplied: Array<{
      field: string;
      operator: string;
      value: any;
      result: boolean;
    }> = [];

    // Test common actions and resources
    const testActions = ['read', 'write', 'delete', 'create', 'execute'];
    const testResources = [
      'portfolio/*', 'client/*', 'admin/*', 'reports/*', 
      'documents/*', 'settings/*', 'compliance/*'
    ];

    for (const graph of graphs) {
      for (const action of testActions) {
        for (const resource of testResources) {
          const decision = await this.evaluate(graph, context, action, resource, options);
          
          if (decision.effect === 'ALLOW') {
            if (!grantedActions.includes(action)) {
              grantedActions.push(action);
            }
            
            if (!accessibleResources.includes(resource)) {
              accessibleResources.push(resource);
            }
          }
        }
      }
    }

    return {
      granted_actions: grantedActions,
      accessible_resources: accessibleResources,
      conditions_applied: conditionsApplied,
      jurisdiction: context.tenant_id // Simplified
    };
  }

  // Get evaluation metrics for monitoring
  getMetrics() {
    return {
      ...this.evaluationMetrics,
      cache_hit_rate: this.evaluationMetrics.total_evaluations > 0 
        ? this.evaluationMetrics.cache_hits / this.evaluationMetrics.total_evaluations 
        : 0,
      cache_size: this.evaluationCache.size
    };
  }

  // Clear cache (useful for testing or policy updates)
  clearCache(): void {
    this.evaluationCache.clear();
  }

  // Validate decision graph integrity
  validateGraph(graph: DecisionGraph): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const visitedNodes = new Set<string>();
    
    // Check that all referenced nodes exist
    const checkNode = (nodeId: string) => {
      if (visitedNodes.has(nodeId)) return;
      visitedNodes.add(nodeId);
      
      const node = graph.nodes.get(nodeId);
      if (!node) {
        errors.push(`Referenced node not found: ${nodeId}`);
        return;
      }
      
      if (node.type === 'condition') {
        if (!node.condition) {
          errors.push(`Condition node missing condition: ${nodeId}`);
        }
        if (node.true_branch) checkNode(node.true_branch);
        if (node.false_branch) checkNode(node.false_branch);
      }
    };
    
    checkNode(graph.root_node_id);
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}