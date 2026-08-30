# Mahidol Lampang Portal data model

The production database is PostgreSQL-compatible (Neon HTTP adapter). IDs are UUIDs and timestamps are stored in UTC.

```sql
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'fulfilled', 'cancelled');
CREATE TYPE plot_status AS ENUM ('ready', 'normal', 'attention');
CREATE TYPE ev_booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_code varchar(50) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  map_url text,
  status plot_status NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  category varchar(100),
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  unit varchar(50) NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url text,
  harvest_date timestamptz,
  is_preorder boolean NOT NULL DEFAULT false,
  research_tag varchar(100),
  plot_id uuid REFERENCES plots(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sensor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id uuid NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  temperature_c numeric(5,2) NOT NULL,
  humidity_percent numeric(5,2) NOT NULL CHECK (humidity_percent BETWEEN 0 AND 100),
  soil_moisture_percent numeric(5,2) NOT NULL CHECK (soil_moisture_percent BETWEEN 0 AND 100),
  light_lux integer NOT NULL CHECK (light_lux >= 0)
);

CREATE TABLE ev_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name varchar(255) NOT NULL,
  customer_phone varchar(50) NOT NULL,
  vehicle_plate varchar(30) NOT NULL,
  charger_id varchar(50) NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status ev_booking_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ev_booking_time_order CHECK (end_at > start_at)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name varchar(255) NOT NULL,
  customer_phone varchar(50) NOT NULL,
  delivery_type varchar(50) NOT NULL,
  address text,
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  slip_url text,
  status order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price_per_unit numeric(10,2) NOT NULL CHECK (price_per_unit >= 0)
);
```

The order total and unit price are always recalculated from `products` inside a database transaction. Client totals are never trusted. Add indexes on `sensor_logs(plot_id, recorded_at DESC)`, `orders(created_at DESC)`, and `ev_bookings(start_at, end_at)` in the migration used by deployment. For multi-instance deployments, add a PostgreSQL exclusion constraint on active `ev_bookings` ranges or use a serializable transaction so concurrent requests cannot overbook the configured charger capacity.
