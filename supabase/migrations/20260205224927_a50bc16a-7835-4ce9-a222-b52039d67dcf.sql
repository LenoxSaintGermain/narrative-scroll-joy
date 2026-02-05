
-- ============================================
-- FIX 1: RLS references user_metadata (insecure)
-- FIX 2: Public data exposure on campground_prospects
-- Replace insecure user_metadata checks with proper user_roles table
-- ============================================

-- Drop all existing policies on campground_prospects
DROP POLICY IF EXISTS "Admins delete prospects" ON public.campground_prospects;
DROP POLICY IF EXISTS "Admins insert prospects" ON public.campground_prospects;
DROP POLICY IF EXISTS "Admins select prospects" ON public.campground_prospects;
DROP POLICY IF EXISTS "Admins update prospects" ON public.campground_prospects;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.campground_prospects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.campground_prospects;
DROP POLICY IF EXISTS "Enable update for all users" ON public.campground_prospects;
DROP POLICY IF EXISTS "Public can delete own session prospects" ON public.campground_prospects;

-- Create secure RLS policies using the existing has_role function
-- Only admins can access campground_prospects (contains sensitive contact info)

CREATE POLICY "Admins can select campground_prospects"
ON public.campground_prospects
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert campground_prospects"
ON public.campground_prospects
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campground_prospects"
ON public.campground_prospects
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campground_prospects"
ON public.campground_prospects
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX 3: Security Definer Views
-- Recreate views with security_invoker = true
-- ============================================

-- Drop and recreate my_campaign_assets with security_invoker
DROP VIEW IF EXISTS public.my_campaign_assets;
CREATE VIEW public.my_campaign_assets
WITH (security_invoker = on) AS
SELECT 
    name,
    last_accessed_at,
    created_at,
    updated_at,
    metadata,
    CASE
        WHEN (bucket_id = 'campaigns'::text) THEN name
        ELSE NULL::text
    END AS path
FROM storage.objects
WHERE ((bucket_id = 'campaigns'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text));

-- Drop and recreate investment_opportunities_unified with security_invoker
DROP VIEW IF EXISTS public.investment_opportunities_investor_ready;
DROP VIEW IF EXISTS public.investment_opportunities_unified;

CREATE VIEW public.investment_opportunities_unified
WITH (security_invoker = on) AS
SELECT io.id,
    io.title,
    io.summary,
    io.category,
    io.tags,
    io.status,
    io.investment_dossier,
    io.analysis_scores,
    io.source_case_study_id,
    io.source_inbox_id,
    COALESCE(io.cover_image_url,
        CASE
            WHEN ((jsonb_typeof(cs.generated_images_data) = 'array'::text) AND (jsonb_array_length(cs.generated_images_data) > 0)) THEN ((cs.generated_images_data -> 0) ->> 'imageData'::text)
            ELSE NULL::text
        END, ( SELECT h.generated_url
           FROM image_generation_history h
          WHERE ((h.image_type = 'case_study_image'::text) AND ((h.context_data ->> 'case_study_id'::text) = (io.id)::text) AND (h.generated_url IS NOT NULL) AND (h.status = ANY (ARRAY['success'::text, 'completed'::text])))
          ORDER BY h.generated_at DESC, h.id DESC
         LIMIT 1), ( SELECT h.generated_url
           FROM image_generation_history h
          WHERE ((h.image_type = 'case_study_image'::text) AND ((h.context_data ->> 'case_study_id'::text) = (io.source_case_study_id)::text) AND (h.generated_url IS NOT NULL) AND (h.status = ANY (ARRAY['success'::text, 'completed'::text])))
          ORDER BY h.generated_at DESC, h.id DESC
         LIMIT 1)) AS cover_image_url,
    cs.prd_data AS prd,
    cs.audiences_data AS audiences,
    cs.visual_concepts_data AS visual_concepts,
    (cs.prd_data -> 'features'::text) AS features,
    (cs.prd_data ->> 'problem'::text) AS problem,
    (cs.prd_data ->> 'solution'::text) AS solution,
    cs.social_posts_data,
    io.created_at,
    io.updated_at
FROM (investment_opportunities io
     LEFT JOIN case_studies cs ON ((cs.id = io.source_case_study_id)))
UNION ALL
SELECT cs.id,
    COALESCE((cs.card_data ->> 'headline'::text), cs.raw_idea, 'Untitled Opportunity'::text) AS title,
    COALESCE((cs.card_data ->> 'subheadline'::text), cs.raw_idea, 'Investment opportunity'::text) AS summary,
    COALESCE(NULLIF(((cs.card_data -> 'tags'::text) ->> 0), ''::text), 'Opportunity'::text) AS category,
    CASE
        WHEN (jsonb_typeof((cs.card_data -> 'tags'::text)) = 'array'::text) THEN ( SELECT array_agg(tag.value) AS array_agg
           FROM jsonb_array_elements_text((cs.card_data -> 'tags'::text)) tag(value))
        ELSE ARRAY[]::text[]
    END AS tags,
    CASE
        WHEN (cs.status = 'published'::text) THEN 'validated'::text
        ELSE 'draft'::text
    END AS status,
    NULL::jsonb AS investment_dossier,
    (cs.analysis_data -> 'scores'::text) AS analysis_scores,
    cs.id AS source_case_study_id,
    NULL::uuid AS source_inbox_id,
    COALESCE(
        CASE
            WHEN ((jsonb_typeof(cs.generated_images_data) = 'array'::text) AND (jsonb_array_length(cs.generated_images_data) > 0)) THEN ((cs.generated_images_data -> 0) ->> 'imageData'::text)
            ELSE NULL::text
        END, ( SELECT h.generated_url
           FROM image_generation_history h
          WHERE ((h.image_type = 'case_study_image'::text) AND ((h.context_data ->> 'case_study_id'::text) = (cs.id)::text) AND (h.generated_url IS NOT NULL) AND (h.status = ANY (ARRAY['success'::text, 'completed'::text])))
          ORDER BY h.generated_at DESC, h.id DESC
         LIMIT 1)) AS cover_image_url,
    cs.prd_data AS prd,
    cs.audiences_data AS audiences,
    cs.visual_concepts_data AS visual_concepts,
    (cs.prd_data -> 'features'::text) AS features,
    (cs.prd_data ->> 'problem'::text) AS problem,
    (cs.prd_data ->> 'solution'::text) AS solution,
    cs.social_posts_data,
    cs.created_at,
    cs.updated_at
FROM (case_studies cs
     LEFT JOIN investment_opportunities io ON ((io.source_case_study_id = cs.id)))
WHERE ((io.id IS NULL) AND (cs.status = 'published'::text));

-- Recreate investment_opportunities_investor_ready with security_invoker
CREATE VIEW public.investment_opportunities_investor_ready
WITH (security_invoker = on) AS
SELECT id,
    title,
    summary,
    category,
    tags,
    status,
    investment_dossier,
    analysis_scores,
    source_case_study_id,
    source_inbox_id,
    cover_image_url,
    prd,
    audiences,
    visual_concepts,
    features,
    problem,
    solution,
    social_posts_data,
    created_at,
    updated_at
FROM investment_opportunities_unified
WHERE ((status = ANY (ARRAY['validated'::text, 'designed'::text, 'active_experiment'::text, 'prototyped'::text, 'alpha'::text])) AND (((analysis_scores ->> 'overall'::text) IS NULL) OR (((analysis_scores ->> 'overall'::text))::numeric >= (7)::numeric)));
