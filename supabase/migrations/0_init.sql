-- Create products table
CREATE TABLE public.products (
    id text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    description text,
    price real NOT NULL,
    category text,
    image_url text,
    stock integer NOT NULL,
    subcategory text,
    rating real,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Public can read products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON public.products;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
DROP POLICY IF EXISTS "Users can insert new products." ON public.products;
DROP POLICY IF EXISTS "Users can update products." ON public.products;
DROP POLICY IF EXISTS "Users can delete products." ON public.products;

CREATE POLICY "Products are viewable by everyone." ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Users can insert new products." ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update products." ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete products." ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');


-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    email text,
    addresses jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING ((SELECT auth.uid()) = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Policy to allow authenticated users to insert their profile
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- Seed initial data for products
INSERT INTO public.products (id, name, description, price, category, image_url, stock, subcategory, rating) VALUES
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
('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'https://placehold.co/600x400.png', 0, 'Office Furniture', 4.7),
('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 50, 'Skincare', 4.8),
('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 40, 'Fitness Equipment', 4.5),
('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'https://placehold.co/600x400.png', 80, 'Action Figures', 4.9),
('prod-16', 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'https://placehold.co/600x400.png', 100, 'Reusable Products', 4.7),
('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'https://placehold.co/600x400.png', 70, 'Beverages', 4.9),
('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'https://placehold.co/600x400.png', 25, 'Tech Gadgets', 4.6),
('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'https://placehold.co/600x400.png', 30, 'Dog Supplies', 4.8),
('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'https://placehold.co/600x400.png', 35, 'Baby Gear', 4.7),
('prod-21', 'Gardening Tool Set', 'Essential tools for every gardener, including trowel, cultivator, and pruner.', 55.00, 'Home & Garden', 'https://placehold.co/600x400.png', 20, 'Gardening Tools', 4.6),
('prod-22', 'Latest Smartphone Model', 'The newest smartphone with advanced camera features and long-lasting battery.', 899.00, 'Mobile Phones & Accessories', 'https://placehold.co/600x400.png', 15, 'Smartphones', 4.8),
('prod-23', 'Car Phone Mount', 'Universal car phone mount with strong grip and adjustable viewing angles.', 20.00, 'Automobiles & Motorcycles', 'https://placehold.co/600x400.png', 60, 'Car Accessories', 4.4),
('prod-24', 'Gaming Console', 'Next-gen gaming console for immersive gaming experiences.', 499.99, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 10, 'Video Games', 4.9),
('prod-25', 'Smart Watch X1', 'Stay connected and track your fitness with the new Smart Watch X1.', 120.00, 'Electronics', 'https://placehold.co/600x400.png', 30, 'Wearable Tech', 4.5),
('prod-26', 'Amethyst Serving Tray', 'Elegant serving tray with genuine amethyst inlay, perfect for entertaining.', 75.00, 'Home & Garden', 'https://placehold.co/600x400.png', 10, 'Kitchen & Dining', 4.9),
('prod-27', 'Outdoor Hiking Backpack', 'Durable and spacious backpack for all your outdoor adventures.', 85.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 25, 'Outdoor Recreation', 4.7),
('prod-28', 'Fitness Tracker F2', 'Monitor your heart rate, steps, and sleep with this advanced fitness tracker.', 55.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 40, 'Health Supplements', 4.6),
('prod-29', 'Cute Eye Mask', 'Soft and comfortable eye mask with a fun design for a good night''s sleep.', 12.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 60, 'Personal Care', 4.8),
('prod-30', 'Multi-tier Storage Shelf', 'Versatile plastic shelving unit for organizing any room in your home.', 40.00, 'Home & Garden', 'https://placehold.co/600x400.png', 15, 'Furniture', 4.3),
('prod-31', 'Glitter Wall Clock', 'Sparkling wall clock that adds a touch of glamour to your decor.', 30.00, 'Home & Garden', 'https://placehold.co/600x400.png', 20, 'Home Decor', 4.5),
('prod-32', 'Adjustable Walking Cane', 'Lightweight and adjustable walking cane for support and stability.', 35.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 18, 'Personal Care', 4.7),
('prod-33', 'Home Fitness Stepper', 'Compact stepper machine for a full body workout at home.', 150.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 10, 'Fitness Equipment', 4.6),
('prod-34', 'Silicone Funnel', 'Flexible silicone funnel for easy pouring and transfer of liquids.', 8.00, 'Home & Garden', 'https://placehold.co/600x400.png', 100, 'Kitchen & Dining', 4.9),
('prod-35', 'Turquoise Gemstone Decor', 'Decorative gemstone pieces for a natural and calming home ambiance.', 65.00, 'Home & Garden', 'https://placehold.co/600x400.png', 12, 'Home Decor', 4.8),
('prod-36', 'Insulated Cooler Bag', 'Large capacity cooler bag to keep your food and drinks cool on the go.', 45.00, 'Food & Drink', 'https://placehold.co/600x400.png', 30, 'Pantry Staples', 4.7),
('prod-37', 'Hanging Closet Organizer', 'Space-saving closet organizer with multiple compartments for clothes and accessories.', 25.00, 'Home & Garden', 'https://placehold.co/600x400.png', 50, 'Furniture', 4.5),
('prod-38', 'Resistance Band Set', 'Versatile set of resistance bands for strength training and physical therapy.', 20.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 70, 'Fitness Equipment', 4.6),
('prod-39', 'Premium Smartwatch V2', 'Next-gen smartwatch with advanced health monitoring and connectivity features.', 250.00, 'Electronics', 'https://placehold.co/600x400.png', 20, 'Wearable Tech', 4.9),
('prod-40', 'Travel Garment Bag', 'Foldable garment bag to keep your suits and dresses wrinkle-free while traveling.', 50.00, 'Fashion', 'https://placehold.co/600x400.png', 22, 'Accessories', 4.7),
('prod-41', 'Crystal Coaster Set', 'Elegant crystal coasters that protect your surfaces with a touch of luxury.', 30.00, 'Home & Garden', 'https://placehold.co/600x400.png', 45, 'Kitchen & Dining', 4.8),
('prod-42', 'Agate Bookends', 'Natural agate bookends, a unique and stylish way to organize your books.', 55.00, 'Home & Garden', 'https://placehold.co/600x400.png', 15, 'Home Decor', 4.9),
('prod-43', 'Colorful Floral Pillow', 'Vibrant throw pillow with a beautiful floral design to brighten any room.', 28.00, 'Home & Garden', 'https://placehold.co/600x400.png', 35, 'Bedding & Bath', 4.6),
('prod-44', 'Smart Body Scale', 'Advanced smart scale that tracks weight, body fat, muscle mass, and more.', 70.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 28, 'Health Supplements', 4.7),
('prod-45', 'Universal Remote Control', 'Simplify your entertainment system with this easy-to-use universal remote.', 22.00, 'Electronics', 'https://placehold.co/600x400.png', 60, 'Video', 4.4),
('prod-46', 'Pink Agate Serving Platter', 'Stunning pink agate serving platter, perfect for appetizers and desserts.', 85.00, 'Home & Garden', 'https://placehold.co/600x400.png', 8, 'Kitchen & Dining', 4.9),
('prod-47', 'Modern Wall Clock White', 'Chic and minimalist wall clock in white, ideal for contemporary spaces.', 40.00, 'Home & Garden', 'https://placehold.co/600x400.png', 17, 'Home Decor', 4.5),
('prod-48', 'Action Camera Mount', 'Secure mount for action cameras, great for capturing adventures.', 15.00, 'Electronics', 'https://placehold.co/600x400.png', 90, 'Cameras', 4.3),
('prod-49', 'Marble Serving Board', 'Elegant marble serving board, ideal for cheese, charcuterie, and more.', 60.00, 'Home & Garden', 'https://placehold.co/600x400.png', 14, 'Kitchen & Dining', 4.8),
('prod-50', 'Children''s Doll', 'A cute and cuddly doll for children, perfect for playtime.', 25.00, 'Toys & Hobbies', 'https://placehold.co/600x400.png', 50, 'Action Figures', 4.9);
