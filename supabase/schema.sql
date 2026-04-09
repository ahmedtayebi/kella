-- ============================================================
--  صيدلية كيلالا — Supabase PostgreSQL Schema
--  Generated for: pharmacie-kelala
--  Wilaya base: El Oued (39)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
--  EXTENSIONS
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fast text search


-- ─────────────────────────────────────────────────────────────
--  HELPER: auto-update updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
--  1. CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  icon        TEXT,                          -- emoji or icon name
  sort_order  INT  NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT categories_slug_key UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_slug      ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories (is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort      ON categories (sort_order);

-- Seed categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('أدوية',            'adwiya',        '💊', 1),
  ('مكملات غذائية',   'mokamelat',     '🧴', 2),
  ('تجميل وعناية',    'tajmil',        '💄', 3),
  ('أجهزة طبية',      'ajhiza-tibiya', '🩺', 4),
  ('أطفال ورضع',      'atfal',         '👶', 5),
  ('نظافة',           'nathafa',       '🧼', 6)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
--  2. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                   TEXT NOT NULL,
  slug                   TEXT NOT NULL,
  description            TEXT,
  price                  DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_price          DECIMAL(10, 2) CHECK (compare_price >= 0),
  category_id            UUID NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  images                 TEXT[] NOT NULL DEFAULT '{}',
  stock_quantity         INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active              BOOLEAN NOT NULL DEFAULT true,
  is_featured            BOOLEAN NOT NULL DEFAULT false,
  requires_prescription  BOOLEAN NOT NULL DEFAULT false,
  brand                  TEXT,
  barcode                TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT products_slug_key UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS idx_products_slug        ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active   ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_barcode     ON products (barcode);
-- Full-text search index on product name
CREATE INDEX IF NOT EXISTS idx_products_name_trgm   ON products USING gin (name gin_trgm_ops);

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================
--  3. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number      TEXT NOT NULL,
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  customer_wilaya   TEXT NOT NULL,
  customer_commune  TEXT NOT NULL,
  customer_address  TEXT NOT NULL,
  notes             TEXT,
  subtotal          DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee      DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total             DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','preparing','shipped','delivered','cancelled')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT orders_order_number_key UNIQUE (order_number)
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_phone        ON orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at   ON orders (created_at DESC);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── Auto-generate order_number: PK-YYYYNNNN ──────────────────
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  v_year      TEXT;
  v_seq       INT;
  v_number    TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');

  SELECT COUNT(*) + 1
    INTO v_seq
    FROM orders
   WHERE TO_CHAR(created_at, 'YYYY') = v_year;

  v_number := 'PK-' || v_year || LPAD(v_seq::TEXT, 4, '0');

  -- Guarantee uniqueness under concurrent inserts
  WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = v_number) LOOP
    v_seq    := v_seq + 1;
    v_number := 'PK-' || v_year || LPAD(v_seq::TEXT, 4, '0');
  END LOOP;

  NEW.order_number := v_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();


-- ============================================================
--  4. ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products (id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,            -- snapshot at time of order
  quantity      INT NOT NULL CHECK (quantity > 0),
  unit_price    DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price   DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items (product_id);

-- ── Decrement stock on confirmed order ───────────────────────
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
     SET stock_quantity = stock_quantity - NEW.quantity
   WHERE id = NEW.product_id
     AND stock_quantity >= NEW.quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Insufficient stock for product % (requested: %)',
      NEW.product_id, NEW.quantity
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_stock
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION decrement_stock_on_order();

-- ── Restore stock on order cancellation ─────────────────────
CREATE OR REPLACE FUNCTION restore_stock_on_cancellation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    UPDATE products p
       SET stock_quantity = stock_quantity + oi.quantity
      FROM order_items oi
     WHERE oi.order_id = NEW.id
       AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_restore_stock_on_cancellation
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION restore_stock_on_cancellation();


-- ============================================================
--  5. DELIVERY PRICING  (all 58 Algerian wilayas)
--     Base: El Oued (39) — prices in DZD
--     desk_fee  = bureau-to-bureau
--     home_fee  = home delivery
-- ============================================================
CREATE TABLE IF NOT EXISTS delivery_pricing (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wilaya_code  INT NOT NULL,
  wilaya_name  TEXT NOT NULL,
  desk_fee     DECIMAL(8, 2) NOT NULL CHECK (desk_fee >= 0),
  home_fee     DECIMAL(8, 2) NOT NULL CHECK (home_fee >= 0),
  is_active    BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT delivery_pricing_wilaya_code_key UNIQUE (wilaya_code)
);

CREATE INDEX IF NOT EXISTS idx_delivery_wilaya_code ON delivery_pricing (wilaya_code);
CREATE INDEX IF NOT EXISTS idx_delivery_is_active   ON delivery_pricing (is_active);

INSERT INTO delivery_pricing (wilaya_code, wilaya_name, desk_fee, home_fee) VALUES
  ( 1,  'أدرار',                    800,  1100),
  ( 2,  'الشلف',                    750,  1050),
  ( 3,  'الأغواط',                  600,   850),
  ( 4,  'أم البواقي',               650,   900),
  ( 5,  'باتنة',                    650,   900),
  ( 6,  'بجاية',                    800,  1100),
  ( 7,  'بسكرة',                    450,   650),
  ( 8,  'بشار',                     850,  1150),
  ( 9,  'البليدة',                  800,  1100),
  (10,  'البويرة',                  800,  1100),
  (11,  'تمنراست',                  900,  1200),
  (12,  'تبسة',                     600,   850),
  (13,  'تلمسان',                   900,  1200),
  (14,  'تيارت',                    800,  1100),
  (15,  'تيزي وزو',                 800,  1100),
  (16,  'الجزائر',                  850,  1150),
  (17,  'الجلفة',                   650,   900),
  (18,  'جيجل',                     850,  1150),
  (19,  'سطيف',                     700,   950),
  (20,  'سعيدة',                    850,  1150),
  (21,  'سكيكدة',                   800,  1100),
  (22,  'سيدي بلعباس',              900,  1200),
  (23,  'عنابة',                    800,  1100),
  (24,  'قالمة',                    750,  1050),
  (25,  'قسنطينة',                  700,   950),
  (26,  'المدية',                   800,  1100),
  (27,  'مستغانم',                  850,  1150),
  (28,  'المسيلة',                  600,   850),
  (29,  'معسكر',                    850,  1150),
  (30,  'ورقلة',                    500,   700),
  (31,  'وهران',                    900,  1200),
  (32,  'البيض',                    800,  1100),
  (33,  'إليزي',                    750,  1050),
  (34,  'برج بوعريريج',             700,   950),
  (35,  'بومرداس',                  850,  1150),
  (36,  'الطارف',                   800,  1100),
  (37,  'تيندوف',                   900,  1200),
  (38,  'تيسمسيلت',                 800,  1100),
  (39,  'الوادي',                   400,   600),   -- home wilaya
  (40,  'خنشلة',                    600,   850),
  (41,  'سوق أهراس',                750,  1050),
  (42,  'تيبازة',                   850,  1150),
  (43,  'ميلة',                     700,   950),
  (44,  'عين الدفلى',               800,  1100),
  (45,  'النعامة',                  850,  1150),
  (46,  'عين تموشنت',               900,  1200),
  (47,  'غرداية',                   550,   800),
  (48,  'غليزان',                   850,  1150),
  (49,  'تيميمون',                  850,  1150),
  (50,  'برج باجي مختار',           900,  1200),
  (51,  'أولاد جلال',               500,   750),
  (52,  'بني عباس',                 850,  1150),
  (53,  'إن صالح',                  900,  1200),
  (54,  'إن قزام',                  900,  1200),
  (55,  'تقرت',                     420,   620),
  (56,  'جانت',                     800,  1100),
  (57,  'المغير',                   420,   620),
  (58,  'المنيعة',                  600,   850)
ON CONFLICT (wilaya_code) DO NOTHING;


-- ============================================================
--  6. ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'admin'
                CHECK (role IN ('admin', 'super_admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email);


-- ============================================================
--  7. SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key    TEXT NOT NULL,
  value  JSONB NOT NULL DEFAULT '{}',

  CONSTRAINT site_settings_key_key UNIQUE (key)
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings (key);

INSERT INTO site_settings (key, value) VALUES
  ('pharmacy_name',  '"صيدلية كلالة"'),
  ('phone',          '""'),
  ('address',        '"ليوة، ولاية الوادي"'),
  ('social_links',   '{"facebook": "", "instagram": "", "whatsapp": ""}'),
  ('delivery_note',  '"يُرجى التواصل معنا لتأكيد الطلب"'),
  ('min_order',      '500')
ON CONFLICT (key) DO NOTHING;


-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================

-- ── categories ───────────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories: public read"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "categories: admin write"
  ON categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ── products ─────────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products: public read active"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "products: admin read all"
  ON products FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "products: admin write"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ── orders ───────────────────────────────────────────────────
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can place an order (no auth required for storefront)
CREATE POLICY "orders: public insert"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "orders: admin full access"
  ON orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ── order_items ──────────────────────────────────────────────
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items: public insert"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_items: admin full access"
  ON order_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ── delivery_pricing ─────────────────────────────────────────
ALTER TABLE delivery_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_pricing: public read active"
  ON delivery_pricing FOR SELECT
  USING (is_active = true);

CREATE POLICY "delivery_pricing: admin write"
  ON delivery_pricing FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- ── admin_users ──────────────────────────────────────────────
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users: self read"
  ON admin_users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "admin_users: super_admin full"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
       WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
       WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ── site_settings ─────────────────────────────────────────────
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings: public read"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "site_settings: admin write"
  ON site_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );


-- ============================================================
--  STORAGE BUCKET: product-images
-- ============================================================
-- Run via Supabase dashboard or management API:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "product-images: public read"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');
--
-- CREATE POLICY "product-images: admin upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'product-images'
--     AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
--   );
--
-- CREATE POLICY "product-images: admin delete"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'product-images'
--     AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
--   );
--
-- NOTE: Uncomment and run separately if using supabase CLI migrations,
-- since storage.* access may require service_role in SQL editor.


-- ============================================================
--  USEFUL VIEWS
-- ============================================================

-- Orders with item count for admin list view
CREATE OR REPLACE VIEW orders_summary AS
SELECT
  o.*,
  COUNT(oi.id)     AS item_count,
  SUM(oi.quantity) AS total_units
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id;

-- Products with category name
CREATE OR REPLACE VIEW products_with_category AS
SELECT
  p.*,
  c.name AS category_name,
  c.slug AS category_slug
FROM products p
JOIN categories c ON c.id = p.category_id;


-- ============================================================
--  DONE
-- ============================================================
