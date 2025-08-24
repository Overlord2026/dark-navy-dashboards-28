---
template_id: healthcare.surrogate_designation
persona: 'family'
allowlisted: true
---

# Designation of {{terminology}}

## I, {{client_full_name}}, designate {{agent_name}} as my {{terminology}}.

### Personal Information
- **Principal:** {{client_full_name}}
- **Date of Birth:** {{dob}}
- **Address:** {{address}}
- **Social Security Number:** {{ssn_partial}} (last 4 digits)

### {{terminology}} Designation

I hereby designate {{agent_name}} to serve as my {{terminology}} to make healthcare decisions for me in the event that I become incapacitated and unable to make my own healthcare decisions.

**{{terminology}} Information:**
- **Name:** {{agent_name}}
- **Address:** {{agent_address}}
- **Phone:** {{agent_phone}}
- **Relationship:** {{agent_relationship}}

### Alternate {{terminology}}

{{#alt_agent_name}}
If my designated {{terminology}} is unable, unwilling, or unavailable to serve, I designate the following person as my alternate {{terminology}}:

- **Name:** {{alt_agent_name}}
- **Address:** {{alt_agent_address}}
- **Phone:** {{alt_agent_phone}}
- **Relationship:** {{alt_agent_relationship}}
{{/alt_agent_name}}

### Authority and Responsibilities

My {{terminology}} is authorized to:

1. **Medical Decision Making:** Consult with physicians and other healthcare providers about my condition, prognosis, and treatment options.

2. **Treatment Decisions:** Give informed consent for, withhold, or withdraw any type of medical care, treatment, service, or procedure.

3. **Healthcare Facilities:** Authorize my admission to or discharge from any hospital, nursing home, residential care, assisted living or similar facility or service.

4. **Healthcare Providers:** Contract for any healthcare services or facilities on my behalf and discharge healthcare providers.

5. **Medical Records:** Have access to all my medical records and authorize their disclosure as necessary for my treatment or the administration of my affairs.

6. **Life-Sustaining Treatment:** Make decisions regarding life-sustaining treatment, including but not limited to:
   - Mechanical ventilation
   - Artificial nutrition and hydration
   - Dialysis
   - Antibiotics
   - Cardiopulmonary resuscitation (CPR)

### {{terminology}} Guidance

{{#guidance_provided}}
In making healthcare decisions for me, my {{terminology}} should be guided by:

{{#specific_guidance}}
**Specific Instructions:**
{{specific_guidance}}
{{/specific_guidance}}

**General Values:**
{{#values}}
{{#each values}}
- {{description}}
{{/each}}
{{/values}}

**Religious Considerations:**
{{#religious_considerations}}
{{religious_considerations}}
{{/religious_considerations}}
{{/guidance_provided}}

### Duration and Revocation

This designation:
- Becomes effective only when I am unable to make my own healthcare decisions
- Remains in effect until I regain the ability to make healthcare decisions or until revoked
- May be revoked by me at any time by written or oral statement to my physician or {{terminology}}

### Prior Designations

This designation revokes any prior designation of {{terminology}} or healthcare agent.

---

**{{state_code}} Legal Requirements:**

{{#if special_notes}}
**{{state_code}} Specific Notes:** {{special_notes}}
{{/if}}

**Execution Requirements:**
- Witnesses: {{witness_count}} required
{{#if notary_required}}
- Notarization: Required
{{else}}
- Notarization: Not required
{{/if}}

{{#if witness_eligibility}}
**Witness Eligibility:** {{witness_eligibility}}
{{/if}}

**Signatures:**

I understand the nature and purpose of this document. I am emotionally and mentally competent to make this designation.

Principal: _______________________ Date: _________
{{client_full_name}}

**{{terminology}} Acceptance:**
I accept the designation as {{terminology}} and agree to serve in this capacity.

{{terminology}}: _______________________ Date: _________
{{agent_name}}

{{#alt_agent_name}}
**Alternate {{terminology}} Acceptance:**
I accept the designation as alternate {{terminology}} and agree to serve if called upon.

Alternate {{terminology}}: _______________________ Date: _________
{{alt_agent_name}}
{{/alt_agent_name}}

{{#if witness_count}}
**Witnesses:**
The principal is personally known to us or has provided proof of identity. The principal signed this document in our presence and appears to be of sound mind and under no duress. We are not related to the principal and are not entitled to any portion of the principal's estate.

Witness 1: _______________________ Date: _________
Print Name: _______________________
Address: _______________________

Witness 2: _______________________ Date: _________
Print Name: _______________________
Address: _______________________
{{/if}}

{{#if notary_required}}
**Notarization:**
{{jurat_block}}

_______________________
Notary Public Signature

My commission expires: _________
{{/if}}

*This {{terminology}} designation was executed in accordance with {{state_code}} law on {{date}}.*