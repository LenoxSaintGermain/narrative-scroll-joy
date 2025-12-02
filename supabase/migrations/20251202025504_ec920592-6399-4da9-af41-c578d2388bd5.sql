-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum for story status
create type story_status as enum ('draft', 'published', 'archived');

-- Create enum for media types  
create type media_type as enum ('image', 'video', 'audio');

-- Create enum for generation status
create type generation_status as enum ('pending', 'processing', 'completed', 'failed');

-- User roles table for multi-user support
create type app_role as enum ('admin', 'creator', 'viewer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'creator',
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Story frameworks table (pre-built narrative templates)
create table public.story_frameworks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  beat_count integer not null default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.story_frameworks enable row level security;

-- Framework beats (individual story beats within frameworks)
create table public.framework_beats (
  id uuid primary key default gen_random_uuid(),
  framework_id uuid references public.story_frameworks(id) on delete cascade not null,
  beat_number integer not null,
  beat_name text not null,
  guidance_text text,
  created_at timestamp with time zone default now()
);

alter table public.framework_beats enable row level security;

-- Narratives table (top-level story container)
create table public.narratives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  framework_id uuid references public.story_frameworks(id) on delete set null,
  status story_status default 'draft',
  thumbnail_url text,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.narratives enable row level security;

-- Chapters table (organizational groupings)
create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  narrative_id uuid references public.narratives(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.chapters enable row level security;

-- Frames table (individual story beats)
create table public.frames (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete cascade not null,
  narrative_content text,
  beat_id uuid references public.framework_beats(id) on delete set null,
  order_index integer not null default 0,
  ai_prompt_history jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.frames enable row level security;

-- Media assets table (generated images/videos)
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  frame_id uuid references public.frames(id) on delete cascade not null,
  media_type media_type not null default 'image',
  media_url text not null,
  thumbnail_url text,
  generation_prompt text,
  generation_model text,
  generation_status generation_status default 'completed',
  width integer,
  height integer,
  file_size bigint,
  created_at timestamp with time zone default now()
);

alter table public.media_assets enable row level security;

-- Insert default story frameworks
insert into public.story_frameworks (name, description, beat_count) values
('Hero''s Journey', '12-stage narrative structure following the classic monomyth', 12),
('Three-Act Structure', 'Classic screenplay structure with setup, confrontation, and resolution', 3),
('Save the Cat', '15-beat structure for screenwriting', 15),
('Five-Act Structure', 'Classical dramatic structure with five distinct acts', 5),
('Freeform', 'No predefined structure - create your own narrative flow', 0);

-- Insert Hero's Journey beats
insert into public.framework_beats (framework_id, beat_number, beat_name, guidance_text)
select id, beat_number, beat_name, guidance from public.story_frameworks, 
(values 
  (1, 'Ordinary World', 'Introduce the hero in their normal life before the adventure'),
  (2, 'Call to Adventure', 'The hero is presented with a challenge or quest'),
  (3, 'Refusal of the Call', 'The hero hesitates or refuses the adventure'),
  (4, 'Meeting the Mentor', 'The hero encounters a wise figure who provides guidance'),
  (5, 'Crossing the Threshold', 'The hero commits to the adventure and enters the special world'),
  (6, 'Tests, Allies, Enemies', 'The hero faces challenges and meets friends and foes'),
  (7, 'Approach to the Inmost Cave', 'The hero prepares for the major challenge'),
  (8, 'The Ordeal', 'The hero faces their greatest fear or challenge'),
  (9, 'Reward', 'The hero achieves their goal and receives their reward'),
  (10, 'The Road Back', 'The hero begins the journey back to the ordinary world'),
  (11, 'Resurrection', 'The hero faces a final test and is transformed'),
  (12, 'Return with the Elixir', 'The hero returns home with knowledge or power to help others')
) as beats(beat_number, beat_name, guidance)
where story_frameworks.name = 'Hero''s Journey';

-- Insert Three-Act Structure beats
insert into public.framework_beats (framework_id, beat_number, beat_name, guidance_text)
select id, beat_number, beat_name, guidance from public.story_frameworks,
(values
  (1, 'Act I: Setup', 'Introduce characters, setting, and the central conflict'),
  (2, 'Act II: Confrontation', 'Develop the conflict with rising action and complications'),
  (3, 'Act III: Resolution', 'Resolve the conflict and conclude character arcs')
) as beats(beat_number, beat_name, guidance)
where story_frameworks.name = 'Three-Act Structure';

-- RLS Policies for user_roles
create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage all roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- Story frameworks policies (public read)
create policy "Anyone can view active frameworks"
  on public.story_frameworks for select
  using (is_active = true);

create policy "Admins can manage frameworks"
  on public.story_frameworks for all
  using (public.has_role(auth.uid(), 'admin'));

-- Framework beats policies (public read)
create policy "Anyone can view framework beats"
  on public.framework_beats for select
  using (true);

create policy "Admins can manage beats"
  on public.framework_beats for all
  using (public.has_role(auth.uid(), 'admin'));

-- Narratives policies
create policy "Users can view own narratives"
  on public.narratives for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can create narratives"
  on public.narratives for insert
  with check (auth.uid() = user_id);

create policy "Users can update own narratives"
  on public.narratives for update
  using (auth.uid() = user_id);

create policy "Users can delete own narratives"
  on public.narratives for delete
  using (auth.uid() = user_id);

-- Chapters policies
create policy "Users can view chapters of accessible narratives"
  on public.chapters for select
  using (
    exists (
      select 1 from public.narratives
      where narratives.id = chapters.narrative_id
      and (narratives.user_id = auth.uid() or narratives.is_public = true)
    )
  );

create policy "Users can manage chapters in own narratives"
  on public.chapters for all
  using (
    exists (
      select 1 from public.narratives
      where narratives.id = chapters.narrative_id
      and narratives.user_id = auth.uid()
    )
  );

-- Frames policies
create policy "Users can view frames of accessible narratives"
  on public.frames for select
  using (
    exists (
      select 1 from public.chapters
      join public.narratives on narratives.id = chapters.narrative_id
      where chapters.id = frames.chapter_id
      and (narratives.user_id = auth.uid() or narratives.is_public = true)
    )
  );

create policy "Users can manage frames in own narratives"
  on public.frames for all
  using (
    exists (
      select 1 from public.chapters
      join public.narratives on narratives.id = chapters.narrative_id
      where chapters.id = frames.chapter_id
      and narratives.user_id = auth.uid()
    )
  );

-- Media assets policies
create policy "Users can view media of accessible narratives"
  on public.media_assets for select
  using (
    exists (
      select 1 from public.frames
      join public.chapters on chapters.id = frames.chapter_id
      join public.narratives on narratives.id = chapters.narrative_id
      where frames.id = media_assets.frame_id
      and (narratives.user_id = auth.uid() or narratives.is_public = true)
    )
  );

create policy "Users can manage media in own narratives"
  on public.media_assets for all
  using (
    exists (
      select 1 from public.frames
      join public.chapters on chapters.id = frames.chapter_id
      join public.narratives on narratives.id = chapters.narrative_id
      where frames.id = media_assets.frame_id
      and narratives.user_id = auth.uid()
    )
  );

-- Create storage bucket for story media
insert into storage.buckets (id, name, public)
values ('story-media', 'story-media', true)
on conflict do nothing;

-- Storage policies for story media
create policy "Anyone can view story media"
  on storage.objects for select
  using (bucket_id = 'story-media');

create policy "Authenticated users can upload story media"
  on storage.objects for insert
  with check (
    bucket_id = 'story-media' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update own story media"
  on storage.objects for update
  using (
    bucket_id = 'story-media' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own story media"
  on storage.objects for delete
  using (
    bucket_id = 'story-media' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger to assign default role on user signup
create or replace function public.handle_new_narrative_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'creator')
  on conflict do nothing;
  
  return new;
end;
$$;

create trigger on_auth_user_created_assign_role
  after insert on auth.users
  for each row execute procedure public.handle_new_narrative_user();

-- Create trigger for updated_at timestamps
create trigger set_narratives_updated_at
  before update on public.narratives
  for each row execute procedure public.update_updated_at_column();

create trigger set_chapters_updated_at
  before update on public.chapters
  for each row execute procedure public.update_updated_at_column();

create trigger set_frames_updated_at
  before update on public.frames
  for each row execute procedure public.update_updated_at_column();

create trigger set_frameworks_updated_at
  before update on public.story_frameworks
  for each row execute procedure public.update_updated_at_column();