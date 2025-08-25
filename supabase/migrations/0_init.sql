
-- Create the products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  "imageUrl" TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  rating NUMERIC(2, 1)
);

-- Create the profiles table to store public user data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  addresses JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Reset and define clear RLS policies for the 'products' table.
-- This ensures that previous, possibly conflicting, rules are removed.

-- Drop existing policies for the 'products' table to ensure a clean state
DROP POLICY IF EXISTS "Allow all users to view products" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;

-- Create a single, definitive policy that allows anyone to view products.
-- This is the standard and secure way to configure a public product catalog.
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
USING (true);

-- Allow authenticated users to manage their own profiles
CREATE POLICY "Allow individual user access to their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow individual user to update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Function to handle new user sign-ups and create a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function upon new user creation in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed the products table with initial data
INSERT INTO products (id, name, description, price, "imageUrl", category, stock, rating) VALUES
  ('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'https://placehold.co/600x400.png', 'Electronics', 15, 4.5),
  ('prod-2', 'Wireless Noise-Cancelling Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'https://placehold.co/600x400.png', 'Electronics', 8, 4.8),
  ('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'https://placehold.co/600x400.png', 'Electronics', 5, 4.7),
  ('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'https://placehold.co/600x400.png', 'Computer & Office', 20, 4.6),
  ('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'https://placehold.co/600x400.png', 'Fashion', 12, 4.9),
  ('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'https://placehold.co/600x400.png', 'Fashion', 50, 4.4),
  ('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'https://placehold.co/600x400.png', 'Fashion', 30, 4.7),
  ('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'https://placehold.co/600x400.png', 'Fashion', 25, 4.5),
  ('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'https://placehold.co/600x400.png', 'Books', 40, 4.8),
  ('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'https://placehold.co/600x400.png', 'Books', 100, 4.9),
  ('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'https://placehold.co/600x400.png', 'Furniture', 10, 4.6),
  ('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'https://placehold.co/600x400.png', 'Furniture', 0, 4.7),
  ('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'https://placehold.co/600x400.png', 'Health & Beauty', 50, 4.8),
  ('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'https://placehold.co/600x400.png', 'Sports & Entertainment', 40, 4.6),
  ('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'https://placehold.co/600x400.png', 'Toys & Hobbies', 80, 4.9),
  ('prod-16', 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'https://placehold.co/600x400.png', 'Eco-friendly', 100, 4.7),
  ('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'https://placehold.co/600x400.png', 'Food & Drink', 70, 4.8),
  ('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'https://placehold.co/600x400.png', 'Gift & Gadgets', 25, 4.6),
  ('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'https://placehold.co/600x400.png', 'Pet Supplies', 30, 4.9),
  ('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'https://placehold.co/600x400.png', 'Mother & Kids', 35, 4.7),
  ('prod-21', 'Gardening Tool Set', 'Essential tools for every gardener, including trowel, cultivator, and pruner.', 55.00, 'https://placehold.co/600x400.png', 'Home & Garden', 20, 4.5),
  ('prod-22', 'Latest Smartphone Model', 'The newest smartphone with advanced camera features and long-lasting battery.', 899.00, 'https://placehold.co/600x400.png', 'Mobile Phones & Accessories', 15, 4.8),
  ('prod-23', 'Car Phone Mount', 'Universal car phone mount with strong grip and adjustable viewing angles.', 20.00, 'https://placehold.co/600x400.png', 'Automobiles & Motorcycles', 60, 4.4),
  ('prod-24', 'Gaming Console', 'Next-gen gaming console for immersive gaming experiences.', 499.99, 'https://placehold.co/600x400.png', 'Sports & Entertainment', 10, 4.9);
