---
template_id: supervisor.report.monthly
persona: 'supervisor'
allowlisted: true
subject: "Supervisor Monthly Report — {{month_label}}"
---
# Supervisor Monthly Report — {{month_label}}

**Firm overview (last month):**  
- Exceptions (open at month end): **{{exceptions_open}}** (Δ {{exceptions_delta}} vs prior month)  
- Guardrails alerts (count in month): **{{guardrails_count}}**  
- Beneficiary mismatches (open at month end): **{{beneficiary_open}}** (Δ {{beneficiary_delta}})  
- Evidence packs built: **{{evidence_count}}**  
- Anchor coverage (info): **{{anchor_coverage}}%**

**By Persona (open exceptions @ month end):**  
{{by_persona_md}}

**Trends (monthly)**  
Exceptions: `{{spark_exceptions}}`  
Evidence: `{{spark_evidence}}`

**Links**  
- Exceptions: {{exceptions_link}}  
- Evidence Builder: {{evidence_link}}  
- Anchors Verify: {{anchors_link}}  
- Audits: {{audits_link}}  

> No client data included. For details, open the console to view exceptions and export an Evidence Pack.