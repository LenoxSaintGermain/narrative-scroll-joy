-- Add creator role for all existing users who don't have roles yet
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'creator'::app_role FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;