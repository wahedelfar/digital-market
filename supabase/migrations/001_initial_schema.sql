create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  store_name text,
  bio text,
  paymob_account text,
  created_at timestamptz not null default now()
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
  sales_count integer not null default 0,
  views_count integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_email text not null,
  amount numeric(12,2) not null,
  currency text not null default 'EGP',
  provider text not null default 'paymob',
  status text not null default 'paid' check (status in ('pending','paid','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  download_count integer not null default 0 check (download_count >= 0 and download_count <= 3),
  expires_at timestamptz not null default (now() + interval '48 hours'),
  last_downloaded_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.downloads enable row level security;

create policy "profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "profiles are editable by owner" on public.profiles for update using (auth.uid() = id);
create policy "published products are public" on public.products for select using (published = true or auth.uid() = seller_id);
create policy "sellers manage their products" on public.products for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
create policy "sellers view their sales" on public.sales for select using (exists (select 1 from public.products p where p.id = product_id and p.seller_id = auth.uid()));
create policy "buyers create sales" on public.sales for insert with check (true);
create policy "download records follow sale owner" on public.downloads for select using (exists (select 1 from public.sales s join public.products p on p.id = s.product_id where s.id = sale_id and p.seller_id = auth.uid()));
