---
template_id: healthcare.healthcare_poa
persona: 'family'
allowlisted: true
---

# {{terminology}} for Health Care

## I, {{client_full_name}}, hereby appoint {{agent_name}} as my {{terminology}} to make health care decisions on my behalf.

### Agent Information
- **Primary {{terminology}}:** {{agent_name}}
- **Address:** {{agent_address}}
- **Phone:** {{agent_phone}}
- **Relationship:** {{agent_relationship}}

### Alternate Agent
{{#alt_agent_name}}
If {{agent_name}} is unavailable, unable, or unwilling to serve, I appoint:
- **Alternate {{terminology}}:** {{alt_agent_name}}
- **Address:** {{alt_agent_address}} 
- **Phone:** {{alt_agent_phone}}
- **Relationship:** {{alt_agent_relationship}}
{{/alt_agent_name}}

### Authority Granted

My {{terminology}} is authorized to:

1. **Consent to Medical Treatment:** Give consent for or refuse any care, treatment, service, or procedure to maintain, diagnose, or treat a physical or mental condition.

2. **Access Medical Records:** Obtain copies of medical records and have the same rights that I would have to receive information about the proposed care or treatment.

3. **Select Healthcare Providers:** Employ or discharge healthcare providers and facilities.

4. **Life-Sustaining Treatment:** Make decisions about life-sustaining treatment, including but not limited to:
   - Mechanical ventilation
   - Artificial nutrition and hydration
   - Dialysis
   - Antibiotics
   - CPR and other resuscitation measures

5. **Mental Health Treatment:** Authorize admission to mental health facilities and consent to mental health treatment.

### Limitations

{{#limitations}}
This authority is subject to the following limitations:
{{#each limitations}}
- {{description}}
{{/each}}
{{/limitations}}

### Duration

This {{terminology}} shall remain in effect until:
{{#duration}}
{{duration}}
{{/duration}}
{{#unless duration}}
I revoke it in writing or execute a new {{terminology}}.
{{/unless}}

### HIPAA Authorization

I authorize my {{terminology}} to receive any information protected by the Health Insurance Portability and Accountability Act of 1996 (HIPAA) that is necessary to carry out the powers granted in this document.

---

**{{state_code}} Compliance:**

{{#if special_notes}}
**{{state_code}} Requirements:** {{special_notes}}
{{/if}}

**Execution Requirements:**
- Witnesses: {{witness_count}} required
{{#if notary_required}}
- Notarization: Required
{{else}}
- Notarization: Not required  
{{/if}}

{{#if witness_eligibility}}
**Witness Restrictions:** {{witness_eligibility}}
{{/if}}

**Signatures:**

Principal: _______________________ Date: _________
{{client_full_name}}
{{address}}

Agent Acceptance: _______________________ Date: _________
{{agent_name}}

{{#alt_agent_name}}
Alternate Agent Acceptance: _______________________ Date: _________
{{alt_agent_name}}
{{/alt_agent_name}}

{{#if witness_count}}
**Witnesses:**
We declare that the person who signed this document is personally known to us, that he/she signed it in our presence, and that he/she appears to be of sound mind and under no duress, fraud, or undue influence.

Witness 1: _______________________ Date: _________
Print Name: _______________________
Address: _______________________

{{#if witness_count_2}}
Witness 2: _______________________ Date: _________  
Print Name: _______________________
Address: _______________________
{{/if}}
{{/if}}

{{#if notary_required}}
**Notarization:**
{{jurat_block}}

_______________________
Notary Public Signature

My commission expires: _________
{{/if}}

*This {{terminology}} was executed in {{state_code}} on {{date}}*