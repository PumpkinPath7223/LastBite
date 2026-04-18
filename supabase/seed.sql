-- LastBite Seed Data
-- OSU-area restaurants and sample deals
--
-- No auth.users inserts needed. profiles table is standalone.
-- Create accounts through the app to log in.
-- Business profiles are pre-seeded so deals display properly.

-- ============================================================
-- PROFILES (standalone, no FK to auth.users)
-- ============================================================

INSERT INTO profiles (id, email, name, user_type, business_name, business_address, lat, lng) VALUES

-- Businesses
('10000000-0000-0000-0000-000000000001', 'buckeye@lastbite.app', 'Buckeye Donuts', 'business',
  'Buckeye Donuts', '1998 N High St, Columbus, OH 43201', 40.0026, -83.0087),

('10000000-0000-0000-0000-000000000002', 'tommys@lastbite.app', 'Tommy''s Pizza', 'business',
  'Tommy''s Pizza', '174 W Lane Ave, Columbus, OH 43201', 40.0057, -83.0137),

('10000000-0000-0000-0000-000000000003', 'adriaticos@lastbite.app', 'Adriatico''s', 'business',
  'Adriatico''s', '2144 N High St, Columbus, OH 43201', 40.0048, -83.0092),

('10000000-0000-0000-0000-000000000004', 'brassica@lastbite.app', 'Brassica', 'business',
  'Brassica', '680 N High St, Columbus, OH 43215', 39.9770, -83.0030),

('10000000-0000-0000-0000-000000000005', 'hangover@lastbite.app', 'Hangover Easy', 'business',
  'Hangover Easy', '1646 Neil Ave, Columbus, OH 43201', 39.9972, -83.0120),

('10000000-0000-0000-0000-000000000006', 'insomnia@lastbite.app', 'Insomnia Cookies', 'business',
  'Insomnia Cookies', '1598 N High St, Columbus, OH 43201', 39.9951, -83.0072),

('10000000-0000-0000-0000-000000000007', 'canes@lastbite.app', 'Raising Cane''s', 'business',
  'Raising Cane''s', '1996 N High St, Columbus, OH 43201', 40.0025, -83.0086),

('10000000-0000-0000-0000-000000000008', 'donatos@lastbite.app', 'Donatos Pizza', 'business',
  'Donatos Pizza', '2084 N High St, Columbus, OH 43201', 40.0035, -83.0090),

('10000000-0000-0000-0000-000000000009', 'katalinas@lastbite.app', 'Katalina''s', 'business',
  'Katalina''s', '1134 N 4th St, Columbus, OH 43201', 39.9870, -82.9970),

('10000000-0000-0000-0000-00000000000a', 'playa@lastbite.app', 'Playa Bowls', 'business',
  'Playa Bowls', '1952 N High St, Columbus, OH 43201', 40.0018, -83.0084);

-- ============================================================
-- LISTINGS (15 deals)
-- ============================================================

INSERT INTO listings (id, business_id, title, description, photo_url, category, original_price, deal_price, quantity_total, quantity_remaining, expires_at) VALUES

-- Buckeye Donuts: Half Dozen Donuts
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000001',
 'Half Dozen Donuts',
 'Six freshly made donuts from Columbus''s legendary 24-hour spot. Mix and match from our classic glazed, chocolate frosted, and seasonal favorites.',
 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
 'food', 6.99, 3.59, 12, 12,
 NOW() + INTERVAL '24 hours'),

-- Buckeye Donuts: Gyro Plate
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000001',
 'Gyro Plate',
 'Our famous late-night gyro plate with seasoned lamb and beef, fresh veggies, tzatziki sauce, and a side of fries. A campus staple since 1969.',
 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400',
 'food', 9.99, 4.99, 8, 8,
 NOW() + INTERVAL '18 hours'),

-- Tommy's Pizza: Large Cheese Pizza
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000002',
 'Large Cheese Pizza',
 'A full large hand-tossed cheese pizza with Tommy''s signature sauce and generous mozzarella blend. Perfect for sharing or stashing leftovers.',
 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
 'food', 12.99, 5.99, 10, 10,
 NOW() + INTERVAL '12 hours'),

-- Adriatico's: Pepperoni Slice Combo
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000003',
 'Pepperoni Slice Combo',
 'Two oversized slices of Adriatico''s legendary thin-crust pepperoni pizza plus a fountain drink. The go-to campus lunch deal.',
 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
 'food', 7.99, 3.99, 15, 15,
 NOW() + INTERVAL '10 hours'),

-- Adriatico's: Garlic Bread
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000003',
 'Garlic Bread',
 'Warm, buttery garlic bread baked fresh with herbs and melted parmesan. The perfect side to any meal or a savory snack on its own.',
 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400',
 'food', 4.99, 2.49, 10, 10,
 NOW() + INTERVAL '8 hours'),

-- Brassica: Mediterranean Bowl
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000004',
 'Mediterranean Bowl',
 'Build-your-own bowl with tender shawarma chicken, fluffy rice, crunchy falafel, pickled turnips, fresh greens, and creamy tahini dressing.',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
 'food', 11.99, 5.39, 8, 8,
 NOW() + INTERVAL '6 hours'),

-- Hangover Easy: Breakfast Burrito
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000005',
 'Breakfast Burrito',
 'Oversized flour tortilla stuffed with scrambled eggs, crispy bacon, cheddar cheese, hash browns, and chipotle aioli. Brunch goals on a budget.',
 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
 'food', 9.49, 4.79, 10, 10,
 NOW() + INTERVAL '14 hours'),

-- Insomnia Cookies: 6-Pack Cookies
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000006',
 '6-Pack Cookies',
 'Six warm, gooey cookies delivered right to your door. Choose from chocolate chunk, snickerdoodle, double chocolate, and more.',
 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
 'food', 8.99, 4.49, 15, 15,
 NOW() + INTERVAL '20 hours'),

-- Insomnia Cookies: Cookie Ice Cream Sandwich
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000006',
 'Cookie Ice Cream Sandwich',
 'Two warm cookies of your choice sandwiching a thick scoop of premium vanilla ice cream. The ultimate late-night treat.',
 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
 'food', 5.49, 2.79, 10, 10,
 NOW() + INTERVAL '16 hours'),

-- Raising Cane's: The Box Combo
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000007',
 'The Box Combo',
 'Four crispy chicken fingers, crinkle-cut fries, coleslaw, Texas toast, and Cane''s signature sauce. Simple, craveable, and now at half price.',
 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
 'food', 9.99, 4.39, 12, 12,
 NOW() + INTERVAL '10 hours'),

-- Donatos Pizza: Edge-to-Edge Pepperoni
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000008',
 'Edge-to-Edge Pepperoni',
 'Donatos'' signature thin crust loaded with 100 pieces of pepperoni from edge to edge. Every bite is the perfect bite.',
 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400',
 'food', 11.49, 5.19, 8, 8,
 NOW() + INTERVAL '12 hours'),

-- Katalina's: Pancake Balls
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000009',
 'Pancake Balls',
 'Katalina''s famous crispy-on-the-outside, fluffy-on-the-inside pancake balls filled with Nutella and topped with powdered sugar. Worth the hype.',
 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
 'food', 7.99, 3.99, 10, 10,
 NOW() + INTERVAL '8 hours'),

-- Katalina's: Avocado Toast
(gen_random_uuid(),
 '10000000-0000-0000-0000-000000000009',
 'Avocado Toast',
 'Thick-cut sourdough piled with smashed avocado, everything bagel seasoning, pickled red onion, and a poached egg. Brunch done right.',
 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
 'food', 10.99, 4.99, 6, 6,
 NOW() + INTERVAL '6 hours'),

-- Playa Bowls: OG Acai Bowl
(gen_random_uuid(),
 '10000000-0000-0000-0000-00000000000a',
 'OG Acai Bowl',
 'The original Playa bowl with organic acai blended smooth, topped with granola, banana, blueberries, strawberries, and a honey drizzle.',
 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
 'food', 11.49, 5.19, 10, 10,
 NOW() + INTERVAL '10 hours');
