-- Run this once if the original academic migration was already applied.
-- It makes the user's roadmap key the conflict target used by the client.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'leetcode_progress_user_id_roadmap_key_key') then
    alter table public.leetcode_progress add constraint leetcode_progress_user_id_roadmap_key_key unique (user_id, roadmap_key);
  end if;
end $$;
