/**
 * AI Executive Suite - CLO Policy Service
 * Manages CLO policy DAG evaluation and legal gates
 */

import { supabase } from '@/integrations/supabase/client';

export interface PolicyNode {
  id: string;
  tenant_id: string;
  node_type: 'condition' | 'action' | 'gate';
  node_name: string;
  node_config: {
    evaluation_type?: string;
    conditions?: any[];
    actions?: string[];
    threshold?: number;
    weight?: number;
  };
  evaluation_logic?: string;
  is_active: boolean;
}

export interface PolicyEdge {
  id: string;
  tenant_id: string;
  from_node_id: string;
  to_node_id: string;
  edge_weight: number;
  condition_expression?: string;
  is_active: boolean;
}

export interface PolicyEvaluationResult {
  decision: 'ALLOW' | 'DENY' | 'REVIEW_REQUIRED';
  confidence_score: number;
  triggered_rules: string[];
  risk_factors: string[];
  recommendations: string[];
  policy_hash: string;
}

export class CLOPolicyService {
  /**
   * Evaluate plan against policy DAG
   */
  async evaluatePlanPolicy(
    planContent: any,
    tenantId: string,
    planType: string = 'execution_plan'
  ): Promise<PolicyEvaluationResult> {
    // Get active policy nodes and edges
    const [nodesResult, edgesResult] = await Promise.all([
      supabase
        .from('clo_policy_nodes')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true),
      supabase
        .from('clo_policy_edges')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
    ]);

    if (nodesResult.error) throw nodesResult.error;
    if (edgesResult.error) throw edgesResult.error;

    const nodes = nodesResult.data || [];
    const edges = edgesResult.data || [];

    // Build policy DAG
    const policyGraph = this.buildPolicyGraph(nodes as any, edges as any);
    
    // Evaluate plan against graph
    const result = await this.evaluateAgainstGraph(planContent, policyGraph, planType);
    
    // Calculate policy hash
    const policyHash = await this.calculatePolicyHash(nodes, edges);
    result.policy_hash = policyHash;

    return result;
  }

  /**
   * Create default policy nodes for tenant
   */
  async createDefaultPolicyNodes(tenantId: string, createdBy: string): Promise<void> {
    const defaultNodes = [
      // Budget validation node
      {
        tenant_id: tenantId,
        node_type: 'condition',
        node_name: 'budget_validation',
        node_config: {
          evaluation_type: 'budget_check',
          threshold: 100000,
          weight: 0.8
        },
        evaluation_logic: 'estimated_budget <= threshold',
        is_active: true
      },
      // Compliance check node
      {
        tenant_id: tenantId,
        node_type: 'condition',
        node_name: 'compliance_check',
        node_config: {
          evaluation_type: 'compliance_validation',
          conditions: ['legal_review', 'regulatory_compliance'],
          weight: 1.0
        },
        evaluation_logic: 'all(conditions)',
        is_active: true
      },
      // Risk assessment node
      {
        tenant_id: tenantId,
        node_type: 'condition',
        node_name: 'risk_assessment',
        node_config: {
          evaluation_type: 'risk_analysis',
          threshold: 0.7,
          weight: 0.9
        },
        evaluation_logic: 'risk_score <= threshold',
        is_active: true
      },
      // Final gate node
      {
        tenant_id: tenantId,
        node_type: 'gate',
        node_name: 'final_approval_gate',
        node_config: {
          evaluation_type: 'weighted_decision',
          threshold: 0.75
        },
        evaluation_logic: 'weighted_average >= threshold',
        is_active: true
      }
    ];

    for (const node of defaultNodes) {
      await supabase.from('clo_policy_nodes').insert(node);
    }

    // Create edges connecting the nodes
    const { data: createdNodes } = await supabase
      .from('clo_policy_nodes')
      .select('id, node_name')
      .eq('tenant_id', tenantId);

    if (createdNodes) {
      const nodeMap = new Map(createdNodes.map(n => [n.node_name, n.id]));
      
      const defaultEdges = [
        {
          tenant_id: tenantId,
          from_node_id: nodeMap.get('budget_validation'),
          to_node_id: nodeMap.get('final_approval_gate'),
          edge_weight: 0.3,
          is_active: true
        },
        {
          tenant_id: tenantId,
          from_node_id: nodeMap.get('compliance_check'),
          to_node_id: nodeMap.get('final_approval_gate'),
          edge_weight: 0.4,
          is_active: true
        },
        {
          tenant_id: tenantId,
          from_node_id: nodeMap.get('risk_assessment'),
          to_node_id: nodeMap.get('final_approval_gate'),
          edge_weight: 0.3,
          is_active: true
        }
      ];

      for (const edge of defaultEdges) {
        await supabase.from('clo_policy_edges').insert(edge);
      }
    }
  }

  /**
   * Build policy graph from nodes and edges
   */
  private buildPolicyGraph(nodes: PolicyNode[], edges: PolicyEdge[]) {
    const graph = {
      nodes: new Map(nodes.map(n => [n.id, n])),
      edges: new Map(),
      adjacencyList: new Map()
    };

    // Build adjacency list
    edges.forEach(edge => {
      if (!graph.adjacencyList.has(edge.from_node_id)) {
        graph.adjacencyList.set(edge.from_node_id, []);
      }
      graph.adjacencyList.get(edge.from_node_id)!.push(edge);
      graph.edges.set(`${edge.from_node_id}-${edge.to_node_id}`, edge);
    });

    return graph;
  }

  /**
   * Evaluate plan against policy graph
   */
  private async evaluateAgainstGraph(
    planContent: any,
    graph: any,
    planType: string
  ): Promise<PolicyEvaluationResult> {
    const evaluationResults = new Map();
    const triggeredRules: string[] = [];
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Evaluate each node
    for (const [nodeId, node] of graph.nodes) {
      const nodeResult = await this.evaluateNode(node, planContent, planType);
      evaluationResults.set(nodeId, nodeResult);
      
      if (nodeResult.triggered) {
        triggeredRules.push(node.node_name);
      }
      
      if (nodeResult.risk_factors) {
        riskFactors.push(...nodeResult.risk_factors);
      }
      
      if (nodeResult.recommendations) {
        recommendations.push(...nodeResult.recommendations);
      }
    }

    // Calculate final decision using graph traversal
    const finalScore = this.calculateFinalScore(graph, evaluationResults);
    
    let decision: 'ALLOW' | 'DENY' | 'REVIEW_REQUIRED';
    if (finalScore >= 0.8) {
      decision = 'ALLOW';
    } else if (finalScore >= 0.5) {
      decision = 'REVIEW_REQUIRED';
    } else {
      decision = 'DENY';
    }

    return {
      decision,
      confidence_score: finalScore,
      triggered_rules,
      risk_factors,
      recommendations,
      policy_hash: '' // Will be set by caller
    };
  }

  /**
   * Evaluate individual policy node
   */
  private async evaluateNode(node: PolicyNode, planContent: any, planType: string) {
    const result = {
      score: 0,
      triggered: false,
      risk_factors: [] as string[],
      recommendations: [] as string[]
    };

    switch (node.node_name) {
      case 'budget_validation':
        return this.evaluateBudgetNode(node, planContent, result);
      
      case 'compliance_check':
        return this.evaluateComplianceNode(node, planContent, result);
      
      case 'risk_assessment':
        return this.evaluateRiskNode(node, planContent, result);
      
      default:
        // Generic evaluation
        result.score = 0.5; // Neutral score for unknown nodes
        break;
    }

    return result;
  }

  /**
   * Evaluate budget validation node
   */
  private evaluateBudgetNode(node: PolicyNode, planContent: any, result: any) {
    const threshold = node.node_config.threshold || 100000;
    const budget = planContent.estimated_budget || 0;

    if (budget <= threshold) {
      result.score = 1.0;
    } else if (budget <= threshold * 2) {
      result.score = 0.6;
      result.triggered = true;
      result.recommendations.push(`Budget ${budget} exceeds preferred threshold ${threshold}`);
    } else {
      result.score = 0.2;
      result.triggered = true;
      result.risk_factors.push('High budget risk');
      result.recommendations.push(`Budget ${budget} significantly exceeds threshold - requires senior approval`);
    }

    return result;
  }

  /**
   * Evaluate compliance check node
   */
  private evaluateComplianceNode(node: PolicyNode, planContent: any, result: any) {
    // Check for compliance indicators in plan content
    const complianceIndicators = [
      'legal_review_required',
      'regulatory_compliance',
      'privacy_impact',
      'data_protection'
    ];

    let complianceScore = 0;
    let foundIssues = 0;

    complianceIndicators.forEach(indicator => {
      if (planContent[indicator] === true) {
        foundIssues++;
      } else if (planContent[indicator] === false) {
        complianceScore += 0.25;
      }
    });

    if (foundIssues === 0) {
      result.score = Math.max(0.8, complianceScore);
    } else if (foundIssues <= 2) {
      result.score = 0.5;
      result.triggered = true;
      result.recommendations.push('Compliance review required');
    } else {
      result.score = 0.1;
      result.triggered = true;
      result.risk_factors.push('Multiple compliance issues');
    }

    return result;
  }

  /**
   * Evaluate risk assessment node
   */
  private evaluateRiskNode(node: PolicyNode, planContent: any, result: any) {
    // Calculate risk score based on various factors
    let riskScore = 0;
    const factors = [];

    // Time pressure risk
    if (planContent.estimated_duration_days && planContent.estimated_duration_days < 7) {
      riskScore += 0.3;
      factors.push('Tight timeline');
    }

    // Scope risk
    if (planContent.plan_content?.scope === 'enterprise' || 
        planContent.plan_content?.impact === 'high') {
      riskScore += 0.4;
      factors.push('High impact scope');
    }

    // External dependency risk
    if (planContent.plan_content?.external_dependencies?.length > 0) {
      riskScore += 0.2;
      factors.push('External dependencies');
    }

    const threshold = node.node_config.threshold || 0.7;
    
    if (riskScore <= threshold) {
      result.score = 1.0 - riskScore;
    } else {
      result.score = 0.3;
      result.triggered = true;
      result.risk_factors.push(...factors);
    }

    return result;
  }

  /**
   * Calculate final score using weighted graph traversal
   */
  private calculateFinalScore(graph: any, evaluationResults: Map<string, any>): number {
    // Find gate nodes (final decision points)
    const gateNodes = Array.from(graph.nodes.values())
      .filter(node => node.node_type === 'gate');

    if (gateNodes.length === 0) {
      // No gates, use simple average
      const scores = Array.from(evaluationResults.values()).map(r => r.score);
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    // Use gate node evaluation
    const gateNode = gateNodes[0]; // Use first gate node
    const gateId = gateNode.id;

    // Get all edges leading to this gate
    const incomingEdges = Array.from(graph.edges.values())
      .filter(edge => edge.to_node_id === gateId);

    if (incomingEdges.length === 0) {
      return 0.5; // Default neutral score
    }

    // Calculate weighted average
    let totalWeight = 0;
    let weightedSum = 0;

    incomingEdges.forEach(edge => {
      const nodeResult = evaluationResults.get(edge.from_node_id);
      if (nodeResult) {
        const weight = edge.edge_weight;
        weightedSum += nodeResult.score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  }

  /**
   * Calculate policy hash for audit trail
   */
  private async calculatePolicyHash(nodes: PolicyNode[], edges: PolicyEdge[]): Promise<string> {
    const policyData = {
      nodes: nodes.map(n => ({ id: n.id, name: n.node_name, config: n.node_config })),
      edges: edges.map(e => ({ from: e.from_node_id, to: e.to_node_id, weight: e.edge_weight }))
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(policyData));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get policy evaluation history
   */
  async getPolicyEvaluationHistory(tenantId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('approvals')
      .select(`
        *,
        execution_plans (
          plan_title,
          executive_role,
          status
        )
      `)
      .eq('approver_role', 'clo')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}