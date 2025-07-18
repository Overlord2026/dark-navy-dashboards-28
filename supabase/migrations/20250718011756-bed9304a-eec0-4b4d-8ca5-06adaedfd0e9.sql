-- Create test data with correct document types

-- Create additional test tenants
INSERT INTO public.tenants (id, name, brand_logo_url, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Test Tenant A', 'https://example.com/logo-a.png', now(), now()),
('22222222-2222-2222-2222-222222222222', 'Test Tenant B', 'https://example.com/logo-b.png', now(), now()),
('33333333-3333-3333-3333-333333333333', 'Test Tenant C', 'https://example.com/logo-c.png', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create test professionals for each tenant (using existing user ID)
INSERT INTO public.professionals (id, user_id, tenant_id, name, email, type, company, created_at, updated_at) VALUES
-- Tenant A professionals
('aaaaaaaa-1111-1111-1111-111111111111', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '11111111-1111-1111-1111-111111111111', 'Dr. Alice Smith', 'alice@tenanta.com', 'Financial Advisor', 'Tenant A Finance', now(), now()),
('aaaaaaaa-2222-2222-2222-222222222222', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '11111111-1111-1111-1111-111111111111', 'Bob Johnson CPA', 'bob@tenanta.com', 'Tax Professional', 'Tenant A Tax', now(), now()),
-- Tenant B professionals  
('bbbbbbbb-1111-1111-1111-111111111111', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '22222222-2222-2222-2222-222222222222', 'Carol Williams', 'carol@tenantb.com', 'Estate Planner', 'Tenant B Estate', now(), now()),
('bbbbbbbb-2222-2222-2222-222222222222', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '22222222-2222-2222-2222-222222222222', 'David Brown', 'david@tenantb.com', 'Investment Advisor', 'Tenant B Invest', now(), now()),
-- Tenant C professionals
('cccccccc-1111-1111-1111-111111111111', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '33333333-3333-3333-3333-333333333333', 'Eve Davis', 'eve@tenantc.com', 'Insurance Agent', 'Tenant C Insurance', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create test documents for each tenant (using correct document types)
INSERT INTO public.documents (id, user_id, tenant_id, name, type, category, file_path, created_at, updated_at) VALUES
-- Tenant A documents
('dddddaaa-1111-1111-1111-111111111111', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '11111111-1111-1111-1111-111111111111', 'Tenant A Financial Plan', 'pdf', 'Financial Planning', '/tenant-a/financial-plan.pdf', now(), now()),
('dddddaaa-2222-2222-2222-222222222222', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '11111111-1111-1111-1111-111111111111', 'Tenant A Tax Strategy', 'document', 'Tax Planning', '/tenant-a/tax-strategy.pdf', now(), now()),
-- Tenant B documents
('dddddbbb-1111-1111-1111-111111111111', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '22222222-2222-2222-2222-222222222222', 'Tenant B Estate Plan', 'pdf', 'Estate Planning', '/tenant-b/estate-plan.pdf', now(), now()),
('dddddbbb-2222-2222-2222-222222222222', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '22222222-2222-2222-2222-222222222222', 'Tenant B Investment Report', 'document', 'Investment', '/tenant-b/investment-report.pdf', now(), now()),
-- Tenant C documents
('dddddccc-1111-1111-1111-111111111111', '6256bdd2-ed8f-472c-a55f-a6b5044135d8', '33333333-3333-3333-3333-333333333333', 'Tenant C Insurance Policy', 'file', 'Insurance', '/tenant-c/insurance-policy.pdf', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create test investment strategies for each tenant
INSERT INTO public.investment_strategies (id, tenant_id, name, description, strategy_type, risk_level, is_visible, created_at, updated_at) VALUES
-- Tenant A strategies
('sssssaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Tenant A Conservative Portfolio', 'Low risk strategy for Tenant A clients', 'Conservative', 'Low', true, now(), now()),
('sssssaaa-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tenant A Growth Strategy', 'High growth strategy for Tenant A', 'Growth', 'High', true, now(), now()),
-- Tenant B strategies
('sssssbbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Tenant B Balanced Fund', 'Balanced approach for Tenant B', 'Balanced', 'Medium', true, now(), now()),
('sssssbbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Tenant B Income Strategy', 'Income focused for Tenant B clients', 'Income', 'Low', true, now(), now()),
-- Tenant C strategies
('sssssccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Tenant C Aggressive Growth', 'Aggressive strategy for Tenant C', 'Aggressive', 'High', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create test educational content for each tenant
INSERT INTO public.educational_content (id, tenant_id, title, description, content_type, is_visible, created_at, updated_at) VALUES
-- Tenant A content
('eeeeeaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Tenant A Financial Basics', 'Basic financial education for Tenant A', 'article', true, now(), now()),
('eeeeeaaa-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tenant A Tax Tips', 'Tax planning tips for Tenant A clients', 'video', true, now(), now()),
-- Tenant B content
('eeeeebbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Tenant B Estate Planning 101', 'Estate planning basics for Tenant B', 'article', true, now(), now()),
('eeeeebbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Tenant B Investment Guide', 'Investment guide for Tenant B clients', 'pdf', true, now(), now()),
-- Tenant C content
('eeeeeccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Tenant C Insurance Overview', 'Insurance overview for Tenant C', 'article', true, now(), now())
ON CONFLICT (id) DO NOTHING;