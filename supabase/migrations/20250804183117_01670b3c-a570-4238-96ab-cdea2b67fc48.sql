-- Seed RIA State Requirements Data for Major States

-- Texas Requirements
INSERT INTO public.ria_state_requirements (state, requirement_name, requirement_type, description, fee_amount, typical_processing_days) VALUES
('TX', 'Form ADV Part 1', 'document', 'Investment adviser registration form filed with IARD', 0, 30),
('TX', 'Form ADV Part 2A', 'document', 'Investment adviser brochure (firm brochure)', 0, 30),
('TX', 'Form ADV Part 2B', 'document', 'Investment adviser brochure supplement (individual brochure)', 0, 30),
('TX', 'State Registration Fee', 'fee', 'Texas state investment adviser registration fee', 200, 30),
('TX', 'Financial Statement', 'document', 'Audited financial statement if managing over $100M', 0, 45),
('TX', 'Advisory Agreement Template', 'document', 'Sample client advisory agreement', 0, 30),
('TX', 'Code of Ethics', 'document', 'Written code of ethics and compliance policies', 0, 30),
('TX', 'Privacy Policy', 'document', 'Privacy policy for client information protection', 0, 30);

-- California Requirements  
INSERT INTO public.ria_state_requirements (state, requirement_name, requirement_type, description, fee_amount, typical_processing_days) VALUES
('CA', 'Form ADV Part 1', 'document', 'Investment adviser registration form filed with IARD', 0, 45),
('CA', 'Form ADV Part 2A', 'document', 'Investment adviser brochure (firm brochure)', 0, 45),
('CA', 'Form ADV Part 2B', 'document', 'Investment adviser brochure supplement (individual brochure)', 0, 45),
('CA', 'State Registration Fee', 'fee', 'California state investment adviser registration fee', 300, 45),
('CA', 'Surety Bond', 'document', 'Surety bond if custody of client funds/securities', 35000, 60),
('CA', 'Financial Statement', 'document', 'Audited financial statement if managing over $100M', 0, 60),
('CA', 'Disclosure Document', 'document', 'State-specific disclosure document', 0, 45);

-- Florida Requirements
INSERT INTO public.ria_state_requirements (state, requirement_name, requirement_type, description, fee_amount, typical_processing_days) VALUES
('FL', 'Form ADV Part 1', 'document', 'Investment adviser registration form filed with IARD', 0, 30),
('FL', 'Form ADV Part 2A', 'document', 'Investment adviser brochure (firm brochure)', 0, 30),
('FL', 'State Registration Fee', 'fee', 'Florida state investment adviser registration fee', 250, 30),
('FL', 'Financial Statement', 'document', 'Balance sheet or audited financial statement', 0, 45),
('FL', 'Consent to Service', 'document', 'Consent to service of process', 0, 30);

-- New York Requirements
INSERT INTO public.ria_state_requirements (state, requirement_name, requirement_type, description, fee_amount, typical_processing_days) VALUES
('NY', 'Form ADV Part 1', 'document', 'Investment adviser registration form filed with IARD', 0, 60),
('NY', 'Form ADV Part 2A', 'document', 'Investment adviser brochure (firm brochure)', 0, 60),
('NY', 'State Registration Fee', 'fee', 'New York state investment adviser registration fee', 400, 60),
('NY', 'Financial Statement', 'document', 'Audited financial statement', 0, 60),
('NY', 'Net Capital Requirement', 'document', 'Proof of minimum net capital requirement', 0, 60);

-- Illinois Requirements
INSERT INTO public.ria_state_requirements (state, requirement_name, requirement_type, description, fee_amount, typical_processing_days) VALUES
('IL', 'Form ADV Part 1', 'document', 'Investment adviser registration form filed with IARD', 0, 45),
('IL', 'Form ADV Part 2A', 'document', 'Investment adviser brochure (firm brochure)', 0, 45),
('IL', 'State Registration Fee', 'fee', 'Illinois state investment adviser registration fee', 250, 45),
('IL', 'Financial Statement', 'document', 'Financial statement or balance sheet', 0, 45);

-- Seed State Checklists for Texas (Most Common)
INSERT INTO public.ria_state_checklists (state, requirement, doc_type, is_required, description, category, order_sequence, estimated_hours) VALUES
('TX', 'Complete Form ADV Part 1', 'form_adv_part1', true, 'Register investment adviser business information', 'disclosure', 1, 2.0),
('TX', 'Prepare Form ADV Part 2A', 'form_adv_part2a', true, 'Create firm brochure with business practices', 'disclosure', 2, 4.0),
('TX', 'Prepare Form ADV Part 2B', 'form_adv_part2b', true, 'Create individual adviser brochures', 'disclosure', 3, 2.0),
('TX', 'Draft Advisory Agreement', 'advisory_agreement', true, 'Template client advisory agreement', 'legal', 4, 3.0),
('TX', 'Create Code of Ethics', 'code_of_ethics', true, 'Written compliance and ethics policies', 'operational', 5, 2.0),
('TX', 'Prepare Financial Statement', 'financial_statement', true, 'Balance sheet or audited financials', 'financial', 6, 1.0),
('TX', 'Draft Privacy Policy', 'privacy_policy', true, 'Client information protection policy', 'legal', 7, 1.0),
('TX', 'Pay Registration Fee', 'fee_payment', true, 'Submit required state registration fee', 'financial', 8, 0.5),
('TX', 'Submit Application', 'application_submission', true, 'File complete application with state', 'general', 9, 1.0);

-- Add checklists for California
INSERT INTO public.ria_state_checklists (state, requirement, doc_type, is_required, description, category, order_sequence, estimated_hours) VALUES
('CA', 'Complete Form ADV Part 1', 'form_adv_part1', true, 'Register investment adviser business information', 'disclosure', 1, 2.0),
('CA', 'Prepare Form ADV Part 2A', 'form_adv_part2a', true, 'Create firm brochure with business practices', 'disclosure', 2, 4.0),
('CA', 'Prepare Form ADV Part 2B', 'form_adv_part2b', true, 'Create individual adviser brochures', 'disclosure', 3, 2.0),
('CA', 'Obtain Surety Bond', 'surety_bond', true, 'Required if custody of client assets', 'financial', 4, 2.0),
('CA', 'Prepare Financial Statement', 'financial_statement', true, 'Audited financial statement if over $100M AUM', 'financial', 5, 3.0),
('CA', 'Complete Disclosure Document', 'state_disclosure', true, 'California-specific disclosure requirements', 'disclosure', 6, 2.0),
('CA', 'Pay Registration Fee', 'fee_payment', true, 'Submit required state registration fee', 'financial', 7, 0.5),
('CA', 'Submit Application', 'application_submission', true, 'File complete application with state', 'general', 8, 1.0);