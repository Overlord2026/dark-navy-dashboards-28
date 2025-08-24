---
template_id: healthcare.living_will
persona: 'family'
allowlisted: true
---

# Living Will

## Declaration of {{client_full_name}}

If the time comes when I can no longer take part in decisions for my own future, let this statement stand as the testament of my wishes:

### Personal Information
- **Full Name:** {{client_full_name}}
- **Date of Birth:** {{dob}}
- **Address:** {{address}}

### Declaration of Intent

I, {{client_full_name}}, being of sound mind, make this Living Will to express my wishes regarding medical treatment in circumstances where I am unable to communicate my decisions.

### Medical Conditions Covered

This Living Will applies if I am in any of the following conditions:
1. **Terminal Condition:** An incurable condition caused by injury, disease, or illness that, to a reasonable degree of medical certainty, makes death imminent and from which there can be no recovery.

2. **Persistent Vegetative State:** A condition of unconsciousness in which I am completely unaware of myself and my environment and have no cognition or meaningful behavioral responses.

3. **End-Stage Condition:** An incurable condition that has resulted in progressively severe and permanent deterioration, and death is expected within one year.

### Life-Sustaining Treatment Preferences

**If I am in a terminal condition, persistent vegetative state, or end-stage condition:**

#### Artificial Life Support
{{#life_support_choice}}
**☐ I DO want** life-sustaining treatment to be provided
**☐ I DO NOT want** life-sustaining treatment to be provided
**☐ I want my agent to decide** about life-sustaining treatment
{{/life_support_choice}}

#### Cardiopulmonary Resuscitation (CPR)
{{#cpr_choice}}
**☐ I DO want** CPR performed
**☐ I DO NOT want** CPR performed  
**☐ I want my agent to decide** about CPR
{{/cpr_choice}}

#### Artificial Nutrition and Hydration
{{#nutrition_choice}}
**☐ I DO want** artificial nutrition and hydration (tube feeding)
**☐ I DO NOT want** artificial nutrition and hydration
**☐ I want my agent to decide** about artificial nutrition and hydration
{{/nutrition_choice}}

#### Mechanical Ventilation
{{#ventilation_choice}}
**☐ I DO want** mechanical ventilation
**☐ I DO NOT want** mechanical ventilation
**☐ I want my agent to decide** about mechanical ventilation
{{/ventilation_choice}}

#### Dialysis
{{#dialysis_choice}}
**☐ I DO want** dialysis treatment
**☐ I DO NOT want** dialysis treatment
**☐ I want my agent to decide** about dialysis
{{/dialysis_choice}}

#### Antibiotics
{{#antibiotics_choice}}
**☐ I DO want** antibiotic treatment
**☐ I DO NOT want** antibiotic treatment
**☐ I want my agent to decide** about antibiotics
{{/antibiotics_choice}}

### Pain Relief and Comfort Care

**Regardless of my other choices above:**
- ☐ I want sufficient pain medication to maintain my comfort, even if it may hasten my death
- ☐ I want comfort care and pain relief as determined by my physician
- ☐ I want my agent to make decisions about pain relief and comfort care

### Additional Instructions

{{#additional_instructions}}
**Special instructions or values that should guide my care:**
{{additional_instructions}}
{{/additional_instructions}}

### Pregnancy Exception

{{#pregnancy_exception}}
If I am pregnant, my agent shall make decisions that are in the best interest of the unborn child, unless the pregnancy poses a substantial risk to my life.
{{/pregnancy_exception}}

### Organ Donation

Upon my death:
{{#organ_donation_choice}}
**☐ I DO want** to donate my organs and tissues for transplantation
**☐ I DO NOT want** to donate my organs and tissues
**☐ I want my agent to decide** about organ donation
{{/organ_donation_choice}}

---

**{{state_code}} Compliance Requirements:**

{{#if special_notes}}
**{{state_code}} Specific Requirements:** {{special_notes}}
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

By signing below, I indicate that I understand the nature and purpose of this document and that I am emotionally and mentally competent to make these decisions.

Principal: _______________________ Date: _________
{{client_full_name}}

{{#if witness_count}}
**Witnesses:**
The person who signed this document is personally known to us or has provided proof of identity. The person signed this document in our presence, and appears to be of sound mind and under no duress, fraud, or undue influence. We are not related to the person by blood, adoption, or marriage, nor are we entitled to any portion of the person's estate.

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

*This Living Will was executed in {{state_code}} on {{date}} and supersedes any previous Living Will.*