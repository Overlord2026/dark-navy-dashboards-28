-- Create minimal test data without foreign key constraints

-- Create test bank accounts (without user_id foreign key constraint)
INSERT INTO public.bank_accounts (id, user_id, name, account_type, balance) VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'High Balance Account', 'checking', 10000.00),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Low Balance Account', 'savings', 100.00),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'Closed Account', 'closed', 5000.00),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', 'Destination Account', 'checking', 2000.00);

-- Create test family for HSA accounts
INSERT INTO public.families (id, family_name) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'Test Family 1');

-- Create test HSA accounts with family relationships
INSERT INTO public.hsa_accounts (
  id, user_id, family_id, account_name, custodian_name, 
  current_balance, annual_contribution_limit, annual_contribution_ytd, 
  catch_up_eligible, is_active
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'f1111111-1111-1111-1111-111111111111', 'John HSA Individual', 'Fidelity', 5000.00, 4300.00, 2000.00, false, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000002', 'f1111111-1111-1111-1111-111111111111', 'Jane HSA Family', 'Fidelity', 8000.00, 8550.00, 3000.00, true, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000003', NULL, 'Bob HSA Individual', 'HSA Bank', 3000.00, 4300.00, 4200.00, false, false);