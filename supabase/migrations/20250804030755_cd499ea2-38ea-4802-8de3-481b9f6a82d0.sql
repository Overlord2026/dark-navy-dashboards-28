-- Insert system audit templates
INSERT INTO public.audit_templates (name, audit_type, description, checklist_items, evidence_requirements) VALUES
('SEC RIA Examination Template', 'SEC', 'Standard SEC examination checklist for Registered Investment Advisors', 
'[
  {"id": 1, "item": "ADV Form accuracy and completeness", "category": "Registration", "critical": true},
  {"id": 2, "item": "Investment advisory agreements", "category": "Client Relations", "critical": true},
  {"id": 3, "item": "Fee calculation and billing practices", "category": "Fees", "critical": true},
  {"id": 4, "item": "Code of ethics implementation", "category": "Ethics", "critical": true},
  {"id": 5, "item": "Custody arrangements and safeguarding", "category": "Custody", "critical": true},
  {"id": 6, "item": "Performance advertising compliance", "category": "Marketing", "critical": false},
  {"id": 7, "item": "Books and records maintenance", "category": "Recordkeeping", "critical": true}
]', 
'[
  {"category": "Registration", "documents": ["Current ADV Part 1", "ADV Part 2", "State registrations"]},
  {"category": "Client Relations", "documents": ["Sample advisory agreements", "Client communications"]},
  {"category": "Fees", "documents": ["Fee schedules", "Billing records", "Performance reports"]}
]'),

('State RIA Audit Template', 'STATE', 'State-level RIA examination template', 
'[
  {"id": 1, "item": "State registration status", "category": "Registration", "critical": true},
  {"id": 2, "item": "Notice filings compliance", "category": "Filing", "critical": true},
  {"id": 3, "item": "Investment adviser representative supervision", "category": "Supervision", "critical": true},
  {"id": 4, "item": "Client suitability procedures", "category": "Suitability", "critical": true}
]',
'[
  {"category": "Registration", "documents": ["State registration certificates", "Renewal receipts"]},
  {"category": "Filing", "documents": ["Notice filing confirmations", "Fee payment receipts"]}
]'),

('FINRA Broker-Dealer Examination', 'FINRA', 'FINRA examination checklist for broker-dealers',
'[
  {"id": 1, "item": "Registration and licensing", "category": "Registration", "critical": true},
  {"id": 2, "item": "Customer account documentation", "category": "Accounts", "critical": true},
  {"id": 3, "item": "Suitability and know your customer", "category": "Suitability", "critical": true},
  {"id": 4, "item": "Anti-money laundering program", "category": "AML", "critical": true},
  {"id": 5, "item": "Supervision procedures", "category": "Supervision", "critical": true}
]',
'[
  {"category": "Registration", "documents": ["BD registration", "Representative licenses"]},
  {"category": "AML", "documents": ["AML procedures", "Training records", "Suspicious activity reports"]}
]');

-- Insert sample regulatory alerts
INSERT INTO public.regulatory_alerts (title, content, alert_type, severity, regulatory_body, effective_date, action_required, action_items) VALUES
('SEC Marketing Rule Updates', 'The SEC has issued new guidance on the Marketing Rule requirements for investment advisers. All RIAs must review their advertising and client communication practices.', 'SEC', 'high', 'Securities and Exchange Commission', '2024-02-01', true, 
ARRAY['Review current marketing materials', 'Update compliance procedures', 'Train staff on new requirements', 'Document compliance efforts']),

('FINRA Cybersecurity Notice', 'FINRA has released updated cybersecurity requirements for broker-dealers. Firms must assess their cybersecurity programs and implement enhanced controls.', 'FINRA', 'medium', 'Financial Industry Regulatory Authority', '2024-01-15', true,
ARRAY['Conduct cybersecurity assessment', 'Update written cybersecurity procedures', 'Provide staff training', 'Report any incidents']),

('State Filing Deadline Reminder', 'Annual state registration renewals are due by March 31, 2024. Ensure all required filings and fees are submitted timely.', 'STATE', 'medium', 'State Securities Regulators', '2024-03-31', true,
ARRAY['Prepare renewal filings', 'Calculate renewal fees', 'Submit before deadline', 'Update any material changes']);