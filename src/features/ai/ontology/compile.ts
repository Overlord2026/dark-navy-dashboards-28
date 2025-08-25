import * as yaml from 'js-yaml';

export type OntologyEntity = {
  [key: string]: any;
};

export type OntologyRelation = {
  from: string;
  to: string;
};

export type OntologySchema = {
  entities: Record<string, OntologyEntity>;
  relations: Record<string, OntologyRelation>;
};

export function compile(yamlString: string): OntologySchema {
  try {
    const parsed = yaml.load(yamlString) as OntologySchema;
    
    if (!parsed.entities || !parsed.relations) {
      throw new Error('Invalid ontology: missing entities or relations');
    }
    
    // Validate relations reference valid entities
    for (const [relationName, relation] of Object.entries(parsed.relations)) {
      if (!parsed.entities[relation.from]) {
        throw new Error(`Relation ${relationName}: entity ${relation.from} not found`);
      }
      if (!parsed.entities[relation.to]) {
        throw new Error(`Relation ${relationName}: entity ${relation.to} not found`);
      }
    }
    
    console.log('[AI Ontology] Compiled schema:', {
      entities: Object.keys(parsed.entities),
      relations: Object.keys(parsed.relations)
    });
    
    return parsed;
  } catch (error) {
    console.error('[AI Ontology] Compilation error:', error);
    throw error;
  }
}

// Generated TypeScript types (in production, this would be auto-generated)
export type Household = {
  id: string;
  members: string[];
  advisorId: string;
};

export type Account = {
  id: string;
  type: '401k' | 'IRA' | 'Taxable';
  owner: string;
  provider: string;
};

export type Plan = {
  id: string;
  provider: string;
  sdb: boolean;
};

export type Task = {
  id: string;
  subject: string;
  due: string;
  status: 'open' | 'done';
};

export type Document = {
  id: string;
  kind: string;
  fileId: string;
};

// Type registry for runtime validation
export const ENTITY_TYPES = {
  Household: 'Household',
  Account: 'Account', 
  Plan: 'Plan',
  Task: 'Task',
  Document: 'Document'
} as const;

export type EntityType = keyof typeof ENTITY_TYPES;