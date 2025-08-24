# Financial Power of Attorney

## I, {{principal_name}}, of {{state_code}}, hereby appoint {{agent_name}} as my agent (attorney-in-fact) to act on my behalf.

### Powers Granted
My agent is authorized to:
- Manage real estate transactions
- Conduct banking and financial transactions  
- Manage investments and retirement accounts
- Handle tax matters
- Operate businesses
- Make gifts (subject to limitations)
- Create, modify, or revoke trusts

### Effective Date
{{#if immediate}}
This power of attorney is effective immediately upon execution.
{{else}}
This power of attorney becomes effective upon my incapacity as determined by {{incapacity_standard}}.
{{/if}}

### Successor Agents
{{#successor_agents}}
If {{agent_name}} is unable to serve, the following shall serve in order:
{{#each successor_agents}}
{{@index}}. {{name}}
{{/each}}
{{/successor_agents}}

### Limitations
{{#limitations}}
This power of attorney is subject to the following limitations:
{{#each limitations}}
- {{description}}
{{/each}}
{{/limitations}}

### Durability
This power of attorney shall remain in effect during my incapacity unless revoked.

### Revocation
I may revoke this power of attorney at any time by written notice to my agent.

---
**{{state_code}} Execution Requirements:**
{{#if notary_required}}
- Notarization required
{{else}}
- Witnesses required: {{witnesses}}
{{/if}}

*Executed on {{execution_date}}*

Principal: _______________________
{{principal_name}}

Agent: _______________________
{{agent_name}}

{{#if notary_required}}
Notary: _______________________
State of {{state_code}}, County of ___________

Subscribed and sworn before me this _____ day of _______, 20__.
My commission expires: _________
{{/if}}

{{#if witnesses_required}}
Witnesses:
1. _______________________ 
2. _______________________
{{/if}}