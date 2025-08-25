-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  website text,
  addresses jsonb,
  email text
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles
  enable row level security;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for products
create table products (
  id text primary key,
  name text not null,
  description text,
  price real not null,
  category text,
  subcategory text,
  image_url text,
  stock integer,
  rating real
);

-- Set up RLS for products
alter table products enable row level security;

-- THIS IS THE FIX: A single, simple policy to allow public read access.
create policy "Allow public read-only access to products"
on products for select
using (true);

-- This trigger automatically creates a profile for new users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for testing
create table test (
  id serial primary key,
  created_at timestamptz default now(),
  random float8
);
alter table test enable row level security;
create policy "Allow all access to test table" on test for all using (true);

-- Insert some initial data into the products table
INSERT INTO products (id, name, description, price, category, subcategory, image_url, stock, rating) VALUES
('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'Smart Home', 'https://placehold.co/600x400.png', 15, 4.5),
('prod-2', 'Wireless Noise-Cancelling Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'Audio', 'https://placehold.co/600x400.png', 8, 4.8),
('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'Computers', 'https://placehold.co/600x400.png', 5, 4.9),
('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'Keyboards & Mice', 'https://placehold.co/600x400.png', 20, 4.7),
('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 12, 4.6),
('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'Women''s Apparel', 'https://placehold.co/600x400.png', 50, 4.4),
('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'Footwear', 'https://placehold.co/600x400.png', 30, 4.7),
('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 25, 4.5),
('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'Non-Fiction', 'https://placehold.co/600x400.png', 40, 4.9),
('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'Science Fiction', 'https://placehold.co/600x400.png', 100, 4.8),
('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'Furniture', 'Living Room', 'https://placehold.co/600x400.png', 10, 4.7),
('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'Office Furniture', 'https://placehold.co/600x400.png', 0, 4.8),
('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'Skincare', 'https://placehold.co/600x400.png', 50, 4.6),
('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'Fitness Equipment', 'https://placehold.co/600x400.png', 40, 4.5),
('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'Action Figures', 'https://placehold.co/600x400.png', 80, 4.7),
('prod-16', 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'Reusable Products', 'https://placehold.co/600x400.png', 100, 4.6),
('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'Beverages', 'https://placehold.co/600x400.png', 70, 4.8),
('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'Tech Gadgets', 'https://placehold.co/600x400.png', 25, 4.7),
('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'Dog Supplies', 'https://placehold.co/600x400.png', 30, 4.9),
('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'Baby Gear', 'https://placehold.co/600x400.png', 35, 4.8),
('prod-21', 'Gardening Tool Set', 'Essential tools for every gardener, including trowel, cultivator, and pruner.', 55.00, 'Home & Garden', 'Gardening Tools', 'https://placehold.co/600x400.png', 20, 4.7),
('prod-22', 'Latest Smartphone Model', 'The newest smartphone with advanced camera features and long-lasting battery.', 899.00, 'Mobile Phones & Accessories', 'Smartphones', 'https://placehold.co/600x400.png', 15, 4.9),
('prod-23', 'Car Phone Mount', 'Universal car phone mount with strong grip and adjustable viewing angles.', 20.00, 'Automobiles & Motorcycles', 'Car Accessories', 'https://placehold.co/600x400.png', 60, 4.5),
('prod-24', 'Gaming Console', 'Next-gen gaming console for immersive gaming experiences.', 499.99, 'Sports & Entertainment', 'Video Games', 'https://placehold.co/600x400.png', 10, 4.9);
