-- Insert sample investment models for testing
DO $$
DECLARE
    demo_tenant_id uuid;
    admin_user_id uuid;
BEGIN
    -- Get a tenant ID and admin user for seeding
    SELECT id INTO demo_tenant_id FROM public.profiles WHERE role IN ('admin', 'system_administrator') LIMIT 1;
    SELECT id INTO admin_user_id FROM public.profiles WHERE role IN ('admin', 'system_administrator') LIMIT 1;
    
    -- Only insert if we have valid tenant and user
    IF demo_tenant_id IS NOT NULL AND admin_user_id IS NOT NULL THEN
        INSERT INTO public.investment_models (
            tenant_id, 
            name, 
            description, 
            risk_level, 
            target_allocation, 
            model_securities, 
            fee_structure, 
            tax_efficiency_score, 
            created_by
        ) VALUES
        (
            demo_tenant_id,
            'Conservative Growth',
            'Low-risk portfolio focused on capital preservation with modest growth',
            3,
            '{"equity": 40, "bond": 50, "alternative": 5, "cash": 5}',
            '[
                {"ticker": "VTI", "weight": 0.25, "asset_class": "equity"},
                {"ticker": "VEA", "weight": 0.15, "asset_class": "international_equity"},
                {"ticker": "BND", "weight": 0.40, "asset_class": "bond"},
                {"ticker": "VTEB", "weight": 0.10, "asset_class": "municipal_bond"},
                {"ticker": "REIT", "weight": 0.05, "asset_class": "real_estate"},
                {"ticker": "CASH", "weight": 0.05, "asset_class": "cash"}
            ]',
            '{"management_fee": 0.0075, "performance_fee": 0.0}',
            8.5
        ),
        (
            demo_tenant_id,
            'Balanced Portfolio',
            'Moderate risk portfolio balancing growth and income',
            5,
            '{"equity": 60, "bond": 30, "alternative": 8, "cash": 2}',
            '[
                {"ticker": "VTI", "weight": 0.35, "asset_class": "equity"},
                {"ticker": "VEA", "weight": 0.15, "asset_class": "international_equity"},
                {"ticker": "VWO", "weight": 0.10, "asset_class": "emerging_markets"},
                {"ticker": "BND", "weight": 0.25, "asset_class": "bond"},
                {"ticker": "VTEB", "weight": 0.05, "asset_class": "municipal_bond"},
                {"ticker": "REIT", "weight": 0.08, "asset_class": "real_estate"},
                {"ticker": "CASH", "weight": 0.02, "asset_class": "cash"}
            ]',
            '{"management_fee": 0.0100, "performance_fee": 0.0}',
            7.0
        ),
        (
            demo_tenant_id,
            'Growth Focused',
            'Higher risk portfolio emphasizing capital appreciation',
            7,
            '{"equity": 80, "bond": 10, "alternative": 8, "cash": 2}',
            '[
                {"ticker": "VTI", "weight": 0.50, "asset_class": "equity"},
                {"ticker": "VEA", "weight": 0.20, "asset_class": "international_equity"},
                {"ticker": "VWO", "weight": 0.10, "asset_class": "emerging_markets"},
                {"ticker": "BND", "weight": 0.10, "asset_class": "bond"},
                {"ticker": "REIT", "weight": 0.08, "asset_class": "real_estate"},
                {"ticker": "CASH", "weight": 0.02, "asset_class": "cash"}
            ]',
            '{"management_fee": 0.0125, "performance_fee": 0.05}',
            6.0
        ),
        (
            demo_tenant_id,
            'ESG Sustainable',
            'Environmentally and socially responsible investment approach',
            6,
            '{"equity": 70, "bond": 20, "alternative": 8, "cash": 2}',
            '[
                {"ticker": "VTI", "weight": 0.40, "asset_class": "equity"},
                {"ticker": "VEA", "weight": 0.20, "asset_class": "international_equity"},
                {"ticker": "VWO", "weight": 0.10, "asset_class": "emerging_markets"},
                {"ticker": "BND", "weight": 0.15, "asset_class": "bond"},
                {"ticker": "VTEB", "weight": 0.05, "asset_class": "municipal_bond"},
                {"ticker": "REIT", "weight": 0.08, "asset_class": "real_estate"},
                {"ticker": "CASH", "weight": 0.02, "asset_class": "cash"}
            ]',
            '{"management_fee": 0.0110, "performance_fee": 0.0}',
            7.5
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;