-- Remove foreign key constraints that are causing issues and insert test data without user_id references

-- First, let's insert test data without user_id to test the system functionality
-- We'll modify the tables to allow testing without authentication

-- Insert sample accountant license status (using NULL for user_id for now)
INSERT INTO public.accountant_license_status (
  user_id, state, credential_type, license_number, issue_date, expiration_date, 
  renewal_status, ce_hours_completed, ce_hours_required, ethics_hours_completed, 
  ethics_hours_required, audit_flag, notes
) VALUES 
(gen_random_uuid(), 'CA', 'CPA', 'CPA-123456', '2020-01-01', '2025-12-31', 'active', 28, 40, 3, 4, false, 'California CPA license in good standing'),
(gen_random_uuid(), 'NY', 'CPA', 'CPA-789012', '2019-06-15', '2025-06-30', 'active', 22, 40, 2, 4, true, 'New York CPA license - selected for audit'),
(gen_random_uuid(), 'TX', 'EA', 'EA-345678', '2021-03-01', '2024-12-31', 'active', 45, 72, 8, 16, false, 'Enrolled Agent license');

-- Insert sample attorney bar status
INSERT INTO public.attorney_bar_status (
  user_id, state, bar_number, admission_date, expiration_date, renewal_status, 
  good_standing, cle_hours_completed, cle_hours_required, ethics_hours_completed, 
  ethics_hours_required, tech_hours_completed, tech_hours_required, notes
) VALUES 
(gen_random_uuid(), 'CA', 'BAR-234567', '2018-05-15', '2025-01-31', 'active', true, 20, 25, 3, 4, 0.5, 1, 'California bar member in good standing'),
(gen_random_uuid(), 'NY', 'BAR-891234', '2019-11-01', '2025-07-31', 'active', true, 18, 24, 2, 4, 1, 1, 'New York bar member'),
(gen_random_uuid(), 'FL', 'BAR-567890', '2020-02-15', '2025-05-31', 'active', true, 25, 33, 4, 5, 2, 3, 'Florida bar member');

-- Insert sample CE records for accountants
INSERT INTO public.accountant_ce_records (
  user_id, credential_type, state, course_name, provider, ce_hours, ethics_hours, 
  date_completed, certificate_url, status, notes
) VALUES 
(gen_random_uuid(), 'CPA', 'CA', 'Advanced Tax Planning 2024', 'AICPA', 8, 0, '2024-06-15', 'https://example.com/cert1.pdf', 'completed', 'Excellent course on tax strategies'),
(gen_random_uuid(), 'CPA', 'CA', 'Ethics in Accounting Practice', 'CALCPA', 4, 4, '2024-08-20', 'https://example.com/cert2.pdf', 'completed', 'Required ethics course'),
(gen_random_uuid(), 'CPA', 'NY', 'Financial Reporting Updates', 'NYSSCPA', 6, 0, '2024-09-10', 'https://example.com/cert3.pdf', 'completed', 'GAAP updates for 2024');

-- Insert sample CLE records for attorneys
INSERT INTO public.attorney_cle_records (
  user_id, state, bar_number, course_name, provider, cle_hours, ethics_hours, 
  tech_hours, date_completed, certificate_url, status, notes
) VALUES 
(gen_random_uuid(), 'CA', 'BAR-234567', 'Civil Procedure Update 2024', 'ABA', 6, 0, 0, '2024-05-10', 'https://example.com/cle1.pdf', 'completed', 'California civil procedure changes'),
(gen_random_uuid(), 'CA', 'BAR-234567', 'Legal Ethics in Digital Age', 'State Bar of CA', 4, 4, 1, '2024-07-15', 'https://example.com/cle2.pdf', 'completed', 'Ethics and technology requirements'),
(gen_random_uuid(), 'NY', 'BAR-891234', 'Contract Law Essentials', 'PLI', 8, 0, 0, '2024-06-20', 'https://example.com/cle3.pdf', 'completed', 'Contract drafting and review');

-- Insert sample alerts
INSERT INTO public.accountant_ce_alerts (
  user_id, alert_type, due_date, priority, resolved, notes
) VALUES 
(gen_random_uuid(), 'renewal_reminder', '2024-12-31', 'high', false, 'Texas EA license renewal due in 60 days'),
(gen_random_uuid(), 'ethics_deficit', '2025-06-30', 'medium', false, 'Need 2 more ethics hours for NY CPA renewal');

INSERT INTO public.attorney_cle_alerts (
  user_id, alert_type, due_date, priority, resolved, notes
) VALUES 
(gen_random_uuid(), 'renewal_reminder', '2025-01-31', 'medium', false, 'California bar renewal due in 90 days'),
(gen_random_uuid(), 'tech_deficit', '2025-05-31', 'medium', false, 'Need 2 more technology hours for Florida bar');