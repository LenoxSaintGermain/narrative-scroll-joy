-- Add new columns to narratives for cover generation and categorization
ALTER TABLE public.narratives 
ADD COLUMN IF NOT EXISTS genre text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS ai_cover_prompt text,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create story engagements table for social features
CREATE TABLE public.story_engagements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  narrative_id uuid NOT NULL REFERENCES public.narratives(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  engagement_type text NOT NULL CHECK (engagement_type IN ('shelve', 'ovation', 'view')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(narrative_id, session_id, engagement_type)
);

-- Enable RLS
ALTER TABLE public.story_engagements ENABLE ROW LEVEL SECURITY;

-- Anyone can view engagement counts
CREATE POLICY "Anyone can view engagements"
ON public.story_engagements
FOR SELECT
USING (true);

-- Anyone can add engagements (anonymous support)
CREATE POLICY "Anyone can add engagements"
ON public.story_engagements
FOR INSERT
WITH CHECK (true);

-- Users can remove their own engagements
CREATE POLICY "Users can remove own engagements"
ON public.story_engagements
FOR DELETE
USING (true);

-- Create index for fast lookups
CREATE INDEX idx_story_engagements_narrative ON public.story_engagements(narrative_id);
CREATE INDEX idx_story_engagements_type ON public.story_engagements(engagement_type);