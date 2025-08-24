# Last Will and Testament

## I, {{client_full_name}}, a resident of {{state_code}}, being of sound mind and disposing memory, do hereby make, publish, and declare this to be my Last Will and Testament.

### Article I - Revocation
I hereby revoke all former wills and codicils made by me.

### Article II - Family
{{#spouse_name}}
I am married to {{spouse_name}}.
{{/spouse_name}}

{{#children}}
I have the following children:
{{#each children}}
- {{name}}, born {{birthdate}}
{{/each}}
{{/children}}

### Article III - Dispositive Provisions
{{#specific_bequests}}
I give and bequeath the following specific gifts:
{{#each specific_bequests}}
- {{description}} to {{beneficiary}}
{{/each}}
{{/specific_bequests}}

I give, devise, and bequeath all the rest, residue, and remainder of my estate to {{residuary_beneficiary}}.

### Article IV - Executor
I appoint {{executor_name}} as the Executor of this Will.

### Article V - Guardianship
{{#minor_children}}
If at my death any of my children are minors, I appoint {{guardian_name}} as guardian of the person and property of such minor children.
{{/minor_children}}

### Article VI - Execution
{{#if witnesses_required}}
This Will requires {{witnesses}} witnesses and {{#if notary_required}}notarization{{else}}no notarization{{/if}} under {{state_code}} law.
{{/if}}

{{#if community_property}}
**Community Property Notice ({{state_code}}):** This will disposes of both separate and community property interests.
{{/if}}

---
*Executed on {{execution_date}} in {{execution_location}}*