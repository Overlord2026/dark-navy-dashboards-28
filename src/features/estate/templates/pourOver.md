# Pour-Over Will

## I, {{client_full_name}}, of {{state_code}}, being of sound mind, make this Pour-Over Will to work in conjunction with my Revocable Living Trust.

### Article I - Revocation
I revoke all former wills and codicils.

### Article II - Trust Pour-Over
Except for the specific bequests below, I give, devise, and bequeath all of my property to the Trustee of the {{trust_name}}, to be administered according to the terms of that trust.

### Article III - Specific Bequests
{{#specific_bequests}}
I make the following specific gifts:
{{#each specific_bequests}}
- {{description}} to {{beneficiary}}
{{/each}}
{{/specific_bequests}}

### Article IV - Executor
I appoint {{executor_name}} as Executor of this Will. If {{executor_name}} cannot serve, I appoint {{successor_executor}} as successor Executor.

### Article V - Guardianship
{{#minor_children}}
If any of my children are minors at my death, I appoint {{guardian_name}} as guardian.
{{/minor_children}}

### Article VI - Trust Reference
This Will is designed to work with the {{trust_name}} dated {{trust_date}}. If the trust is invalid or does not exist, the residue shall be distributed to {{backup_beneficiary}}.

---
**{{state_code}} Execution Requirements:**
- Witnesses required: {{witnesses}}
{{#if notary_required}}
- Notarization required
{{else}}
- No notarization required
{{/if}}

*Executed on {{execution_date}}*