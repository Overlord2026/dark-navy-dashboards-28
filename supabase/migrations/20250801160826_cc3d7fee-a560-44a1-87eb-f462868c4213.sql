-- Create attorney onboarding table
CREATE TABLE public.attorney_onboarding (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID,
    current_step TEXT NOT NULL DEFAULT 'personal_info',
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    office_address TEXT,
    firm_name TEXT,
    firm_website TEXT,
    attorney_bio TEXT,
    bar_number TEXT,
    primary_jurisdiction TEXT,
    jurisdictions_licensed TEXT[],
    admission_dates JSONB,
    bar_status TEXT DEFAULT 'active',
    cle_hours_completed INTEGER DEFAULT 0,
    cle_hours_required INTEGER DEFAULT 24,
    cle_expiration_date DATE,
    cle_compliance_status TEXT DEFAULT 'pending',
    primary_practice_area TEXT,
    practice_areas TEXT[],
    years_experience INTEGER,
    specializations TEXT[],
    hourly_rate DECIMAL(10,2),
    consultation_fee DECIMAL(10,2),
    billing_method TEXT DEFAULT 'hourly',
    retainer_required BOOLEAN DEFAULT false,
    typical_retainer_amount DECIMAL(10,2),
    terms_accepted BOOLEAN DEFAULT false,
    nda_signed BOOLEAN DEFAULT false,
    participation_agreement_signed BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attorney documents table
CREATE TABLE public.attorney_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    onboarding_id UUID NOT NULL REFERENCES public.attorney_onboarding(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    status TEXT DEFAULT 'pending',
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.attorney_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attorney_onboarding
CREATE POLICY "Users can view their own attorney onboarding" 
ON public.attorney_onboarding FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attorney onboarding" 
ON public.attorney_onboarding FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attorney onboarding" 
ON public.attorney_onboarding FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all attorney onboardings"
ON public.attorney_onboarding FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator', 'tenant_admin')
));

-- Create RLS policies for attorney_documents
CREATE POLICY "Users can view their own attorney documents" 
ON public.attorney_documents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attorney documents" 
ON public.attorney_documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attorney documents" 
ON public.attorney_documents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attorney documents" 
ON public.attorney_documents FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all attorney documents"
ON public.attorney_documents FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'system_administrator', 'tenant_admin')
));

-- Create triggers for updated_at
CREATE TRIGGER update_attorney_onboarding_updated_at
    BEFORE UPDATE ON public.attorney_onboarding
    FOR EACH ROW
    EXECUTE FUNCTION public.update_modified_column();

-- Create RPC functions
CREATE OR REPLACE FUNCTION public.get_attorney_onboardings(p_user_id UUID DEFAULT auth.uid())
RETURNS TABLE(
    id UUID,
    user_id UUID,
    tenant_id UUID,
    current_step TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    office_address TEXT,
    firm_name TEXT,
    firm_website TEXT,
    attorney_bio TEXT,
    bar_number TEXT,
    primary_jurisdiction TEXT,
    jurisdictions_licensed TEXT[],
    admission_dates JSONB,
    bar_status TEXT,
    cle_hours_completed INTEGER,
    cle_hours_required INTEGER,
    cle_expiration_date DATE,
    cle_compliance_status TEXT,
    primary_practice_area TEXT,
    practice_areas TEXT[],
    years_experience INTEGER,
    specializations TEXT[],
    hourly_rate DECIMAL,
    consultation_fee DECIMAL,
    billing_method TEXT,
    retainer_required BOOLEAN,
    typical_retainer_amount DECIMAL,
    terms_accepted BOOLEAN,
    nda_signed BOOLEAN,
    participation_agreement_signed BOOLEAN,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM public.attorney_onboarding 
    WHERE attorney_onboarding.user_id = p_user_id
    ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.create_attorney_onboarding(
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    onboarding_id UUID;
BEGIN
    INSERT INTO public.attorney_onboarding (
        user_id, first_name, last_name, email, phone
    ) VALUES (
        auth.uid(), p_first_name, p_last_name, p_email, p_phone
    ) RETURNING id INTO onboarding_id;
    
    RETURN onboarding_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_onboarding_documents(p_onboarding_id UUID)
RETURNS TABLE(
    id UUID,
    onboarding_id UUID,
    user_id UUID,
    document_type TEXT,
    document_name TEXT,
    file_path TEXT,
    file_size BIGINT,
    status TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM public.attorney_documents 
    WHERE attorney_documents.onboarding_id = p_onboarding_id
    ORDER BY uploaded_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.update_onboarding_status(
    p_onboarding_id UUID,
    p_status TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.attorney_onboarding 
    SET status = p_status, updated_at = now()
    WHERE id = p_onboarding_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_onboarding_reminder(p_onboarding_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- This function would typically trigger an email reminder
    -- For now, we'll just update the updated_at timestamp
    UPDATE public.attorney_onboarding 
    SET updated_at = now()
    WHERE id = p_onboarding_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_attorney_document(
    p_onboarding_id UUID,
    p_document_type TEXT,
    p_document_name TEXT,
    p_file_path TEXT,
    p_file_size BIGINT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    document_id UUID;
BEGIN
    INSERT INTO public.attorney_documents (
        onboarding_id, user_id, document_type, document_name, file_path, file_size
    ) VALUES (
        p_onboarding_id, auth.uid(), p_document_type, p_document_name, p_file_path, p_file_size
    ) RETURNING id INTO document_id;
    
    RETURN document_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_attorney_document(p_document_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.attorney_documents 
    WHERE id = p_document_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_attorney_onboarding(p_onboarding_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.attorney_onboarding 
    SET status = 'completed', updated_at = now()
    WHERE id = p_onboarding_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$;