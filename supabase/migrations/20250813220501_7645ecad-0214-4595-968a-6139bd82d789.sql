-- Extend healthcare personas
alter table personas
  add column if not exists meta jsonb default '{}'::jsonb;

-- Seed new healthcare sub-personas (safe if already present)
do $$
declare v_org uuid;
begin
  select id into v_org from orgs limit 1;

  insert into personas(org_id, persona_kind, label, description, meta) values
    (v_org,'pro_healthcare_influencer','Healthcare Influencer/Advisor','Creates public health content; no PHI access', '{"scope":"public_advice"}'),
    (v_org,'pro_healthcare_clinic','Clinic / Testing Provider','Orders/collects tests; manages results & billing', '{"scope":"testing_ops"}'),
    (v_org,'pro_healthcare_navigator','Care Navigator/Coach','Coordinates care plans & permissions', '{"scope":"care_plans"}'),
    (v_org,'pro_pharmacy','Pharmacy & Shots','Vaccines, reimbursement, inventory', '{"scope":"vaccines_ops"}')
  on conflict do nothing;
end $$;