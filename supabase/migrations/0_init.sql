-- Create a table for public profiles
create table
  profiles (
    id uuid not null references auth.users on delete cascade,
    full_name text,
    avatar_url text,
    primary key (id)
  );

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for
select
  using (true);

create policy "Users can insert their own profile." on profiles for
insert
  with check (auth.uid () = id);

create policy "Users can update own profile." on profiles for
update
  using (auth.uid () = id);

-- This trigger automatically creates a profile for new users
create function public.handle_new_user () returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- Create products table
create table
  products (
    id text not null primary key,
    name text,
    description text,
    price real,
    category text,
    image_url text,
    stock integer,
    subcategory text,
    rating real
  );
  
alter table products enable row level security;

-- Clear any previous policies that were incorrect
drop policy if exists "Products are viewable by everyone." on products;
drop policy if exists "Allow public read access to products" on products;
drop policy if exists "Allow authorized users to manage products" on products;

-- Create a single, correct policy for reading products
create policy "Allow public read access to all products" on products for
select using (true);
