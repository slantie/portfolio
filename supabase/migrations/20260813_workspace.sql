-- Private Sortd workspace, now owned by the portfolio's Supabase project.
create table if not exists public.workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 200),
  notes text,
  status text not null default 'TODO' check (status in ('TODO','DOING','DONE')),
  priority text not null default 'MEDIUM' check (priority in ('LOW','MEDIUM','HIGH')),
  tags text[] not null default '{}',
  due_at timestamptz,
  email_enabled boolean not null default true,
  due_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.workspace_tasks enable row level security;
create policy "workspace tasks are private" on public.workspace_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists workspace_tasks_user_status_due_idx on public.workspace_tasks(user_id, status, due_at);

-- Keep task recency accurate for ordering and activity displays.
create or replace function public.touch_workspace_task_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workspace_tasks_updated_at on public.workspace_tasks;
create trigger workspace_tasks_updated_at
before update on public.workspace_tasks
for each row execute function public.touch_workspace_task_updated_at();

create table if not exists public.workspace_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(title) between 1 and 200),
  notes text,
  remind_at timestamptz not null,
  email_enabled boolean not null default true,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.workspace_reminders enable row level security;
create policy "workspace reminders are private" on public.workspace_reminders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists workspace_reminders_user_due_idx on public.workspace_reminders(user_id, remind_at);

-- Reserved for the job application tracker; add its UI when you are ready.
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company text not null, role text not null, status text not null default 'SAVED',
  applied_at date, link text, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.job_applications enable row level security;
create policy "job applications are private" on public.job_applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
