create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  store_name text,
  bio text,
  avatar_url text,
  paymob_account text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null default '',
  description_en text not null default '',
  price numeric(12,2) not null default 0 check (price >= 0),
  currency text not null default 'EGP' check (currency in ('EGP','USD')),
  category text not null default 'كتب',
  language text not null default 'العربية',
  file_path text not null,
  thumbnail text,
  thumbnail_url text,
  preview_url text,
  sales_count integer not null default 0 check (sales_count >= 0),
  views integer not null default 0 check (views >= 0),
  views_count integer not null default 0 check (views_count >= 0),
  is_published boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  buyer_email text not null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'EGP' check (currency in ('EGP','USD')),
  status text not null default 'pending' check (status in ('pending','paid','refunded','failed')),
  provider text not null default 'paymob',
  paymob_order_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null unique references public.sales(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  download_count integer not null default 0 check (download_count >= 0),
  max_downloads integer not null default 3 check (max_downloads between 1 and 3),
  expires_at timestamptz not null default (now() + interval '48 hours'),
  last_downloaded_at timestamptz
);

create index if not exists products_published_created_idx on public.products (is_published, created_at desc);
create index if not exists products_seller_created_idx on public.products (seller_id, created_at desc);
create index if not exists sales_product_created_idx on public.sales (product_id, created_at desc);
create index if not exists sales_buyer_email_idx on public.sales (lower(buyer_email));
create index if not exists downloads_token_idx on public.downloads (token);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.downloads enable row level security;

drop policy if exists "profiles are viewable by owner" on public.profiles;
create policy "profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles are editable by owner" on public.profiles;
create policy "profiles are editable by owner" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles can be created by owner" on public.profiles;
create policy "profiles can be created by owner" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "published products are public" on public.products;
create policy "published products are public" on public.products for select using ((is_published = true or published = true) or auth.uid() = seller_id);
drop policy if exists "sellers manage their products" on public.products;
create policy "sellers manage their products" on public.products for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

drop policy if exists "sellers view their sales" on public.sales;
create policy "sellers view their sales" on public.sales for select using (exists (select 1 from public.products p where p.id = product_id and p.seller_id = auth.uid()));
drop policy if exists "download records follow sale owner" on public.downloads;
create policy "download records follow sale owner" on public.downloads for select using (exists (select 1 from public.sales s join public.products p on p.id = s.product_id where s.id = sale_id and p.seller_id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('digital-files', 'digital-files', false, 2147483648, array['application/pdf','application/zip','application/x-zip-compressed','video/mp4','application/octet-stream'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "seller uploads digital files" on storage.objects;
create policy "seller uploads digital files" on storage.objects for insert to authenticated with check (bucket_id = 'digital-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "seller reads own digital files" on storage.objects;
create policy "seller reads own digital files" on storage.objects for select to authenticated using (bucket_id = 'digital-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "seller updates own digital files" on storage.objects;
create policy "seller updates own digital files" on storage.objects for update to authenticated using (bucket_id = 'digital-files' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'digital-files' and (storage.foldername(name))[1] = auth.uid()::text);
