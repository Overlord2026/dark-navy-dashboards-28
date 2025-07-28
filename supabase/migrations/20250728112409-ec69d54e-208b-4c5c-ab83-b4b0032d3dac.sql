-- Create QA test users for each persona
-- WARNING: This is for development/QA testing only

DO $$
DECLARE
    user_id UUID;
    test_password_hash TEXT := crypt('Test1234!', gen_salt('bf'));
BEGIN
    -- 1. Client (Basic)
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.client@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"client","client_tier":"basic"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, client_tier, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.client@qa.local', 
        'client', 
        'basic',
        'Client', 
        'QA User',
        'Client QA User', 
        false, 
        now(), 
        now()
    );

    -- 2. Client Premium  
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.client.premium@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"client","client_tier":"premium"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, client_tier, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.client.premium@qa.local', 
        'client', 
        'premium',
        'Client Premium', 
        'QA User',
        'Client Premium QA User', 
        false, 
        now(), 
        now()
    );

    -- 3. Advisor
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.advisor@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"advisor"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.advisor@qa.local', 
        'advisor', 
        'Advisor', 
        'QA User',
        'Advisor QA User', 
        false, 
        now(), 
        now()
    );

    -- 4. Accountant
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.accountant@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"accountant"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.accountant@qa.local', 
        'accountant', 
        'Accountant', 
        'QA User',
        'Accountant QA User', 
        false, 
        now(), 
        now()
    );

    -- 5. Attorney
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.attorney@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"attorney"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.attorney@qa.local', 
        'attorney', 
        'Attorney', 
        'QA User',
        'Attorney QA User', 
        false, 
        now(), 
        now()
    );

    -- 6. Consultant
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.consultant@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"consultant"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.consultant@qa.local', 
        'consultant', 
        'Consultant', 
        'QA User',
        'Consultant QA User', 
        false, 
        now(), 
        now()
    );

    -- 7. Developer
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.developer@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"developer"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.developer@qa.local', 
        'developer', 
        'Developer', 
        'QA User',
        'Developer QA User', 
        false, 
        now(), 
        now()
    );

    -- 8. Admin
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.admin@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"admin"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.admin@qa.local', 
        'admin', 
        'Admin', 
        'QA User',
        'Admin QA User', 
        false, 
        now(), 
        now()
    );

    -- 9. Tenant Admin
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.tenant.admin@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"tenant_admin"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.tenant.admin@qa.local', 
        'tenant_admin', 
        'Tenant Admin', 
        'QA User',
        'Tenant Admin QA User', 
        false, 
        now(), 
        now()
    );

    -- 10. System Administrator
    user_id := gen_random_uuid();
    INSERT INTO auth.users (
        id, email, encrypted_password, email_confirmed_at, 
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data
    ) VALUES (
        user_id, 
        'persona.system.admin@qa.local', 
        test_password_hash,
        now(),
        now(), 
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"system_administrator"}'::jsonb
    );
    
    INSERT INTO public.profiles (
        id, email, role, first_name, last_name, 
        display_name, two_factor_enabled, created_at, updated_at
    ) VALUES (
        user_id, 
        'persona.system.admin@qa.local', 
        'system_administrator', 
        'System Admin', 
        'QA User',
        'System Admin QA User', 
        false, 
        now(), 
        now()
    );

    RAISE NOTICE 'Successfully created 10 QA test users with personas';
END $$;