-- Run once in a new Supabase project. Never disable RLS.
create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 display_name text check (char_length(display_name) <= 80),
 created_at timestamptz not null default now()
);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$ begin
 insert into public.profiles(id,display_name) values (new.id,left(new.raw_user_meta_data->>'display_name',80)); return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create table public.authors (id bigint generated always as identity primary key, name text not null);
create table public.categories (id bigint generated always as identity primary key, name text not null unique);
create table public.books (
 id text primary key, title text not null, author_id bigint references public.authors, category_id bigint references public.categories,
 metadata jsonb not null default '{}', rights_status text not null default 'catalog_only' check(rights_status in ('catalog_only','public_domain_us','licensed')), created_at timestamptz not null default now()
);
create table public.bookshelf (
 user_id uuid references auth.users on delete cascade not null,
 book_id text not null check(char_length(book_id)<=100), book jsonb not null check(octet_length(book::text)<=32768),
 saved boolean not null default false, favorite boolean not null default false,
 progress real not null default 0 check(progress between 0 and 100),
 bookmark integer check(bookmark>=0), updated_at timestamptz not null default now(), primary key(user_id,book_id)
);
create table public.reviews (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade,
 book_id text not null check(char_length(book_id)<=100), rating integer not null check(rating between 1 and 5),
 body text not null check(char_length(body) between 10 and 2000), created_at timestamptz not null default now(), unique(user_id,book_id)
);
create table public.newsletter_subscriptions (
 email text primary key check(char_length(email)<=254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'), created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.books enable row level security;
alter table public.bookshelf enable row level security;
alter table public.reviews enable row level security;
alter table public.newsletter_subscriptions enable row level security;
create policy "Own profile" on public.profiles for all to authenticated using(auth.uid()=id) with check(auth.uid()=id);
create policy "Read authors" on public.authors for select using(true);
create policy "Read categories" on public.categories for select using(true);
create policy "Read books" on public.books for select using(true);
create policy "Own bookshelf" on public.bookshelf for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "Read reviews" on public.reviews for select using(true);
create policy "Own reviews" on public.reviews for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
-- Newsletter signup requires an authenticated account to reduce anonymous spam.
create policy "Subscribe own email" on public.newsletter_subscriptions for insert to authenticated with check(email = lower(auth.jwt()->>'email'));
create function public.unsubscribe_newsletter() returns void language sql security definer set search_path = '' as $$ delete from public.newsletter_subscriptions where email=lower(auth.jwt()->>'email'); $$;
revoke all on function public.unsubscribe_newsletter() from public,anon;
grant execute on function public.unsubscribe_newsletter() to authenticated;
create index bookshelf_recent on public.bookshelf(user_id,updated_at desc);
create index reviews_book on public.reviews(book_id,created_at desc);
