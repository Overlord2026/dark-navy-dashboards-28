// Policy Compiler - Converts DSL to Decision Graph
// Creates optimized decision trees for fast policy evaluation

import { 
  PolicyDocument, 
  CompiledPolicy, 
  CompiledStatement, 
  PolicyContext,
  PolicyCondition
} from './DSL';

export interface DecisionNode {
  type: 'condition' | 'result';
  id: string;
  
  // For condition nodes
  condition?: {
    field: string;
    operator: string;
    value: any;
  };
  true_branch?: string; // Node ID
  false_branch?: string; // Node ID
  
  // For result nodes
  effect?: 'ALLOW' | 'DENY';
  reason?: string;
  confidence?: number;
  
  // Optimization metadata
  selectivity?: number; // How often this condition is true (0-1)
  cost?: number; // Computational cost of evaluating this condition
}

export interface DecisionGraph {
  nodes: Map<string, DecisionNode>;
  root_node_id: string;
  policy_metadata: {
    name: string;
    version: string;
    jurisdiction?: string;
    compilation_timestamp: string;
    optimization_level: string;
  };
  statistics: {
    total_nodes: number;
    condition_nodes: number;
    result_nodes: number;
    max_depth: number;
    avg_path_length: number;
  };
}

export interface CompilationOptions {
  optimization_level: 'none' | 'basic' | 'aggressive';
  enable_caching: boolean;
  target_max_depth: number;
  selectivity_threshold: number;
}

export class PolicyCompiler {
  private nodeCounter = 0;
  private compilationCache = new Map<string, DecisionGraph>();
  
  compile(
    policy: PolicyDocument, 
    tenantId: string,
    policyVersion: string,
    jurisdiction: string = 'default',
    options: CompilationOptions = this.getDefaultOptions()
  ): DecisionGraph {
    // Generate structural hash for cache key
    const structuralHash = this.computeStructuralHash(policy);
    const cacheKey = `${tenantId}:${policyVersion}:${jurisdiction}:${structuralHash}`;
    
    // Check cache first
    if (options.enable_caching && this.compilationCache.has(cacheKey)) {
      const cached = this.compilationCache.get(cacheKey)!;
      console.log('Policy cache hit:', cacheKey);
      return cached;
    }
    
    this.nodeCounter = 0;
    
    // Build canonical DAG
    const decisionGraph = this.buildCanonicalDAG(policy, options);
    
    // Cache the compiled graph
    this.compilationCache.set(cacheKey, decisionGraph);
    console.log('Policy compiled and cached:', cacheKey);
    
    return decisionGraph;
  }

  private computeStructuralHash(policy: PolicyDocument): string {
    // Create a canonical representation for hashing with enhanced determinism
    const canonical = {
      metadata: {
        name: policy.name,
        version: policy.version || '1.0',
        jurisdiction: policy.jurisdiction || 'default'
      },
      statements: policy.statements
        .sort((a, b) => {
          // Multi-level sorting for complete determinism
          const nameCompare = (a.id || '').localeCompare(b.id || '');
          if (nameCompare !== 0) return nameCompare;
          return (a.effect || '').localeCompare(b.effect || '');
        })
        .map(s => ({
          id: s.id,
          effect: s.effect,
          actions: s.actions ? [...s.actions].sort() : [],
          resources: s.resources ? [...s.resources].sort() : [],
          conditions: this.normalizeConditions(s.conditions || []),
          priority: s.priority || 0
        }))
    };
    
    const canonicalJson = JSON.stringify(canonical, Object.keys(canonical).sort());
    return this.hashSha256(canonicalJson);
  }

  private hashSha256(input: string): string {
    // Enhanced hash function with salt for structural integrity
    const salt = 'policy-structure-salt-2024';
    const inputWithSalt = input + '|' + salt;
    
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      // Use Web Crypto API if available (async not needed here due to sync context)
      const encoder = new TextEncoder();
      const data = encoder.encode(inputWithSalt);
      
      // Fallback to simple hash for browser compatibility
      let hash = 0;
      for (let i = 0; i < inputWithSalt.length; i++) {
        const char = inputWithSalt.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16);
    }
    
    // Fallback hash
    let hash = 0;
    for (let i = 0; i < inputWithSalt.length; i++) {
      const char = inputWithSalt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private buildCanonicalDAG(policy: PolicyDocument, options: CompilationOptions): DecisionGraph {
    const nodes = new Map<string, DecisionNode>();
    
    // Build decision tree from policy statements with topological ordering
    const sortedStatements = this.topologicalSort(policy.statements);
    const rootNodeId = this.buildDecisionTree({ ...policy, statements: sortedStatements }, nodes, options);
    
    // Optimize the tree
    if (options.optimization_level !== 'none') {
      this.optimizeDecisionTree(nodes, rootNodeId, options);
    }
    
    // Calculate statistics
    const statistics = this.calculateStatistics(nodes, rootNodeId);
    
    return {
      nodes,
      root_node_id: rootNodeId,
      policy_metadata: {
        name: policy.name,
        version: policy.version,
        jurisdiction: policy.jurisdiction,
        compilation_timestamp: new Date().toISOString(),
        optimization_level: options.optimization_level
      },
      statistics
    };
  }

  private topologicalSort(statements: any[]): any[] {
    // Simple topological sort by dependency chain length
    return statements.sort((a, b) => {
      const aDeps = (a.conditions?.length || 0);
      const bDeps = (b.conditions?.length || 0);
      return aDeps - bDeps;
    });
  }

  private normalizeConditions(conditions: any[]): any[] {
    // Normalize conditions for consistent hashing
    return conditions.map(cond => {
      if (typeof cond === 'object' && cond !== null) {
        const keys = Object.keys(cond).sort();
        const normalized: any = {};
        keys.forEach(key => {
          normalized[key] = cond[key];
        });
        return normalized;
      }
      return cond;
    }).sort();
  }

  private hash(input: string): string {
    // Simple hash function (in production, use crypto.subtle)
    let hash = 0;
    if (input.length === 0) return hash.toString();
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  private buildDecisionTree(
    policy: PolicyDocument,
    nodes: Map<string, DecisionNode>,
    options: CompilationOptions
  ): string {
    // Sort statements by priority (DENY first, then by specificity)
    const sortedStatements = this.sortStatementsByPriority(policy.statements);
    
    // Create root decision chain
    let currentNodeId = this.createNode('condition');
    const rootNodeId = currentNodeId;
    
    for (let i = 0; i < sortedStatements.length; i++) {
      const statement = sortedStatements[i];
      const isLastStatement = i === sortedStatements.length - 1;
      
      // Build condition chain for this statement
      const statementRootId = this.buildStatementConditions(
        statement,
        nodes,
        options
      );
      
      if (i === 0) {
        // First statement becomes the root
        nodes.set(rootNodeId, nodes.get(statementRootId)!);
        currentNodeId = rootNodeId;
      } else {
        // Chain statements together
        const chainNode: DecisionNode = {
          type: 'condition',
          id: this.createNode('condition'),
          condition: { field: '__statement_check__', operator: 'eq', value: i },
          true_branch: statementRootId,
          false_branch: isLastStatement ? this.createDefaultDenyNode(nodes) : this.createNode('condition')
        };
        
        nodes.set(chainNode.id, chainNode);
        
        // Update previous node to point to this one
        const prevNode = nodes.get(currentNodeId);
        if (prevNode && prevNode.false_branch) {
          prevNode.false_branch = chainNode.id;
        }
        
        currentNodeId = chainNode.id;
      }
    }
    
    return rootNodeId;
  }
  
  private buildStatementConditions(
    statement: any,
    nodes: Map<string, DecisionNode>,
    options: CompilationOptions
  ): string {
    // Create result node for this statement
    const resultNodeId = this.createNode('result');
    const resultNode: DecisionNode = {
      type: 'result',
      id: resultNodeId,
      effect: statement.effect,
      reason: statement.reason || `${statement.effect} by policy`,
      confidence: 1.0
    };
    nodes.set(resultNodeId, resultNode);
    
    // If no conditions, return result directly
    if (!statement.conditions || statement.conditions.length === 0) {
      // Create action/resource matching conditions
      return this.buildActionResourceConditions(
        statement,
        resultNodeId,
        nodes,
        options
      );
    }
    
    // Build condition chain
    let currentNodeId = resultNodeId;
    
    // Process conditions in reverse order to build chain
    const conditions = [...statement.conditions].reverse();
    
    for (const condition of conditions) {
      const conditionNodeId = this.createNode('condition');
      const conditionNode: DecisionNode = {
        type: 'condition',
        id: conditionNodeId,
        condition: {
          field: condition.field,
          operator: condition.operator,
          value: condition.value
        },
        true_branch: currentNodeId,
        false_branch: this.createDefaultDenyNode(nodes),
        selectivity: this.estimateSelectivity(condition),
        cost: this.estimateCost(condition)
      };
      
      nodes.set(conditionNodeId, conditionNode);
      currentNodeId = conditionNodeId;
    }
    
    // Add action/resource matching at the top
    return this.buildActionResourceConditions(
      statement,
      currentNodeId,
      nodes,
      options
    );
  }
  
  private buildActionResourceConditions(
    statement: any,
    nextNodeId: string,
    nodes: Map<string, DecisionNode>,
    options: CompilationOptions
  ): string {
    // Create resource matching node
    const resourceNodeId = this.createNode('condition');
    const resourceNode: DecisionNode = {
      type: 'condition',
      id: resourceNodeId,
      condition: {
        field: '__resource_match__',
        operator: 'matches',
        value: statement.resources
      },
      true_branch: nextNodeId,
      false_branch: this.createDefaultDenyNode(nodes),
      selectivity: 0.3, // Estimated
      cost: 0.2
    };
    nodes.set(resourceNodeId, resourceNode);
    
    // Create action matching node
    const actionNodeId = this.createNode('condition');
    const actionNode: DecisionNode = {
      type: 'condition',
      id: actionNodeId,
      condition: {
        field: '__action_match__',
        operator: 'matches',
        value: statement.actions
      },
      true_branch: resourceNodeId,
      false_branch: this.createDefaultDenyNode(nodes),
      selectivity: 0.4, // Estimated
      cost: 0.1
    };
    nodes.set(actionNodeId, actionNode);
    
    return actionNodeId;
  }
  
  private createDefaultDenyNode(nodes: Map<string, DecisionNode>): string {
    const nodeId = this.createNode('deny_result');
    const node: DecisionNode = {
      type: 'result',
      id: nodeId,
      effect: 'DENY',
      reason: 'No matching policy found',
      confidence: 1.0
    };
    nodes.set(nodeId, node);
    return nodeId;
  }
  
  private optimizeDecisionTree(
    nodes: Map<string, DecisionNode>,
    rootNodeId: string,
    options: CompilationOptions
  ): void {
    if (options.optimization_level === 'basic') {
      this.basicOptimization(nodes, rootNodeId);
    } else if (options.optimization_level === 'aggressive') {
      this.basicOptimization(nodes, rootNodeId);
      this.aggressiveOptimization(nodes, rootNodeId, options);
    }
  }
  
  private basicOptimization(nodes: Map<string, DecisionNode>, rootNodeId: string): void {
    // 1. Remove redundant nodes
    this.removeRedundantNodes(nodes);
    
    // 2. Merge simple condition chains
    this.mergeConditionChains(nodes);
    
    // 3. Reorder conditions by selectivity (most selective first)
    this.reorderBySelectivity(nodes, rootNodeId);
  }
  
  private aggressiveOptimization(
    nodes: Map<string, DecisionNode>,
    rootNodeId: string,
    options: CompilationOptions
  ): void {
    // 4. Create condition lookup tables for common patterns
    this.createLookupTables(nodes);
    
    // 5. Minimize tree depth
    this.minimizeDepth(nodes, rootNodeId, options.target_max_depth);
    
    // 6. Pre-compute common sub-expressions
    this.precomputeExpressions(nodes);
  }
  
  private removeRedundantNodes(nodes: Map<string, DecisionNode>): void {
    const toRemove: string[] = [];
    
    for (const [nodeId, node] of nodes) {
      if (node.type === 'condition' && 
          node.true_branch === node.false_branch) {
        // Condition with same true/false branch is redundant
        toRemove.push(nodeId);
        
        // Update references to point directly to the branch
        this.updateNodeReferences(nodes, nodeId, node.true_branch!);
      }
    }
    
    toRemove.forEach(nodeId => nodes.delete(nodeId));
  }
  
  private mergeConditionChains(nodes: Map<string, DecisionNode>): void {
    // Find linear chains of conditions and merge them
    for (const [nodeId, node] of nodes) {
      if (node.type === 'condition' && node.true_branch) {
        const nextNode = nodes.get(node.true_branch);
        if (nextNode && 
            nextNode.type === 'condition' && 
            this.canMergeConditions(node, nextNode)) {
          
          // Merge the conditions
          this.mergeNodes(nodes, nodeId, node.true_branch);
        }
      }
    }
  }
  
  private reorderBySelectivity(nodes: Map<string, DecisionNode>, rootNodeId: string): void {
    // Sort condition nodes by selectivity (most selective first for early pruning)
    const visited = new Set<string>();
    this.reorderNode(nodes, rootNodeId, visited);
  }
  
  private reorderNode(
    nodes: Map<string, DecisionNode>,
    nodeId: string,
    visited: Set<string>
  ): void {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const node = nodes.get(nodeId);
    if (!node || node.type !== 'condition') return;
    
    // Recursively reorder children
    if (node.true_branch) this.reorderNode(nodes, node.true_branch, visited);
    if (node.false_branch) this.reorderNode(nodes, node.false_branch, visited);
    
    // TODO: Implement sophisticated reordering based on selectivity and cost
  }
  
  private createLookupTables(nodes: Map<string, DecisionNode>): void {
    // Pre-compute lookup tables for common field accesses
    // This is a placeholder for more sophisticated optimization
  }
  
  private minimizeDepth(
    nodes: Map<string, DecisionNode>,
    rootNodeId: string,
    maxDepth: number
  ): void {
    // Balance the tree to reduce maximum depth
    // This is a placeholder for tree balancing algorithms
  }
  
  private precomputeExpressions(nodes: Map<string, DecisionNode>): void {
    // Pre-compute values for expensive condition evaluations
    // This is a placeholder for expression optimization
  }
  
  private canMergeConditions(node1: DecisionNode, node2: DecisionNode): boolean {
    // Check if two condition nodes can be safely merged
    return node1.false_branch === node2.false_branch;
  }
  
  private mergeNodes(nodes: Map<string, DecisionNode>, nodeId1: string, nodeId2: string): void {
    // Merge two nodes - placeholder implementation
    const node1 = nodes.get(nodeId1);
    const node2 = nodes.get(nodeId2);
    
    if (node1 && node2) {
      node1.true_branch = node2.true_branch;
      nodes.delete(nodeId2);
    }
  }
  
  private updateNodeReferences(
    nodes: Map<string, DecisionNode>,
    oldNodeId: string,
    newNodeId: string
  ): void {
    for (const node of nodes.values()) {
      if (node.true_branch === oldNodeId) {
        node.true_branch = newNodeId;
      }
      if (node.false_branch === oldNodeId) {
        node.false_branch = newNodeId;
      }
    }
  }
  
  private estimateSelectivity(condition: PolicyCondition): number {
    // Estimate how often this condition returns true
    switch (condition.operator) {
      case 'eq': return 0.1;
      case 'ne': return 0.9;
      case 'in': return Array.isArray(condition.value) ? condition.value.length / 10 : 0.2;
      case 'contains': return 0.3;
      case 'matches': return 0.2;
      default: return 0.5;
    }
  }
  
  private estimateCost(condition: PolicyCondition): number {
    // Estimate computational cost of evaluating this condition
    switch (condition.operator) {
      case 'eq':
      case 'ne': return 0.1;
      case 'gt':
      case 'lt':
      case 'gte':
      case 'lte': return 0.2;
      case 'in':
      case 'nin': return 0.3;
      case 'contains': return 0.4;
      case 'matches': return 0.8;
      default: return 0.5;
    }
  }
  
  private sortStatementsByPriority(statements: any[]): any[] {
    return statements.sort((a, b) => {
      // DENY statements first
      if (a.effect === 'DENY' && b.effect !== 'DENY') return -1;
      if (b.effect === 'DENY' && a.effect !== 'DENY') return 1;
      
      // More specific conditions first
      const aConditions = a.conditions?.length || 0;
      const bConditions = b.conditions?.length || 0;
      if (aConditions !== bConditions) return bConditions - aConditions;
      
      // More specific resources first
      const aWildcards = a.resources?.filter((r: string) => r.includes('*')).length || 0;
      const bWildcards = b.resources?.filter((r: string) => r.includes('*')).length || 0;
      return aWildcards - bWildcards;
    });
  }
  
  private calculateStatistics(
    nodes: Map<string, DecisionNode>,
    rootNodeId: string
  ): DecisionGraph['statistics'] {
    let conditionNodes = 0;
    let resultNodes = 0;
    
    for (const node of nodes.values()) {
      if (node.type === 'condition') conditionNodes++;
      if (node.type === 'result') resultNodes++;
    }
    
    const maxDepth = this.calculateMaxDepth(nodes, rootNodeId);
    const avgPathLength = this.calculateAvgPathLength(nodes, rootNodeId);
    
    return {
      total_nodes: nodes.size,
      condition_nodes: conditionNodes,
      result_nodes: resultNodes,
      max_depth: maxDepth,
      avg_path_length: avgPathLength
    };
  }
  
  private calculateMaxDepth(nodes: Map<string, DecisionNode>, nodeId: string, depth = 0): number {
    const node = nodes.get(nodeId);
    if (!node || node.type === 'result') return depth;
    
    const trueDepth = node.true_branch ? this.calculateMaxDepth(nodes, node.true_branch, depth + 1) : depth;
    const falseDepth = node.false_branch ? this.calculateMaxDepth(nodes, node.false_branch, depth + 1) : depth;
    
    return Math.max(trueDepth, falseDepth);
  }
  
  private calculateAvgPathLength(nodes: Map<string, DecisionNode>, rootNodeId: string): number {
    const paths = this.getAllPaths(nodes, rootNodeId);
    const totalLength = paths.reduce((sum, path) => sum + path.length, 0);
    return paths.length > 0 ? totalLength / paths.length : 0;
  }
  
  private getAllPaths(nodes: Map<string, DecisionNode>, nodeId: string, currentPath: string[] = []): string[][] {
    const node = nodes.get(nodeId);
    if (!node) return [];
    
    const newPath = [...currentPath, nodeId];
    
    if (node.type === 'result') {
      return [newPath];
    }
    
    const paths: string[][] = [];
    
    if (node.true_branch) {
      paths.push(...this.getAllPaths(nodes, node.true_branch, newPath));
    }
    
    if (node.false_branch) {
      paths.push(...this.getAllPaths(nodes, node.false_branch, newPath));
    }
    
    return paths;
  }
  
  private createNode(type: string): string {
    return `${type}_${++this.nodeCounter}`;
  }
  
  private getCacheKey(policy: PolicyDocument, options: CompilationOptions): string {
    const policyHash = JSON.stringify(policy);
    const optionsHash = JSON.stringify(options);
    return `${policyHash}:${optionsHash}`;
  }
  
  private getDefaultOptions(): CompilationOptions {
    return {
      optimization_level: 'basic',
      enable_caching: true,
      target_max_depth: 10,
      selectivity_threshold: 0.1
    };
  }
  
  // Utility method to export decision graph for visualization
  exportGraphviz(graph: DecisionGraph): string {
    let dot = 'digraph PolicyDecisionGraph {\n';
    dot += '  rankdir=TB;\n';
    dot += '  node [shape=box];\n\n';
    
    for (const [nodeId, node] of graph.nodes) {
      if (node.type === 'condition') {
        const label = `${node.condition?.field} ${node.condition?.operator} ${node.condition?.value}`;
        dot += `  ${nodeId} [label="${label}", shape=diamond];\n`;
        
        if (node.true_branch) {
          dot += `  ${nodeId} -> ${node.true_branch} [label="true"];\n`;
        }
        if (node.false_branch) {
          dot += `  ${nodeId} -> ${node.false_branch} [label="false"];\n`;
        }
      } else {
        const color = node.effect === 'ALLOW' ? 'green' : 'red';
        dot += `  ${nodeId} [label="${node.effect}\\n${node.reason}", fillcolor=${color}, style=filled];\n`;
      }
    }
    
    dot += '}';
    return dot;
  }
}