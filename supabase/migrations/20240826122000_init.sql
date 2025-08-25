-- Create the products table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT,
    image_url TEXT,
    stock INTEGER NOT NULL,
    subcategory TEXT,
    rating NUMERIC
);

-- Create the profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  addresses JSONB
);

-- RLS policy for products table
-- 1. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for public read access
CREATE POLICY "Allow public read access to products" ON products
FOR SELECT USING (true);

-- RLS policy for profiles table
-- 1. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for users to view their own profile
CREATE POLICY "Allow users to view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 3. Create policy for users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Seed the products table with initial data
INSERT INTO products (id, name, description, price, category, image_url, stock, subcategory, rating) VALUES
('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'https://placehold.co/600x400.png', 15, 'Smart Home', 4.5),
('prod-2', 'Wireless Noise-Cancelling Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'https://placehold.co/600x400.png', 8, 'Audio', 4.8),
('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'https://placehold.co/600x400.png', 5, 'Computers', 4.7),
('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'https://placehold.co/600x400.png', 20, 'Keyboards & Mice', 4.6),
('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'https://placehold.co/600x400.png', 12, 'Men''s Apparel', 4.9),
('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'https://placehold.co/600x400.png', 50, 'Men''s Apparel', 4.4),
('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'https://placehold.co/600x400.png', 30, 'Footwear', 4.7),
('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'https://placehold.co/600x400.png', 25, 'Men''s Apparel', 4.5),
('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'https://placehold.co/600x400.png', 40, 'Non-Fiction', 4.8),
('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'https://placehold.co/600x400.png', 100, 'Science Fiction', 4.9),
('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'Furniture', 'https://placehold.co/600x400.png', 10, 'Living Room', 4.6),
('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'https://placehold.co/600x400.png', 0, 'Office Furniture', 4.8),
('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 50, 'Skincare', 4.7),
('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 40, 'Fitness Equipment', 4.5),
('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'https://placehold.co/600x400.png', 80, 'Action Figures', 4.6),
('prod-16', 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'https://placehold.co/600x400.png', 100, 'Reusable Products', 4.8),
('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'https://placehold.co/600x400.png', 70, 'Beverages', 4.9),
('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'https://placehold.co/600x400.png', 25, 'Tech Gadgets', 4.7),
('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'https://placehold.co/600x400.png', 30, 'Dog Supplies', 4.8),
('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'https://placehold.co/600x400.png', 35, 'Baby Gear', 4.7),
('prod-21', 'Gardening Tool Set', 'Essential tools for every gardener, including trowel, cultivator, and pruner.', 55.00, 'Home & Garden', 'https://placehold.co/600x400.png', 20, 'Gardening Tools', 4.6),
('prod-22', 'Latest Smartphone Model', 'The newest smartphone with advanced camera features and long-lasting battery.', 899.00, 'Mobile Phones & Accessories', 'https://placehold.co/600x400.png', 15, 'Smartphones', 4.9),
('prod-23', 'Car Phone Mount', 'Universal car phone mount with strong grip and adjustable viewing angles.', 20.00, 'Automobiles & Motorcycles', 'https://placehold.co/600x400.png', 60, 'Car Accessories', 4.5),
('prod-24', 'Gaming Console', 'Next-gen gaming console for immersive gaming experiences.', 499.99, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 10, 'Video Games', 4.9);
