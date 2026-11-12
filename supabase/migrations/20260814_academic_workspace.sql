-- Academic workspace: private to the currently signed-in portfolio owner.
create table if not exists public.workspace_courses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  code text not null, title text not null, instructor text, color text not null default 'slate', created_at timestamptz not null default now(),
  unique(user_id, code)
);
create table if not exists public.workspace_topics (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  course_id uuid not null references public.workspace_courses(id) on delete cascade, text text not null, unit text, sort_order integer not null default 0,
  covered boolean not null default false, covered_at timestamptz, done boolean not null default false, done_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.workspace_materials (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  course_id uuid not null references public.workspace_courses(id) on delete cascade, title text not null, kind text not null default 'PERSONAL' check (kind in ('PROFESSOR','SENIOR','PERSONAL','REFERENCE')),
  original_name text, content_type text, size_bytes bigint, storage_path text, raw_text text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.workspace_files (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(), title text not null, original_name text not null,
  content_type text, size_bytes bigint, storage_path text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.leetcode_progress (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade default auth.uid(), roadmap_key text not null,
  solved boolean not null default false, solved_at timestamptz, note text, updated_at timestamptz not null default now(), unique(user_id, roadmap_key)
);

-- `upsert(..., { onConflict: "user_id,roadmap_key" })` relies on this exact
-- compound constraint. Kept separately so it also repairs a partially applied
-- early version of this migration.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leetcode_progress_user_id_roadmap_key_key') then
    alter table public.leetcode_progress add constraint leetcode_progress_user_id_roadmap_key_key unique (user_id, roadmap_key);
  end if;
end $$;

alter table public.workspace_courses enable row level security;
alter table public.workspace_topics enable row level security;
alter table public.workspace_materials enable row level security;
alter table public.workspace_files enable row level security;
alter table public.leetcode_progress enable row level security;
create policy "private academic courses" on public.workspace_courses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "private academic topics" on public.workspace_topics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "private academic materials" on public.workspace_materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "private workspace files" on public.workspace_files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "private leetcode progress" on public.leetcode_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('workspace-library', 'workspace-library', false) on conflict (id) do nothing;
create policy "private library upload" on storage.objects for insert to authenticated with check (bucket_id = 'workspace-library' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "private library read" on storage.objects for select to authenticated using (bucket_id = 'workspace-library' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "private library delete" on storage.objects for delete to authenticated using (bucket_id = 'workspace-library' and (storage.foldername(name))[1] = auth.uid()::text);
