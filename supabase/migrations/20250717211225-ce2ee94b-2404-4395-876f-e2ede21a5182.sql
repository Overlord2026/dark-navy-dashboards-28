-- Create user downloads tracking table
CREATE TABLE public.user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source_segment TEXT,
  email_captured TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user bookmarks table
CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, content_id, content_type)
);

-- Create course progress tracking table
CREATE TABLE public.user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_downloads
CREATE POLICY "Users can view their own downloads" ON public.user_downloads 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own downloads" ON public.user_downloads 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert downloads" ON public.user_downloads 
  FOR INSERT WITH CHECK (true);

-- Create policies for user_bookmarks
CREATE POLICY "Users can view their own bookmarks" ON public.user_bookmarks 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" ON public.user_bookmarks 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.user_bookmarks 
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_course_progress
CREATE POLICY "Users can view their own course progress" ON public.user_course_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course progress" ON public.user_course_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" ON public.user_course_progress 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for course progress updated_at
CREATE OR REPLACE FUNCTION public.update_course_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON public.user_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_progress_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_user_downloads_user_id ON public.user_downloads(user_id);
CREATE INDEX idx_user_downloads_content_type ON public.user_downloads(content_type);
CREATE INDEX idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);
CREATE INDEX idx_user_course_progress_user_id ON public.user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON public.user_course_progress(course_id);