-- Create storage bucket for education content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('education-content', 'education-content', true);

-- Create policies for education content bucket
CREATE POLICY "Anyone can view education content" ON storage.objects
FOR SELECT USING (bucket_id = 'education-content');

CREATE POLICY "Authenticated users can upload education content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'education-content' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own education content" ON storage.objects
FOR UPDATE USING (bucket_id = 'education-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own education content" ON storage.objects
FOR DELETE USING (bucket_id = 'education-content' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create education content table
CREATE TABLE IF NOT EXISTS public.education_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'course', 'book', 'video', 'pdf')),
    category TEXT NOT NULL CHECK (category IN ('Tax', 'Retirement', 'Estate', 'Investment', 'Insurance', 'Planning', 'Business')),
    difficulty TEXT NOT NULL DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    author TEXT,
    duration TEXT,
    rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    tags TEXT[] DEFAULT '{}',
    badges TEXT[] DEFAULT '{}',
    
    -- File paths for uploaded content
    pdf_path TEXT,
    cover_image_path TEXT,
    video_url TEXT,
    external_url TEXT,
    
    -- Metadata
    file_size BIGINT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    
    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Tenant support
    tenant_id UUID,
    
    CONSTRAINT valid_content_requirements CHECK (
        (content_type = 'guide' AND pdf_path IS NOT NULL) OR
        (content_type = 'course' AND video_url IS NOT NULL) OR
        (content_type = 'book' AND external_url IS NOT NULL) OR
        (content_type = 'video' AND video_url IS NOT NULL) OR
        (content_type = 'pdf' AND pdf_path IS NOT NULL)
    )
);

-- Enable RLS
ALTER TABLE public.education_content ENABLE ROW LEVEL SECURITY;

-- Create policies for education content
CREATE POLICY "Anyone can view published education content" ON public.education_content
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all education content" ON public.education_content
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'system_administrator', 'tenant_admin')
    )
);

CREATE POLICY "Users can create education content" ON public.education_content
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create content upload log table
CREATE TABLE IF NOT EXISTS public.content_upload_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES public.education_content(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'deleted', 'published', 'unpublished')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES auth.users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    tenant_id UUID,
    notes TEXT
);

-- Enable RLS for upload log
ALTER TABLE public.content_upload_log ENABLE ROW LEVEL SECURITY;

-- Create policy for content upload log
CREATE POLICY "Admins can view content upload logs" ON public.content_upload_log
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'system_administrator', 'tenant_admin')
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for education content
CREATE TRIGGER update_education_content_updated_at
    BEFORE UPDATE ON public.education_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to log content changes
CREATE OR REPLACE FUNCTION log_education_content_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.content_upload_log (content_id, action_type, new_data, performed_by)
        VALUES (NEW.id, 'created', to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.content_upload_log (content_id, action_type, old_data, new_data, performed_by)
        VALUES (NEW.id, 'updated', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.content_upload_log (content_id, action_type, old_data, performed_by)
        VALUES (OLD.id, 'deleted', to_jsonb(OLD), auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for logging changes
CREATE TRIGGER log_education_content_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.education_content
    FOR EACH ROW
    EXECUTE FUNCTION log_education_content_changes();