---
template_id: healthcare.hipaa_authorization
persona: 'family'
allowlisted: true
---

# HIPAA Authorization for Release of Health Information

## Patient Information
- **Name:** {{client_full_name}}
- **Date of Birth:** {{dob}}
- **Address:** {{address}}
- **Phone:** {{phone}}

## Authorized Recipients

I authorize the release of my protected health information to the following individuals:

### Primary Authorized Person
- **Name:** {{agent_name}}
- **Relationship:** {{agent_relationship}}
- **Address:** {{agent_address}}
- **Phone:** {{agent_phone}}

### Alternate Authorized Person
{{#alt_agent_name}}
- **Name:** {{alt_agent_name}}
- **Relationship:** {{alt_agent_relationship}}
- **Address:** {{alt_agent_address}}
- **Phone:** {{alt_agent_phone}}
{{/alt_agent_name}}

## Information to be Released

I authorize the release of:

**☐ All medical records and health information**
**☐ Specific information only (check all that apply):**
- ☐ Medical history and physical examination records
- ☐ Laboratory and diagnostic test results
- ☐ Medication records and prescription information
- ☐ Mental health and psychiatric records
- ☐ Substance abuse treatment records
- ☐ HIV/AIDS related information
- ☐ Genetic testing information
- ☐ Billing and insurance information

{{#specific_info}}
**Additional specific information:** {{specific_info}}
{{/specific_info}}

## Purpose of Release

This information may be used and disclosed for the following purposes:

- ☐ Healthcare decision making
- ☐ Coordination of care
- ☐ Insurance and billing purposes
- ☐ Legal purposes
- ☐ Personal use of authorized individual

{{#additional_purposes}}
**Other purposes:** {{additional_purposes}}
{{/additional_purposes}}

## Healthcare Providers Covered

This authorization applies to:

**☐ All healthcare providers**
**☐ Specific providers only:**

{{#providers}}
{{#each providers}}
- {{name}}, {{address}}
{{/each}}
{{/providers}}

## Duration

This authorization:

**☐ Has no expiration date**
**☐ Expires on:** {{expiration_date}}
**☐ Expires when:** {{expiration_condition}}

## Rights and Revocation

**Your Rights:**
- You may revoke this authorization at any time by providing written notice
- Your treatment will not be conditioned on signing this authorization
- Information disclosed under this authorization may be subject to re-disclosure
- You have the right to receive a copy of this authorization

**To Revoke:** Send written notice to the healthcare provider's medical records department.

## Electronic Health Information

{{#electronic_access}}
☐ I authorize electronic access to my health information through patient portals and electronic systems
{{/electronic_access}}

---

**Patient Signature:**

I understand that by signing this form, I am authorizing the use and/or disclosure of my protected health information as described above.

Patient: _______________________ Date: _________
{{client_full_name}}

{{#legal_representative}}
**Legal Representative:** (if applicable)
Representative: _______________________ Date: _________
{{representative_name}}
Relationship: {{representative_relationship}}
{{/legal_representative}}

{{#witness_required}}
**Witness:**
Witness: _______________________ Date: _________
Print Name: _______________________
{{/witness_required}}

---

**For Healthcare Provider Use:**
- Date received: _________
- Received by: _______________________
- Copy provided to patient: ☐ Yes ☐ No

*This authorization complies with HIPAA Privacy Rule requirements and {{state_code}} state law.*