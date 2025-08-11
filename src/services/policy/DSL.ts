// Policy DSL for Declarative Access Control
// Supports ALLOW, DENY, WHEN, JURISDICTION, REASON syntax

export interface PolicyStatement {
  id?: string;
  effect: 'ALLOW' | 'DENY';
  actions: string[];
  resources: string[];
  conditions?: PolicyCondition[];
  jurisdiction?: string;
  reason?: string;
  priority?: number;
}

export interface PolicyCondition {
  type: 'WHEN' | 'IF' | 'UNLESS';
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'contains' | 'matches';
  value: any;
  logical?: 'AND' | 'OR';
}

export interface PolicyDocument {
  name: string;
  version: string;
  jurisdiction?: string;
  statements: PolicyStatement[];
  metadata?: Record<string, any>;
}

export interface PolicyContext {
  user_id: string;
  tenant_id: string;
  persona: string;
  roles: string[];
  time: number;
  ip_address?: string;
  session_id?: string;
  compliance_status?: Record<string, any>;
  resource_attributes?: Record<string, any>;
}

export class PolicyDSL {
  private policies: Map<string, PolicyDocument> = new Map();
  
  // DSL Builder Methods
  static createPolicy(name: string, version = '1.0'): PolicyBuilder {
    return new PolicyBuilder(name, version);
  }
  
  // Parse DSL from JSON
  parsePolicy(policyJson: any): PolicyDocument {
    this.validatePolicyStructure(policyJson);
    
    const policy: PolicyDocument = {
      name: policyJson.name,
      version: policyJson.version || '1.0',
      jurisdiction: policyJson.jurisdiction,
      statements: policyJson.statements.map((stmt: any) => this.parseStatement(stmt)),
      metadata: policyJson.metadata || {}
    };
    
    return policy;
  }
  
  // Convert DSL to executable format
  compilePolicy(policy: PolicyDocument): CompiledPolicy {
    const compiledStatements = policy.statements.map(stmt => {
      return {
        effect: stmt.effect,
        actions: this.compileStringPattern(stmt.actions),
        resources: this.compileStringPattern(stmt.resources),
        conditions: stmt.conditions?.map(cond => this.compileCondition(cond)) || [],
        jurisdiction: stmt.jurisdiction,
        reason: stmt.reason,
        priority: this.calculatePriority(stmt)
      };
    });
    
    // Sort by priority (DENY statements typically have higher priority)
    compiledStatements.sort((a, b) => b.priority - a.priority);
    
    return {
      name: policy.name,
      version: policy.version,
      jurisdiction: policy.jurisdiction,
      statements: compiledStatements,
      metadata: policy.metadata || {}
    };
  }
  
  private parseStatement(stmtJson: any): PolicyStatement {
    if (!stmtJson.effect || !['ALLOW', 'DENY'].includes(stmtJson.effect)) {
      throw new Error('Policy statement must have ALLOW or DENY effect');
    }
    
    return {
      effect: stmtJson.effect,
      actions: Array.isArray(stmtJson.actions) ? stmtJson.actions : [stmtJson.actions],
      resources: Array.isArray(stmtJson.resources) ? stmtJson.resources : [stmtJson.resources],
      conditions: stmtJson.conditions?.map((cond: any) => this.parseCondition(cond)),
      jurisdiction: stmtJson.jurisdiction,
      reason: stmtJson.reason
    };
  }
  
  private parseCondition(condJson: any): PolicyCondition {
    return {
      type: condJson.type || 'WHEN',
      field: condJson.field,
      operator: condJson.operator,
      value: condJson.value,
      logical: condJson.logical
    };
  }
  
  private compileStringPattern(patterns: string[]): CompiledPattern[] {
    return patterns.map(pattern => {
      if (pattern.includes('*')) {
        // Wildcard pattern
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return { type: 'regex', pattern: regex };
      } else {
        // Exact match
        return { type: 'exact', pattern };
      }
    });
  }
  
  private compileCondition(condition: PolicyCondition): CompiledCondition {
    return {
      field: condition.field,
      operator: condition.operator,
      value: condition.value,
      logical: condition.logical || 'AND',
      evaluator: this.createConditionEvaluator(condition)
    };
  }
  
  private createConditionEvaluator(condition: PolicyCondition): (context: PolicyContext) => boolean {
    return (context: PolicyContext) => {
      const fieldValue = this.getFieldValue(context, condition.field);
      
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
          return new RegExp(condition.value).test(String(fieldValue));
        default:
          throw new Error(`Unknown operator: ${condition.operator}`);
      }
    };
  }
  
  private getFieldValue(context: PolicyContext, field: string): any {
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
  
  private calculatePriority(statement: PolicyStatement): number {
    let priority = 0;
    
    // DENY statements have higher priority
    if (statement.effect === 'DENY') {
      priority += 1000;
    }
    
    // More specific actions have higher priority
    priority += statement.actions.filter(action => !action.includes('*')).length * 10;
    
    // More specific resources have higher priority
    priority += statement.resources.filter(resource => !resource.includes('*')).length * 10;
    
    // More conditions generally mean higher priority
    priority += (statement.conditions?.length || 0) * 5;
    
    return priority;
  }
  
  private validatePolicyStructure(policyJson: any): void {
    if (!policyJson.name) {
      throw new Error('Policy must have a name');
    }
    
    if (!Array.isArray(policyJson.statements)) {
      throw new Error('Policy must have statements array');
    }
    
    for (const stmt of policyJson.statements) {
      if (!stmt.effect || !['ALLOW', 'DENY'].includes(stmt.effect)) {
        throw new Error('Statement must have ALLOW or DENY effect');
      }
      
      if (!stmt.actions) {
        throw new Error('Statement must specify actions');
      }
      
      if (!stmt.resources) {
        throw new Error('Statement must specify resources');
      }
    }
  }
}

// Builder class for fluent DSL construction
export class PolicyBuilder {
  private policy: PolicyDocument;
  private currentStatement?: PolicyStatement;
  
  constructor(name: string, version: string) {
    this.policy = {
      name,
      version,
      statements: []
    };
  }
  
  jurisdiction(jurisdiction: string): PolicyBuilder {
    this.policy.jurisdiction = jurisdiction;
    return this;
  }
  
  allow(actions: string | string[]): StatementBuilder {
    this.currentStatement = {
      effect: 'ALLOW',
      actions: Array.isArray(actions) ? actions : [actions],
      resources: []
    };
    return new StatementBuilder(this, this.currentStatement);
  }
  
  deny(actions: string | string[]): StatementBuilder {
    this.currentStatement = {
      effect: 'DENY',
      actions: Array.isArray(actions) ? actions : [actions],
      resources: []
    };
    return new StatementBuilder(this, this.currentStatement);
  }
  
  addStatement(statement: PolicyStatement): PolicyBuilder {
    this.policy.statements.push(statement);
    return this;
  }
  
  build(): PolicyDocument {
    if (this.currentStatement) {
      this.policy.statements.push(this.currentStatement);
    }
    return this.policy;
  }
}

export class StatementBuilder {
  constructor(
    private policyBuilder: PolicyBuilder,
    private statement: PolicyStatement
  ) {}
  
  on(resources: string | string[]): StatementBuilder {
    this.statement.resources = Array.isArray(resources) ? resources : [resources];
    return this;
  }
  
  when(field: string, operator: string, value: any): StatementBuilder {
    if (!this.statement.conditions) {
      this.statement.conditions = [];
    }
    
    this.statement.conditions.push({
      type: 'WHEN',
      field,
      operator: operator as any,
      value
    });
    
    return this;
  }
  
  and(field: string, operator: string, value: any): StatementBuilder {
    if (!this.statement.conditions) {
      this.statement.conditions = [];
    }
    
    this.statement.conditions.push({
      type: 'WHEN',
      field,
      operator: operator as any,
      value,
      logical: 'AND'
    });
    
    return this;
  }
  
  or(field: string, operator: string, value: any): StatementBuilder {
    if (!this.statement.conditions) {
      this.statement.conditions = [];
    }
    
    this.statement.conditions.push({
      type: 'WHEN',
      field,
      operator: operator as any,
      value,
      logical: 'OR'
    });
    
    return this;
  }
  
  jurisdiction(jurisdiction: string): StatementBuilder {
    this.statement.jurisdiction = jurisdiction;
    return this;
  }
  
  reason(reason: string): StatementBuilder {
    this.statement.reason = reason;
    return this;
  }
  
  allow(actions: string | string[]): StatementBuilder {
    return this.policyBuilder.allow(actions);
  }
  
  deny(actions: string | string[]): StatementBuilder {
    return this.policyBuilder.deny(actions);
  }
  
  build(): PolicyDocument {
    return this.policyBuilder.build();
  }
}

// Compiled policy interfaces
export interface CompiledPolicy {
  name: string;
  version: string;
  jurisdiction?: string;
  statements: CompiledStatement[];
  metadata: Record<string, any>;
}

export interface CompiledStatement {
  effect: 'ALLOW' | 'DENY';
  actions: CompiledPattern[];
  resources: CompiledPattern[];
  conditions: CompiledCondition[];
  jurisdiction?: string;
  reason?: string;
  priority: number;
}

export interface CompiledPattern {
  type: 'exact' | 'regex';
  pattern: string | RegExp;
}

export interface CompiledCondition {
  field: string;
  operator: string;
  value: any;
  logical: 'AND' | 'OR';
  evaluator: (context: PolicyContext) => boolean;
}

// Example policies
export const SAMPLE_POLICIES = {
  advisor_access: {
    name: 'advisor_access_policy',
    version: '1.0',
    jurisdiction: 'US',
    statements: [
      {
        effect: 'ALLOW',
        actions: ['read', 'write'],
        resources: ['portfolio/*', 'client/*'],
        conditions: [
          {
            type: 'WHEN',
            field: 'persona',
            operator: 'eq',
            value: 'advisor'
          },
          {
            type: 'WHEN',
            field: 'compliance_status.license_active',
            operator: 'eq',
            value: true,
            logical: 'AND'
          }
        ],
        reason: 'Licensed advisors can access portfolio and client data'
      },
      {
        effect: 'DENY',
        actions: ['*'],
        resources: ['admin/*'],
        conditions: [
          {
            type: 'WHEN',
            field: 'persona',
            operator: 'eq',
            value: 'advisor'
          }
        ],
        reason: 'Advisors cannot access admin functions'
      }
    ]
  },
  
  client_access: {
    name: 'client_access_policy',
    version: '1.0',
    statements: [
      {
        effect: 'ALLOW',
        actions: ['read'],
        resources: ['portfolio/own', 'goals/*', 'reports/own'],
        conditions: [
          {
            type: 'WHEN',
            field: 'persona',
            operator: 'eq',
            value: 'client'
          }
        ],
        reason: 'Clients can view their own data'
      },
      {
        effect: 'DENY',
        actions: ['write', 'delete'],
        resources: ['portfolio/*'],
        conditions: [
          {
            type: 'WHEN',
            field: 'persona',
            operator: 'eq',
            value: 'client'
          }
        ],
        reason: 'Clients cannot modify portfolio data directly'
      }
    ]
  }
};