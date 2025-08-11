# Policy DSL Documentation

## BNF Grammar

```bnf
<policy-document> ::= <metadata> <statements>

<metadata> ::= "policy" <string> 
              "version" <string>
              ["jurisdiction" <string>]

<statements> ::= <statement>+

<statement> ::= "statement" <identifier> "{"
                  "effect" <effect>
                  ["actions" <action-list>]
                  ["resources" <resource-list>]
                  ["conditions" <condition-list>]
                  ["priority" <number>]
                "}"

<effect> ::= "ALLOW" | "DENY"

<action-list> ::= "[" <string-list> "]"
<resource-list> ::= "[" <string-list> "]"
<condition-list> ::= "[" <condition>* "]"

<condition> ::= "{"
                  "field" <string>
                  "operator" <operator>
                  "value" <value>
                "}"

<operator> ::= "eq" | "ne" | "in" | "contains" | "gt" | "lt" | "matches"
<value> ::= <string> | <number> | <array> | <boolean>
<string-list> ::= <string> ("," <string>)*
```

## Example Policy → Canonical DAG

### Input Policy
```json
{
  "name": "document-access-policy",
  "version": "1.0",
  "jurisdiction": "US",
  "statements": [
    {
      "id": "admin-full-access",
      "effect": "ALLOW",
      "actions": ["*"],
      "resources": ["document:*"],
      "conditions": [
        {"field": "role", "operator": "eq", "value": "admin"}
      ],
      "priority": 100
    },
    {
      "id": "user-read-access",
      "effect": "ALLOW", 
      "actions": ["read"],
      "resources": ["document:*"],
      "conditions": [
        {"field": "role", "operator": "eq", "value": "user"},
        {"field": "department", "operator": "in", "value": ["finance", "legal"]}
      ],
      "priority": 50
    }
  ]
}
```

### Canonical DAG Output
```
Root Node (action_match_admin_full_access)
├─ TRUE → resource_match_admin_full_access
│  ├─ TRUE → role_check_admin
│  │  ├─ TRUE → ALLOW (admin-full-access)
│  │  └─ FALSE → action_match_user_read_access
│  └─ FALSE → action_match_user_read_access
└─ FALSE → action_match_user_read_access
   ├─ TRUE → resource_match_user_read_access
   │  ├─ TRUE → role_check_user
   │  │  ├─ TRUE → department_check_user
   │  │  │  ├─ TRUE → ALLOW (user-read-access)
   │  │  │  └─ FALSE → DENY (default)
   │  │  └─ FALSE → DENY (default)
   │  └─ FALSE → DENY (default)
   └─ FALSE → DENY (default)
```

### Structural Hash Components
- **Actions**: Sorted alphabetically
- **Resources**: Sorted alphabetically  
- **Conditions**: Normalized field ordering
- **Priority**: Numerical sorting
- **Effect**: Alphabetical (ALLOW before DENY)

**Cache Key Format**: `{tenant}:{version}:{jurisdiction}:{structural_hash}`