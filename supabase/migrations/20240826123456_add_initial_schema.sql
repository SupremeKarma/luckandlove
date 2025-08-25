-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    subcategory TEXT,
    rating NUMERIC
);

-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  addresses JSONB
);


-- RLS policy for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all products
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
CREATE POLICY "Allow public read access to products" ON products
FOR SELECT USING (true);


-- RLS policy for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Allow users to read their own profile" ON profiles;
CREATE POLICY "Allow users to read their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
CREATE POLICY "Allow users to update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed some initial product data
INSERT INTO products (id, name, description, price, category, image_url, stock, subcategory, rating)
VALUES
  ('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'https://placehold.co/600x400.png', 15, 'Smart Home', 4.5),
  ('prod-2', 'Wireless Noise-Cancelling Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'https://placehold.co/600x400.png', 8, 'Audio', 4.8),
  ('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'https://placehold.co/600x400.png', 5, 'Computers', 4.7),
  ('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'https://placehold.co/600x400.png', 20, 'Keyboards & Mice', 4.6),
  ('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'https://placehold.co/600x400.png', 12, 'Men''s Apparel', 4.9),
  ('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'https://placehold.co/600x400.png', 50, 'Men''s Apparel', 4.4),
  ('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'https://placehold.co/600x400.png', 30, 'Footwear', 4.7),
  ('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'https://placehold.co/600x400.png', 25, 'Men''s Apparel', 4.5),
  ('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'https://placehold.co/600x400.png', 40, 'Non-Fiction', 4.8),
  ('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'https://placehold.co/600x400.png', 100, 'Fiction', 4.7)
ON CONFLICT (id) DO NOTHING;
