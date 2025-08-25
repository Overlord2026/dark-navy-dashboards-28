import yaml from 'js-yaml';

export interface EntityDef {
  [key: string]: {
    [property: string]: string;
  };
}

export interface RelationDef {
  from: string;
  to: string;
  relationship: string;
}

export interface WorkflowDef {
  trigger: string;
  steps: string[];
}

export interface OntologySchema {
  entities: EntityDef;
  relations: { [key: string]: RelationDef };
  workflows?: { [key: string]: WorkflowDef };
}

// TypeScript type generators from ontology
export function generateTypes(ontology: OntologySchema): string {
  let types = '// Auto-generated types from ontology\n\n';
  
  // Generate entity interfaces
  for (const [entityName, properties] of Object.entries(ontology.entities)) {
    types += `export interface ${entityName} {\n`;
    for (const [prop, type] of Object.entries(properties)) {
      types += `  ${prop}: ${type};\n`;
    }
    types += '}\n\n';
  }
  
  // Generate relation types
  types += 'export interface Relations {\n';
  for (const [relationName, relation] of Object.entries(ontology.relations)) {
    types += `  '${relationName}': {\n`;
    types += `    from: ${relation.from};\n`;
    types += `    to: ${relation.to};\n`;
    types += `    relationship: '${relation.relationship}';\n`;
    types += '  };\n';
  }
  types += '}\n\n';
  
  // Generate workflow types
  if (ontology.workflows) {
    types += 'export interface Workflows {\n';
    for (const [workflowName, workflow] of Object.entries(ontology.workflows)) {
      types += `  '${workflowName}': {\n`;
      types += `    trigger: '${workflow.trigger}';\n`;
      types += `    steps: [${workflow.steps.map(s => `'${s}'`).join(', ')}];\n`;
      types += '  };\n';
    }
    types += '}\n\n';
  }
  
  return types;
}

export function compile(yamlContent: string): OntologySchema {
  try {
    const ontology = yaml.load(yamlContent) as OntologySchema;
    return ontology;
  } catch (error) {
    throw new Error(`Failed to parse ontology YAML: ${error}`);
  }
}

export function validateOntology(ontology: OntologySchema): string[] {
  const errors: string[] = [];
  
  // Validate entities
  if (!ontology.entities || Object.keys(ontology.entities).length === 0) {
    errors.push('Ontology must define at least one entity');
  }
  
  // Validate relations reference valid entities
  if (ontology.relations) {
    const entityNames = Object.keys(ontology.entities);
    for (const [relationName, relation] of Object.entries(ontology.relations)) {
      if (relation.to !== '*' && !entityNames.includes(relation.from)) {
        errors.push(`Relation ${relationName}: 'from' entity '${relation.from}' not found`);
      }
      if (relation.to !== '*' && !entityNames.includes(relation.to)) {
        errors.push(`Relation ${relationName}: 'to' entity '${relation.to}' not found`);
      }
    }
  }
  
  return errors;
}

// Runtime ontology instance
let _ontology: OntologySchema | null = null;

export async function loadOntology(): Promise<OntologySchema> {
  if (_ontology) return _ontology;
  
  try {
    // Load the ontology YAML file
    const response = await fetch('/src/features/ai/ontology/ontology.yaml');
    const yamlContent = await response.text();
    _ontology = compile(yamlContent);
    
    const errors = validateOntology(_ontology);
    if (errors.length > 0) {
      console.warn('Ontology validation warnings:', errors);
    }
    
    return _ontology;
  } catch (error) {
    console.error('Failed to load ontology:', error);
    // Return minimal fallback ontology
    return {
      entities: {
        Household: { id: 'string' },
        Account: { id: 'string', type: 'string' }
      },
      relations: {}
    };
  }
}

export function getOntology(): OntologySchema | null {
  return _ontology;
}

// Entity factory functions
export function createEntity<T extends keyof OntologySchema['entities']>(
  entityType: T, 
  data: any
): any {
  const ontology = getOntology();
  if (!ontology) throw new Error('Ontology not loaded');
  
  const entityDef = ontology.entities[entityType as string];
  if (!entityDef) throw new Error(`Entity type ${entityType} not found in ontology`);
  
  // Basic validation - ensure required properties exist
  for (const prop of Object.keys(entityDef)) {
    if (!(prop in data)) {
      throw new Error(`Missing required property '${prop}' for entity ${entityType}`);
    }
  }
  
  return { ...data, _entityType: entityType };
}

// Relation helper functions
export function createRelation(
  relationName: string,
  fromEntity: any,
  toEntity: any
): any {
  const ontology = getOntology();
  if (!ontology) throw new Error('Ontology not loaded');
  
  const relationDef = ontology.relations[relationName];
  if (!relationDef) throw new Error(`Relation ${relationName} not found in ontology`);
  
  return {
    type: relationName,
    from: fromEntity,
    to: toEntity,
    relationship: relationDef.relationship,
    createdAt: new Date().toISOString()
  };
}