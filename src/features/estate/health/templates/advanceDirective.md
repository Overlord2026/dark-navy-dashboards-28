---
template_id: healthcare.advance_directive
persona: 'family'
allowlisted: true
---

# Advance Directive for Health Care

## I, {{client_full_name}}, being of sound mind, make this Advance Directive for Health Care.

### Part I - Power of Attorney for Health Care

I hereby appoint {{agent_name}} as my agent to make health care decisions for me if I become unable to make my own health care decisions.

**Agent Information:**
- Name: {{agent_name}}
- Address: {{agent_address}}
- Phone: {{agent_phone}}

**Alternate Agent:**
{{#alt_agent_name}}
If my primary agent is unable to serve, I appoint {{alt_agent_name}} as my alternate agent.
- Address: {{alt_agent_address}}
- Phone: {{alt_agent_phone}}
{{/alt_agent_name}}

### Part II - Individual Instructions

**End-of-Life Care Instructions:**
{{#if maintain_life}}
I want my life to be prolonged to the greatest extent possible without regard to my condition, the chances I have for recovery, or the cost of the procedures.
{{else}}
I do not want my life to be prolonged if:
- I have an incurable and irreversible condition that will result in my death within a relatively short time
- I become unconscious and, to a reasonable degree of medical certainty, I will not regain consciousness
- The likely risks and burdens of treatment would outweigh the expected benefits
{{/if}}

**Specific Instructions:**
{{#artificial_nutrition}}
{{artificial_nutrition_choice}} artificial nutrition and hydration (tube feeding)
{{/artificial_nutrition}}

{{#pain_relief}}
I want sufficient pain relief to maintain my comfort, even if it may hasten my death
{{/pain_relief}}

### Part III - Donation of Organs and Tissues

{{#organ_donation}}
Upon my death, I {{organ_donation_choice}} to donate my organs and tissues for transplantation, therapy, education, and research.
{{/organ_donation}}

### Part IV - Primary Physician

{{#primary_physician}}
My primary physician is:
- Name: {{physician_name}}
- Address: {{physician_address}}
- Phone: {{physician_phone}}
{{/primary_physician}}

---

**{{state_code}} Execution Requirements:**
- Witnesses required: {{witness_count}}
{{#if notary_required}}
- Notarization required
{{else}}
- No notarization required
{{/if}}

{{#if witness_eligibility}}
**Witness Eligibility:** {{witness_eligibility}}
{{/if}}

{{#if special_notes}}
**{{state_code}} Notes:** {{special_notes}}
{{/if}}

**Signatures:**

Principal: _______________________ Date: _________
{{client_full_name}}

{{#if witness_count}}
**Witnesses:**
{{#each witnesses}}
Witness {{@index}}: _______________________ Date: _________
{{/each}}
{{/if}}

{{#if notary_required}}
**Notary:**
{{jurat_block}}

_______________________ 
Notary Public Signature

My commission expires: _________
{{/if}}

*Executed on {{date}} in {{state_code}}*