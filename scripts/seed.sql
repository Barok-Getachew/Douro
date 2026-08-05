-- ============================================================
-- D'ouro Soul Food — Supabase Seed Script
-- Paste this entire file into: Supabase → SQL Editor → Run
-- ============================================================

-- 1. Tables
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  allergens TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  popular BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  name_en TEXT NOT NULL DEFAULT '',
  name_de TEXT NOT NULL DEFAULT '',
  name_pt TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  desc_de TEXT NOT NULL DEFAULT '',
  desc_pt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  tagline_en TEXT, tagline_de TEXT, tagline_pt TEXT,
  street TEXT, city TEXT,
  phone TEXT, phone_href TEXT, whatsapp TEXT, email TEXT,
  maps TEXT, google_review TEXT, instagram TEXT, facebook TEXT, tripadvisor TEXT, order_url TEXT,
  rating NUMERIC(3,1), review_count INTEGER,
  hours_en TEXT, hours_de TEXT, hours_pt TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  quote_en TEXT, quote_de TEXT, quote_pt TEXT,
  author TEXT, source TEXT,
  rating INTEGER DEFAULT 5,
  pending BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);

-- 2. Row Level Security — public reads, service role writes
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read menu_items" ON menu_items;
DROP POLICY IF EXISTS "Public read restaurant"  ON restaurant;
DROP POLICY IF EXISTS "Public read reviews"     ON reviews;

CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read restaurant"  ON restaurant  FOR SELECT USING (true);
CREATE POLICY "Public read reviews"     ON reviews     FOR SELECT USING (true);

-- 3. Restaurant
INSERT INTO restaurant (id, name, tagline_en, tagline_de, tagline_pt, street, city,
  phone, phone_href, whatsapp, email, maps, google_review, instagram, facebook, tripadvisor,
  order_url, rating, review_count, hours_en, hours_de, hours_pt)
VALUES (1,
  'D''ouro Soul Food',
  'Afro-Latin Soul Food', 'Afro-Latin Soulfood', 'Soul Food Afro-Latino',
  'Auerspergstraße 10', '5020 Salzburg, Austria',
  '+43 676 4231921', 'tel:+436764231921',
  'https://wa.me/436764231921', 'info@douro-soulfood.com',
  'https://www.google.com/maps/search/?api=1&query=Auerspergstra%C3%9Fe+10%2C+5020+Salzburg%2C+Austria',
  'https://search.google.com/local/writereview?placeid=ChIJ-3-y_Uvld0gRdfRkL6n3s2M',
  'https://www.instagram.com/douro_soulfood/',
  'https://www.facebook.com/people/Douro-Soulfood/61553206676357/',
  'https://www.tripadvisor.com/Restaurant_Review-g190441-d25104877-Reviews-D_ouro_Soulfood_Bistro-Salzburg_Austrian_Alps.html',
  'https://www.lieferando.at/en/menu/douro',
  4.8, 978,
  'Mon – Sat · 11:00 – 20:00', 'Mo – Sa · 11:00 – 20:00', 'Seg – Sáb · 11:00 – 20:00'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Reviews
INSERT INTO reviews (quote_en, quote_de, quote_pt, author, source, sort_order) VALUES
('The best Afro-Latin food in Salzburg! The beef tacos and the caipirinha are world class. Angela is incredibly warm.',
 'Das beste Afro-Latin Food in Salzburg! Die Beef Tacos und die Caipirinha sind einfach weltklasse. Angela ist extrem herzlich.',
 'A melhor comida afro-latina de Salzburgo! Os tacos de carne e a caipirinha são de outro nível.',
 'Lukas M.', 'Google', 1),
('Angela''s food is full of flavour and cooked with love. The fufu took me right back to West Africa. An absolute gem.',
 'Angelas Essen ist voller Geschmack und mit Liebe gekocht. Das Fufu hat mich direkt nach Westafrika versetzt. Ein Juwel!',
 'A comida da Angela é cheia de sabor e feita com amor. O fufu me levou direto para a África Ocidental.',
 'Amara K.', 'TripAdvisor', 2),
('We booked the catering for a company party and everyone was thrilled. Incredibly tasty food and great service!',
 'Wir haben das Catering für eine Firmenfeier gebucht und alle waren restlos begeistert. Unglaublich leckeres Essen und toller Service!',
 'Contratamos o catering para uma festa da empresa e todos adoraram. Comida deliciosa e ótimo serviço!',
 'Sophie B.', 'Google', 3)
ON CONFLICT DO NOTHING;

-- 5. Menu Items
INSERT INTO menu_items (id, category, price, image, allergens, tags, popular, name_en, name_de, name_pt, desc_en, desc_de, desc_pt, sort_order) VALUES

-- Starters
('nachos','appetizers',8.90,'/menu/nachos-guac.webp','{}',ARRAY['vegetarian'],false,
 'Nachos with Guacamole','Nachos mit Guacamole','Nachos com Guacamole',
 'Crispy corn chips served with fresh guacamole.',
 'Knusprige Maischips, serviert mit Guacamole.',
 'Chips de milho crocantes servidos com guacamole.',10),

('ceviche','appetizers',8.90,NULL,ARRAY[]::TEXT[],ARRAY['vegan','glutenfree'],false,
 'Mango Ceviche','Mango Ceviche','Ceviche de Manga',
 'Fresh mango with tomato, onion and crunchy corn.',
 'Frische Mango mit Tomaten, Zwiebeln und Knusper-Mais.',
 'Manga fresca com tomate, cebola e milho crocante.',20),

('coxinha','appetizers',8.90,'/menu/coxinha.webp',ARRAY['A','M'],ARRAY[]::TEXT[],false,
 'Coxinha with Salad','Coxinha mit Salat','Coxinha com Salada',
 'Brazilian dough pockets filled with chicken, served with salad.',
 'Brasilianische Teigtasche mit Hühnerfleischfüllung, serviert mit Salat.',
 'Salgado brasileiro recheado com frango, servido com salada.',30),

('pao-de-queijo','appetizers',10.90,'/menu/pao-de-queijo.webp',ARRAY['M'],ARRAY['vegetarian','glutenfree'],false,
 'Pão de Queijo','Pão de Queijo','Pão de Queijo',
 'Freshly baked Brazilian cheese bread balls.',
 'Frische brasilianische Käsebällchen, frisch gebacken.',
 'Pãezinhos de queijo brasileiros assados na hora.',40),

-- Quesadillas
('quesadilla-pollo','quesadillas',15.00,'/menu/quesadilla-haehnchen.webp',ARRAY['A','G'],ARRAY[]::TEXT[],false,
 'Chicken Quesadilla','Hähnchen (Pollo) Quesadilla','Quesadilla de Frango',
 'With melted Gouda.','Mit geschmolzenem Gouda.','Com gouda derretido.',50),

('quesadilla-cerdo','quesadillas',15.00,NULL,ARRAY['A','G'],ARRAY[]::TEXT[],false,
 'Pork Quesadilla','Schwein (Cerdo) Quesadilla','Quesadilla de Porco',
 'With pizza cheese (mozzarella mix).',
 'Mit Pizzakäse (Mozzarella-Mix).','Com mistura de mozzarella.',60),

('quesadilla-veg','quesadillas',13.90,NULL,ARRAY['A','G'],ARRAY['vegetarian'],false,
 'Vegetarian Quesadilla','Vegetarische Quesadilla','Quesadilla Vegetariana',
 'Spinach, feta and Austrian cheese (Gouda & mozzarella).',
 'Mit Spinat, Feta & österreichischem Käse (Gouda & Mozzarella).',
 'Espinafre, feta e queijo austríaco.',70),

('quesadilla-summer','quesadillas',14.90,NULL,ARRAY['A','G'],ARRAY['vegetarian'],false,
 'Summer Quesadilla','Sommer Quesadilla','Quesadilla de Verão',
 'Cheese and pico de gallo.','Mit Käse & Pico de Gallo.','Queijo e pico de gallo.',80),

-- Tacos
('taco-especial','tacos',18.90,'/menu/taco-especial.webp',ARRAY['A','M'],ARRAY['chef'],true,
 'Taco Especial','Taco Especial','Taco Especial',
 'Grilled picanha beef, black beans, salad, pico de gallo, guacamole.',
 'Gegrilltes Rindfleisch (Picanha), schwarze Bohnen, Salat, Pico de Gallo, Guacamole.',
 'Picanha grelhada, feijão preto, salada, pico de gallo, guacamole.',90),

('taco-pollo','tacos',15.90,'/menu/chicken-taco.webp',ARRAY['A','M'],ARRAY[]::TEXT[],false,
 'Taco Pollo','Taco Pollo','Taco Pollo',
 'Slow-cooked chicken, salad, pico de gallo, guacamole.',
 'Langsam gegartes Hähnchen, Salat, Pico de Gallo, Guacamole.',
 'Frango cozido lentamente, salada, pico de gallo, guacamole.',100),

('taco-vegano','tacos',13.90,'/menu/veggie-taco.webp',ARRAY['A','M'],ARRAY['vegan','glutenfree'],false,
 'Taco Vegano','Taco Vegano','Taco Vegano',
 'Soy protein with Brazilian spices, salad, pico de gallo, guacamole.',
 'Sojaprotein mit brasilianischen Gewürzen, Salat, Pico de Gallo, Guacamole.',
 'Proteína de soja com temperos brasileiros, salada, pico de gallo, guacamole.',110),

('taco-pulled-pork','tacos',16.90,NULL,ARRAY['A'],ARRAY[]::TEXT[],false,
 'Taco Pulled Pork','Taco Pulled Pork','Taco Pulled Pork',
 'Pulled pork, salad, pico de gallo, guacamole.',
 'Gezupftes Schweinefleisch, Salat, Pico de Gallo, Guacamole.',
 'Porco desfiado, salada, pico de gallo, guacamole.',120),

('taco-res','tacos',17.99,'/menu/beef-taco.webp',ARRAY['A','M'],ARRAY[]::TEXT[],true,
 'Taco Res','Taco Res','Taco Res',
 'Slow-cooked beef, salad, pico de gallo, guacamole.',
 'Langsam gekochtes Rindfleisch, Salat, Pico de Gallo, Guacamole.',
 'Carne cozida lentamente, salada, pico de gallo, guacamole.',130),

('taco-gambas','tacos',18.90,NULL,ARRAY['A','B','M'],ARRAY['glutenfree'],false,
 'Taco Gambas','Taco Gambas','Taco de Camarão',
 'Prawns, salad, pico de gallo, guacamole.',
 'Garnelen, Salat, Pico de Gallo, Guacamole.',
 'Camarões, salada, pico de gallo, guacamole.',140),

-- Bowls
('veggie-bowl','bowls',14.90,'/menu/veggie-bowl.webp',ARRAY['A','F'],ARRAY['vegan','glutenfree'],false,
 'Veggie Bowl','Veggie Bowl','Veggie Bowl',
 'Rice, black beans, Brazilian-style soy protein, corn, salad, pico de gallo, guacamole.',
 'Reis, schwarze Bohnen, Sojaprotein nach brasilianischer Art, Mais, Salat, Pico de Gallo, Guacamole.',
 'Arroz, feijão preto, proteína de soja, milho, salada, pico de gallo, guacamole.',150),

('latino-bowl','bowls',15.90,NULL,ARRAY['A'],ARRAY['glutenfree'],false,
 'Latino Bowl','Latino Bowl','Latino Bowl',
 'Rice, black beans, chicken, salad, pico de gallo, guacamole.',
 'Reis, schwarze Bohnen, Hähnchenfleisch, Salat, Pico de Gallo, Guacamole.',
 'Arroz, feijão preto, frango, salada, pico de gallo, guacamole.',160),

('beef-bowl','bowls',16.90,'/menu/beef-bowl.webp',ARRAY['A'],ARRAY['glutenfree','chef'],true,
 'Brazil Beef Bowl','Brazil Beef Bowl','Brazil Beef Bowl',
 'Rice, black beans, tender beef, salad, pico de gallo, guacamole.',
 'Reis, schwarze Bohnen, Rindfleisch, Salat, Pico de Gallo, Guacamole.',
 'Arroz, feijão preto, carne, salada, pico de gallo, guacamole.',170),

('texmex-bowl','bowls',15.90,NULL,ARRAY['A'],ARRAY[]::TEXT[],false,
 'Tex-Mex Bowl','Tex-Mex Bowl','Tex-Mex Bowl',
 'Rice, black beans, pork, corn, pico de gallo, guacamole.',
 'Reis, schwarze Bohnen, Schweinefleisch, Mais, Pico de Gallo, Guacamole.',
 'Arroz, feijão preto, porco, milho, pico de gallo, guacamole.',180),

('chipotle-bowl','bowls',17.90,NULL,ARRAY['A','G'],ARRAY['spicy','new'],false,
 'Chipotle Bowl','Chipotle Bowl','Chipotle Bowl',
 'Rice, pinto beans, chicken, salad, guacamole, cheese, sour cream.',
 'Reis, Pinto Bohnen, Hähnchen, Salat, Guacamole, Käse, Sauerrahm.',
 'Arroz, feijão pinto, frango, salada, guacamole, queijo, creme azedo.',190),

('surf-turf-bowl','bowls',18.90,NULL,ARRAY['A','B'],ARRAY['glutenfree','new'],false,
 'Surf & Turf Bowl','Surf & Turf Bowl','Surf & Turf Bowl',
 'Rice, black beans, beef and prawns, salad, guacamole.',
 'Reis, schwarze Bohnen, Rindfleisch & Garnelen, Salat, Guacamole.',
 'Arroz, feijão preto, carne e camarões, salada, guacamole.',200),

-- Soul Food Mains
('feijoada','mains',18.90,'/menu/feijoada.webp',ARRAY[]::TEXT[],ARRAY['glutenfree','chef'],true,
 'Feijoada','Feijoada','Feijoada',
 'Traditional Brazilian black bean stew with beef, sausage and pork, served with salad.',
 'Traditioneller brasilianischer Bohneneintopf mit Rindfleisch, Wurst und Schweinefleisch, serviert mit Salat.',
 'Feijoada tradicional com carne, linguiça e porco, servida com salada.',210),

('picanha','mains',22.90,'/menu/picanha.webp',ARRAY[]::TEXT[],ARRAY['glutenfree'],true,
 'Picanha','Picanha','Picanha',
 'Grilled Brazilian picanha served with rice, salad and farofa.',
 'Brasilianische Picanha vom Grill, serviert mit Reis, Salat und Farofa.',
 'Picanha brasileira na grelha, servida com arroz, salada e farofa.',220),

('african-stew','mains',17.90,'/menu/african-stew.webp',ARRAY['E'],ARRAY['glutenfree','lactosefree'],false,
 'African Peanut Stew with Fufu','African Peanut Stew mit Fufu','Ensopado Africano de Amendoim com Fufu',
 'Creamy peanut stew with chicken and vegetables, served with fufu and plantain.',
 'Cremiger Erdnusseintopf mit Hähnchen und Gemüse, serviert mit Fufu und Kochbananen.',
 'Ensopado cremoso de amendoim com frango e legumes, servido com fufu e banana.',230),

('veggie-stew','mains',16.90,'/menu/fufu.webp',ARRAY['E'],ARRAY['vegan','glutenfree','lactosefree'],false,
 'Veggie Peanut Stew with Fufu','Veggie Peanut Stew mit Fufu','Ensopado Vegano de Amendoim com Fufu',
 'Creamy vegetarian peanut stew with vegetables, served with fufu.',
 'Cremiger vegetarischer Erdnusseintopf mit Gemüse, serviert mit Fufu.',
 'Ensopado vegetariano cremoso de amendoim com legumes, servido com fufu.',240),

('jollof','mains',15.90,NULL,ARRAY[]::TEXT[],ARRAY['vegan','glutenfree','spicy'],false,
 'Jollof Rice','Jollof Reis','Arroz Jollof',
 'Spiced jollof rice with vegetables, served with salad. Add chicken +€3,00.',
 'Würziger Jollof Reis mit Gemüse, serviert mit Salat. + Frango (Chicken) € 3,00.',
 'Arroz jollof apimentado com legumes, servido com salada. + frango € 3,00.',250),

-- Seafood
('paella','seafood',23.90,'/menu/paella-douro.webp',ARRAY['B','R'],ARRAY['glutenfree','chef'],true,
 'Paella D''Ouro','Paella D''Ouro','Paella D''Ouro',
 'Traditional paella with prawns, mussels and seafood in saffron rice with Mediterranean spices.',
 'Traditionelle Paella mit Garnelen, Muscheln und Meeresfrüchten, zubereitet mit Safranreis und mediterranen Gewürzen.',
 'Paella tradicional com camarões, mexilhões e frutos do mar em arroz de açafrão.',260),

('brisa-do-mar','seafood',20.90,'/menu/brisa-do-mar.webp',ARRAY['R'],ARRAY[]::TEXT[],false,
 'Brisa Do Mar Premium','Brisa Do Mar Premium','Brisa Do Mar Premium',
 'Mussels and clams in a herbed tomato and white wine sauce.',
 'Auswahl aus Miesmuscheln und Venusmuscheln in einer Tomatensauce mit Kräutern und Weißwein.',
 'Mexilhões e amêijoas em molho de tomate com ervas e vinho branco.',270),

-- Sides
('sweet-potato-fries','sides',8.90,NULL,ARRAY[]::TEXT[],ARRAY['vegan','glutenfree'],false,
 'Sweet Potato Fries','Süsskartoffel-Pommes','Batata Doce Frita',
 'Crispy sweet potato fries with sea salt and house aioli dip.',
 'Knusprige Pommes aus Süsskartoffeln mit Meersalz und hausgemachtem Aioli-Dip.',
 'Batata doce crocante com sal marinho e aioli da casa.',280),

-- Drinks
('amazonas','drinks',4.90,'/menu/amazonas.webp',ARRAY[]::TEXT[],ARRAY['vegan'],false,
 'Amazonas','Amazonas','Amazonas',
 'Refreshing água fresca with pineapple, mint and coconut water.',
 'Erfrischende Água Fresca mit Ananas, Minze und Kokoswasser.',
 'Água fresca de abacaxi, hortelã e água de coco.',290),

('roja','drinks',4.90,'/menu/roja.webp',ARRAY[]::TEXT[],ARRAY['vegan'],false,
 'Roja','Roja','Roja',
 'Fruity água fresca with hibiscus, lime and a touch of ginger.',
 'Fruchtige Água Fresca mit Hibiskus, Limette und einem Hauch Ingwer.',
 'Água fresca de hibisco, limão e um toque de gengibre.',300),

('caipirinha','drinks',8.90,'/menu/caipirinha.webp',ARRAY[]::TEXT[],ARRAY['chef'],true,
 'Caipirinha','Caipirinha','Caipirinha',
 'Brazil''s national cocktail — cachaça, fresh lime, sugar and ice.',
 'Brasiliens Nationalcocktail — Cachaça, frische Limette, Zucker und Eis.',
 'O coquetel nacional do Brasil — cachaça, limão, açúcar e gelo.',310),

('caipirinha-0','drinks',6.90,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Caipirinha (alcohol-free)','Caipirinha (alkoholfrei)','Caipirinha (sem álcool)',
 'Alcohol-free version with lime, sugar and ice.',
 'Cachaça-freie Variante mit Limette, Zucker und Eis.',
 'Versão sem álcool com limão, açúcar e gelo.',320),

('mojito','drinks',8.90,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Mojito','Mojito','Mojito',
 'The Cuban classic — white rum, mint, lime, cane sugar and soda.',
 'Der kubanische Klassiker — weißer Rum, frische Minze, Limette, Rohrzucker und Soda.',
 'O clássico cubano — rum branco, hortelã, limão, açúcar e soda.',330),

('mojito-0','drinks',6.90,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Mojito (alcohol-free)','Mojito (alkoholfrei)','Mojito (sem álcool)',
 'Fresh mint, lime, cane sugar and soda.',
 'Frische Minze, Limette, Rohrzucker und Soda.',
 'Hortelã fresca, limão, açúcar de cana e soda.',340),

('cocktail-rio','drinks',6.90,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Cocktail Rio','Cocktail Rio','Cocktail Rio',
 'Tropical mix of cachaça, passion fruit, lime and coconut cream.',
 'Tropischer Mix aus Cachaça, Maracuja, Limette und Kokoscreme.',
 'Mistura tropical de cachaça, maracujá, limão e creme de coco.',350),

('guarana','drinks',5.90,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Guaraná Antarctica','Guaraná Antarctica','Guaraná Antarctica',
 'Brazil''s favourite soft drink with the unique Amazonian guaraná flavour.',
 'Brasiliens beliebtestes Erfrischungsgetränk mit Guaraná-Geschmack aus dem Amazonas.',
 'O refrigerante preferido do Brasil, com sabor único de guaraná.',360),

('softdrinks','drinks',3.80,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Soft Drinks','Softdrinks','Refrigerantes',
 'Sinalco Cola, Fanta, Sprite.','Sinalco Cola, Fanta, Sprite.','Sinalco Cola, Fanta, Sprite.',370),

('water','drinks',3.20,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Mineral Water','Mineralwasser','Água Mineral',
 'Still or sparkling.','Mit oder ohne Kohlensäure.','Com ou sem gás.',380),

('tap-water','drinks',1.00,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Tap Water','Leitungswasser','Água da Torneira',
 'Chilled tap water — refreshing and sustainable.',
 'Gekühltes Leitungswasser — erfrischend und umweltbewusst.',
 'Água da torneira gelada — refrescante e sustentável.',390),

('espresso','drinks',3.20,NULL,ARRAY[]::TEXT[],ARRAY[]::TEXT[],false,
 'Café Expresso','Café Expresso','Café Expresso',
 'Strong Brazilian espresso — intense and aromatic.',
 'Kräftiger brasilianischer Espresso — intensiv und aromatisch.',
 'Café expresso brasileiro — intenso e aromático.',400),

('cafe-gelenga','drinks',3.80,NULL,ARRAY['M'],ARRAY[]::TEXT[],false,
 'Café Gelenga','Café Gelenga','Café Gelenga',
 'Brazilian iced coffee with milk foam and a hint of cinnamon.',
 'Brasilianischer Eiskaffee mit Milchschaum und einem Hauch Zimt.',
 'Café gelado brasileiro com espuma de leite e canela.',410),

-- Desserts
('pudim','desserts',4.90,'/menu/pudimdecaremilo.webp',ARRAY['M'],ARRAY['vegetarian','chef'],true,
 'Pudim de Caramelo','Pudim de Caramelo','Pudim de Caramelo',
 'Silky Brazilian caramel flan with golden caramel sauce.',
 'Brasilianischer Karamellpudding — samtig-weich mit goldener Karamellsauce.',
 'Pudim de caramelo brasileiro, sedoso e com calda dourada.',420),

('torta-chocolate','desserts',5.90,'/menu/tortadechocolate.webp',ARRAY['A','M'],ARRAY['vegetarian'],false,
 'Torta de Chocolate','Torta de Chocolate','Torta de Chocolate',
 'Moist Brazilian chocolate cake with intense cocoa flavour.',
 'Saftiger brasilianischer Schokoladenkuchen mit intensivem Kakaogeschmack.',
 'Bolo de chocolate brasileiro, úmido e intenso.',430),

('brigadeiro','desserts',4.90,'/menu/brigadeiro.webp',ARRAY['M'],ARRAY['vegetarian'],false,
 'Brigadeiro','Brigadeiro','Brigadeiro',
 'Brazilian chocolate truffles rolled in chocolate sprinkles.',
 'Brasilianische Schokoladentrüffel, gerollt in Schokoladenstreuseln.',
 'Trufas brasileiras de chocolate com granulado.',440),

('beijinho','desserts',4.90,'/menu/beijinho.webp',ARRAY['M'],ARRAY['vegetarian'],false,
 'Beijinho','Beijinho','Beijinho',
 'Brazilian coconut truffles — sweet, tender and delicious.',
 'Brasilianische Kokostrüffel — süß, zart und köstlich.',
 'Beijinhos de coco — doces e delicados.',450)

ON CONFLICT (id) DO NOTHING;

-- Done! ✅

-- ─── Migration: add review gating columns (safe to run on existing DB) ────────
-- Run this if you already have a reviews table from an earlier seed:
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS pending BOOLEAN DEFAULT FALSE;
ALTER TABLE restaurant ADD COLUMN IF NOT EXISTS google_review TEXT;

-- Also allow service role to INSERT into reviews (for in-app review submissions)
DROP POLICY IF EXISTS "Service role write reviews" ON reviews;
CREATE POLICY "Service role write reviews" ON reviews FOR INSERT WITH CHECK (true);

-- ─── Migration: add availability column (safe to run on existing DB) ─────────
-- Run this if you already have a menu_items table from an earlier seed:
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;

-- ─── Migration: create storage bucket for images ─────────
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read menu images" ON storage.objects;
CREATE POLICY "Public read menu images" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Service role write menu images" ON storage.objects;
CREATE POLICY "Service role write menu images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Service role update menu images" ON storage.objects;
CREATE POLICY "Service role update menu images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Service role delete menu images" ON storage.objects;
CREATE POLICY "Service role delete menu images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images');
