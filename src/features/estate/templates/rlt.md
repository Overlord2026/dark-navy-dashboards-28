# {{trust_name}} Revocable Living Trust

## Declaration of Trust

I, {{grantor_name}}, of {{state_code}}, hereby establish this Revocable Living Trust.

### Article I - Trust Property
The trust shall hold and administer the property transferred to it by the Grantor and any other property that may be added.

### Article II - Lifetime Distributions
During my lifetime, the Trustee may distribute to me or apply for my benefit such amounts of the net income and principal as I may request in writing.

### Article III - Distributions After Death
Upon my death, the Trustee shall distribute the trust estate as follows:

{{#beneficiaries}}
{{#each beneficiaries}}
- {{percentage}}% to {{name}} ({{relationship}})
{{/each}}
{{/beneficiaries}}

### Article IV - Trustee Powers
The Trustee shall have all powers necessary for the administration of this trust, including but not limited to:
- Investment and reinvestment powers
- Power to distribute income and principal
- Power to terminate the trust

### Article V - Successor Trustees
{{#successor_trustees}}
If I am unable to serve as Trustee, the following shall serve in order:
{{#each successor_trustees}}
{{@index}}. {{name}}
{{/each}}
{{/successor_trustees}}

### Article VI - Revocation
This trust may be revoked by me at any time during my lifetime by written instrument delivered to the Trustee.

{{#if spousal_consents_required}}
### Article VII - Spousal Consent ({{state_code}})
{{spouse_name}} hereby consents to the creation of this trust and waives any community property rights.

Spouse Signature: _______________________ Date: _________
{{/if}}

---
**Execution Requirements ({{state_code}}):**
{{#if notary_required}}
- Notarization required
{{else}}
- No notarization required
{{/if}}

*Executed on {{execution_date}}*

Grantor: _______________________
{{grantor_name}}

{{#if notary_required}}
Notary: _______________________
State of {{state_code}}
{{/if}}