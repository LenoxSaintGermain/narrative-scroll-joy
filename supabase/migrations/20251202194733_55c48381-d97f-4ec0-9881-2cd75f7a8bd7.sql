-- Fix conflicting RLS policies on campground_prospects table
-- Remove the overly permissive public read policy that exposes sensitive data

DROP POLICY IF EXISTS "Enable read access for all users" ON public.campground_prospects;
DROP POLICY IF EXISTS "No anonymous reads" ON public.campground_prospects;

-- The "Admins read all prospects" policy already exists and properly restricts access