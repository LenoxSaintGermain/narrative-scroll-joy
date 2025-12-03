-- Add generation fields to narratives table
ALTER TABLE public.narratives ADD COLUMN IF NOT EXISTS generated_by TEXT DEFAULT 'human';
ALTER TABLE public.narratives ADD COLUMN IF NOT EXISTS generation_prompt TEXT;
ALTER TABLE public.narratives ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT 'general';
ALTER TABLE public.narratives ADD COLUMN IF NOT EXISTS visual_style TEXT;
ALTER TABLE public.narratives ADD COLUMN IF NOT EXISTS generation_metadata JSONB DEFAULT '{}';

-- Add beat fields to frames table
ALTER TABLE public.frames ADD COLUMN IF NOT EXISTS beat_title TEXT;
ALTER TABLE public.frames ADD COLUMN IF NOT EXISTS visual_prompt TEXT;
ALTER TABLE public.frames ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
ALTER TABLE public.frames ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0;

-- Create generation_logs table for cost tracking
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  narrative_id UUID REFERENCES public.narratives(id) ON DELETE SET NULL,
  operation_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  model_used TEXT,
  prompt_preview TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on generation_logs
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own logs
CREATE POLICY "Users can view own generation logs" ON public.generation_logs
FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert own generation logs" ON public.generation_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_created 
ON public.generation_logs(user_id, created_at DESC);