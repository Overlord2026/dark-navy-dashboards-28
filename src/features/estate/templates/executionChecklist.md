# Estate Execution Checklist - {{state_code}}

## Document Execution Requirements

### Last Will and Testament
- [ ] {{witnesses}} witnesses required
{{#if will_notary_required}}
- [ ] Notarization required
{{else}}
- [ ] No notarization required (witnesses sufficient)
{{/if}}
- [ ] Self-proving affidavit recommended
- [ ] Witnesses must be disinterested parties
- [ ] All parties sign in presence of each other

### Revocable Living Trust
{{#if trust_notary_required}}
- [ ] Notarization required for Grantor signature
{{else}}
- [ ] Simple signature sufficient
{{/if}}
{{#if spousal_consents_required}}
- [ ] Spousal consent signatures required
- [ ] Both spouses must sign consent provisions
{{/if}}
- [ ] Initial funding recommended immediately after execution

### Financial Power of Attorney
{{#if poa_notary_required}}
- [ ] Notarization required
{{else}}
- [ ] {{poa_witnesses}} witnesses required
- [ ] No notarization needed
{{/if}}
- [ ] Agent acknowledgment signature
- [ ] Successor agent notification recommended

{{#if community_property}}
### Community Property Considerations ({{state_code}})
- [ ] Both spouses should execute separate documents
- [ ] Community property disclosures included
- [ ] Consider interspousal transfer deed for real estate
{{/if}}

## Post-Execution Steps

### Immediate (Within 30 Days)
- [ ] Fund revocable living trust with assets
- [ ] Update account beneficiaries to match estate plan
- [ ] Notify financial institutions of new POA
- [ ] Store original documents in secure location
- [ ] Provide copies to successor trustees/agents

### Within 90 Days
- [ ] Review and update all beneficiary designations
- [ ] Consider retitling real estate to trust
- [ ] Update insurance policies as needed
- [ ] Create list of digital assets and passwords
- [ ] Inform family members of document locations

### Annual Review
- [ ] Review estate plan for life changes
- [ ] Confirm beneficiary designations current
- [ ] Update asset values for estate tax planning
- [ ] Consider state law changes

---
**Important Notes for {{state_code}}:**

{{#if probate_notes}}
{{probate_notes}}
{{/if}}

{{#if deed_practice_note}}
**Real Estate:** {{deed_practice_note}}
{{/if}}

{{#if tod_pod_allowed}}
**TOD/POD:** Transfer-on-death and payable-on-death designations are permitted in {{state_code}}.
{{else}}
**TOD/POD:** Transfer-on-death designations may not be available for all asset types in {{state_code}}.
{{/if}}

*This checklist is for informational purposes only. Consult with an estate planning attorney for guidance specific to your situation.*