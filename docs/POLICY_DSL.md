# Policy DSL Documentation

## BNF Grammar for Family Office Marketplace Policy Language

```bnf
<policy> ::= <policy_statement>+

<policy_statement> ::= "POLICY" <identifier> "{" <policy_body> "}"

<policy_body> ::= <conditions> <effect>

<conditions> ::= "WHEN" <condition_list>

<condition_list> ::= <condition> ("AND" <condition>)*

<condition> ::= <role_condition> | <tenant_condition> | <time_condition> | <ip_condition> | <custom_condition>

<role_condition> ::= "role" <operator> <string_literal>

<tenant_condition> ::= "tenant" <operator> <string_literal>

<time_condition> ::= "time" <time_operator> <time_literal>

<ip_condition> ::= "ip" <ip_operator> <ip_literal>

<custom_condition> ::= <identifier> <operator> <value>

<operator> ::= "=" | "!=" | "IN" | "NOT_IN"

<time_operator> ::= "BEFORE" | "AFTER" | "BETWEEN"

<ip_operator> ::= "IN_RANGE" | "NOT_IN_RANGE" | "="

<effect> ::= "THEN" <effect_type> <scope_list>

<effect_type> ::= "ALLOW" | "DENY"

<scope_list> ::= "[" <scope> ("," <scope>)* "]"

<scope> ::= <string_literal>

<identifier> ::= [a-zA-Z_][a-zA-Z0-9_]*

<string_literal> ::= '"' [^"]* '"'

<time_literal> ::= <iso_datetime> | <time_range>

<ip_literal> ::= <cidr_block> | <ip_address>
```

## Example Policy → Canonical DAG

### Input Policy
```
POLICY admin_user_access {
  WHEN role = "admin" AND tenant = "family_office_1"
  THEN ALLOW ["read:users", "write:users", "delete:users"]
}

POLICY advisor_client_access {
  WHEN role = "advisor" AND tenant = "family_office_1" AND time BETWEEN "09:00" "17:00"
  THEN ALLOW ["read:clients", "write:client_notes"]
}
```

### Canonical DAG Representation

```json
{
  "nodes": [
    {
      "id": "admin_user_access_condition_0",
      "type": "condition",
      "data": {
        "type": "ROLE",
        "value": "admin",
        "operator": "eq"
      }
    },
    {
      "id": "admin_user_access_condition_1", 
      "type": "condition",
      "data": {
        "type": "TENANT",
        "value": "family_office_1",
        "operator": "eq"
      }
    },
    {
      "id": "admin_user_access_effect",
      "type": "effect",
      "data": {
        "effect": "allow",
        "scopes": ["delete:users", "read:users", "write:users"]
      }
    },
    {
      "id": "advisor_client_access_condition_0",
      "type": "condition", 
      "data": {
        "type": "ROLE",
        "value": "advisor",
        "operator": "eq"
      }
    },
    {
      "id": "advisor_client_access_condition_1",
      "type": "condition",
      "data": {
        "type": "TENANT", 
        "value": "family_office_1",
        "operator": "eq"
      }
    },
    {
      "id": "advisor_client_access_condition_2",
      "type": "condition",
      "data": {
        "type": "TIME",
        "value": "09:00-17:00", 
        "operator": "between"
      }
    },
    {
      "id": "advisor_client_access_effect",
      "type": "effect",
      "data": {
        "effect": "allow",
        "scopes": ["read:clients", "write:client_notes"]
      }
    }
  ],
  "edges": [
    {
      "from": "admin_user_access_condition_0",
      "to": "admin_user_access_effect"
    },
    {
      "from": "admin_user_access_condition_1", 
      "to": "admin_user_access_effect"
    },
    {
      "from": "advisor_client_access_condition_0",
      "to": "advisor_client_access_effect"
    },
    {
      "from": "advisor_client_access_condition_1",
      "to": "advisor_client_access_effect" 
    },
    {
      "from": "advisor_client_access_condition_2",
      "to": "advisor_client_access_effect"
    }
  ],
  "structural_hash": "a1b2c3d4e5f6789..."
}
```

## Canonicalization Rules

1. **Node Sorting**: Nodes are sorted alphabetically by ID
2. **Edge Sorting**: Edges are sorted by `from` field, then `to` field  
3. **Scope Sorting**: Scope arrays within effects are sorted alphabetically
4. **Condition Normalization**: Conditions of same type are grouped and sorted
5. **Data Consistency**: All data objects have keys sorted alphabetically

## Structural Hash Calculation

The structural hash is calculated from the canonical representation:

```typescript
function calculateStructuralHash(graph: PolicyGraph): string {
  const canonical = {
    nodes: graph.nodes.map(n => ({
      id: n.id,
      type: n.type, 
      data: JSON.stringify(n.data, Object.keys(n.data).sort())
    })),
    edges: graph.edges.map(e => ({
      from: e.from,
      to: e.to,
      weight: e.weight
    }))
  };
  
  const canonicalStr = JSON.stringify(canonical, Object.keys(canonical).sort());
  return sha256(canonicalStr);
}
```

## Cache Key Generation

Enhanced cache keys include structural hash for content-based caching:

```typescript
interface CacheKey {
  tenant: string;
  version: string; 
  jurisdiction: string;
  structural_hash: string;
}

// Example: "family_office_1:v2.1:US:a1b2c3d4e5f6789"
```

This ensures that policies with identical structure share cache entries regardless of cosmetic differences in policy IDs or ordering.