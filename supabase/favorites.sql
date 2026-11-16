begin;

create table public.favorites (
    user_id uuid not null references auth.users(id) on delete cascade,
    recipe_id bigint not null references public.recipes(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, recipe_id)
);

create index favorites_recipe_id_idx on public.favorites (recipe_id);

alter table public.favorites enable row level security;

revoke all on public.favorites from public, anon, authenticated;
grant select, delete on public.favorites to authenticated;
grant insert (user_id, recipe_id) on public.favorites to authenticated;

create policy "Users can read their favorites" on public.favorites
    for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can save their favorites" on public.favorites
    for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can remove their favorites" on public.favorites
    for delete to authenticated using ((select auth.uid()) = user_id);

commit;
