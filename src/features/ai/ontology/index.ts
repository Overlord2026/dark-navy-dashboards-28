import { compile, type OntologySchema } from './compile';

// Load the ontology schema
const ontologyYaml = `
entities:
  Household: 
    id: string
    members: string[]
    advisorId: string
  Account:   
    id: string
    type: '401k' | 'IRA' | 'Taxable'
    owner: string
    provider: string
  Plan:      
    id: string
    provider: string
    sdb: boolean
  Task:      
    id: string
    subject: string
    due: string
    status: 'open' | 'done'
  Document:  
    id: string
    kind: string
    fileId: string

relations:
  Household-has-Account: 
    from: Household
    to: Account
  Account-in-Plan:       
    from: Account
    to: Plan
  Task-for-Household:    
    from: Task
    to: Household
`;

let compiledSchema: OntologySchema;

export function getOntology(): OntologySchema {
  if (!compiledSchema) {
    compiledSchema = compile(ontologyYaml);
  }
  return compiledSchema;
}

export function getEntityDefinition(entityName: string) {
  const schema = getOntology();
  return schema.entities[entityName];
}

export function getRelationDefinition(relationName: string) {
  const schema = getOntology();
  return schema.relations[relationName];
}

export function validateEntity(entityName: string, data: any): boolean {
  const definition = getEntityDefinition(entityName);
  if (!definition) {
    throw new Error(`Unknown entity type: ${entityName}`);
  }
  
  // Basic validation (in production, use proper schema validation)
  const requiredFields = Object.keys(definition);
  const providedFields = Object.keys(data);
  
  for (const field of requiredFields) {
    if (!providedFields.includes(field)) {
      console.warn(`Missing required field ${field} for entity ${entityName}`);
      return false;
    }
  }
  
  return true;
}

export function getRelatedEntities(entityType: string): string[] {
  const schema = getOntology();
  const related: string[] = [];
  
  for (const [relationName, relation] of Object.entries(schema.relations)) {
    if (relation.from === entityType) {
      related.push(relation.to);
    }
    if (relation.to === entityType) {
      related.push(relation.from);
    }
  }
  
  return [...new Set(related)];
}