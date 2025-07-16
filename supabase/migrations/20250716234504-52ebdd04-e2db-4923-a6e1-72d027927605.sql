-- Add client_segment to profiles table
ALTER TABLE public.profiles ADD COLUMN client_segment TEXT;

-- Track every interaction with books, guides, videos, tools, courses
CREATE TABLE public.user_content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  interaction_type TEXT DEFAULT 'view',
  accessed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track downloads
CREATE TABLE public.user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource_id TEXT NOT NULL,
  resource_name TEXT,
  resource_type TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track course progress
CREATE TABLE public.user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT,
  progress_percentage NUMERIC DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Track webinar registration/attendance
CREATE TABLE public.webinar_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  webinar_id TEXT NOT NULL,
  webinar_title TEXT,
  registered_at TIMESTAMPTZ DEFAULT now(),
  attended BOOLEAN DEFAULT FALSE,
  attendance_duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Track user saved content (reading lists, bookmarks)
CREATE TABLE public.user_saved_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_content_interactions
CREATE POLICY "Users can view their own content interactions"
ON public.user_content_interactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content interactions"
ON public.user_content_interactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_downloads
CREATE POLICY "Users can view their own downloads"
ON public.user_downloads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own downloads"
ON public.user_downloads FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_course_progress
CREATE POLICY "Users can view their own course progress"
ON public.user_course_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course progress"
ON public.user_course_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress"
ON public.user_course_progress FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for webinar_registrations
CREATE POLICY "Users can view their own webinar registrations"
ON public.webinar_registrations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webinar registrations"
ON public.webinar_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webinar registrations"
ON public.webinar_registrations FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for user_saved_content
CREATE POLICY "Users can view their own saved content"
ON public.user_saved_content FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved content"
ON public.user_saved_content FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved content"
ON public.user_saved_content FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_content_interactions_user_id ON public.user_content_interactions(user_id);
CREATE INDEX idx_user_content_interactions_content_id ON public.user_content_interactions(content_id);
CREATE INDEX idx_user_downloads_user_id ON public.user_downloads(user_id);
CREATE INDEX idx_user_course_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON public.user_course_progress(course_id);
CREATE INDEX idx_webinar_registrations_user_id ON public.webinar_registrations(user_id);
CREATE INDEX idx_user_saved_content_user_id ON public.user_saved_content(user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_course_progress_updated_at
  BEFORE UPDATE ON public.user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webinar_registrations_updated_at
  BEFORE UPDATE ON public.webinar_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();