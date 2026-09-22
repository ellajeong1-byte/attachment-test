-- Writers' Room OS schema
-- Run in Supabase SQL editor after enabling auth.

create extension if not exists "pgcrypto";

create type public.workflow_stage as enum ('ideation', 'outline', 'draft', 'review', 'approved');
create type public.role_name as enum (
  'trend_strategist',
  'story_architect',
  'episode_writer',
  'tone_romance_director',
  'worldbuilding_continuity_manager',
  'director'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  logline text,
  genre text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role role_name not null,
  created_at timestamptz not null default now(),
  unique(project_id, user_id, role)
);

create table if not exists public.story_bible_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  body text,
  tags text[] default '{}',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.character_sheets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  archetype text,
  profile jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  episode_number int,
  event_date date,
  details text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  episode_number int not null,
  title text not null,
  synopsis text,
  stage workflow_stage not null default 'ideation',
  assigned_role role_name,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, episode_number)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  episode_id uuid references public.episodes(id) on delete cascade,
  role role_name not null,
  content text not null,
  status text not null default 'submitted',
  submitted_by uuid not null references auth.users(id),
  submitted_at timestamptz not null default now()
);

create table if not exists public.director_approvals (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  approved boolean not null,
  notes text,
  decided_by uuid not null references auth.users(id),
  decided_at timestamptz not null default now()
);

create table if not exists public.revision_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  previous_data jsonb,
  next_data jsonb,
  changed_by uuid not null references auth.users(id),
  changed_at timestamptz not null default now()
);

create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_story_bible_project on public.story_bible_entries(project_id);
create index if not exists idx_character_project on public.character_sheets(project_id);
create index if not exists idx_timeline_project on public.timeline_events(project_id);
create index if not exists idx_episode_project_stage on public.episodes(project_id, stage);
create index if not exists idx_submissions_project on public.submissions(project_id);
create index if not exists idx_revision_project on public.revision_history(project_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.story_bible_entries enable row level security;
alter table public.character_sheets enable row level security;
alter table public.timeline_events enable row level security;
alter table public.episodes enable row level security;
alter table public.submissions enable row level security;
alter table public.director_approvals enable row level security;
alter table public.revision_history enable row level security;

create policy "profiles self access" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "project members can read project" on public.projects
  for select using (
    owner_id = auth.uid() or exists (
      select 1 from public.project_members pm
      where pm.project_id = projects.id and pm.user_id = auth.uid()
    )
  );

create policy "project owner can manage" on public.projects
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "members can read members" on public.project_members
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_members.project_id
      and (p.owner_id = auth.uid() or project_members.user_id = auth.uid())
    )
  );

create policy "owner manages members" on public.project_members
  for all using (
    exists (select 1 from public.projects p where p.id = project_members.project_id and p.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.projects p where p.id = project_members.project_id and p.owner_id = auth.uid())
  );

create policy "members can access project content" on public.story_bible_entries
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = story_bible_entries.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = story_bible_entries.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );

create policy "members can access character sheets" on public.character_sheets
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = character_sheets.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = character_sheets.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );

create policy "members can access timeline" on public.timeline_events
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = timeline_events.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = timeline_events.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );

create policy "members can access episodes" on public.episodes
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = episodes.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = episodes.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );

create policy "members can access submissions" on public.submissions
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = submissions.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = submissions.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );

create policy "director approvals by project members" on public.director_approvals
  for all using (
    exists (
      select 1
      from public.submissions s
      join public.projects p on p.id = s.project_id
      where s.id = director_approvals.submission_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1
      from public.submissions s
      join public.projects p on p.id = s.project_id
      where s.id = director_approvals.submission_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );

create policy "members can access revisions" on public.revision_history
  for all using (
    exists (
      select 1 from public.projects p
      where p.id = revision_history.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = revision_history.project_id
      and (p.owner_id = auth.uid() or exists (
        select 1 from public.project_members pm
        where pm.project_id = p.id and pm.user_id = auth.uid()
      ))
    )
  );
