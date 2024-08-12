-- migrate:up

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS promotions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code VARCHAR,
  benefit FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT promotion_pk PRIMARY KEY (id),
  UNIQUE(code)
);

CREATE TABLE IF NOT EXISTS carts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  promotion_code VARCHAR,
  total FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_pk PRIMARY KEY (id),
  CONSTRAINT cart_references_promotion_fk FOREIGN KEY (promotion_code)
    REFERENCES promotions(code)
);

CREATE TABLE IF NOT EXISTS products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL,
  sku VARCHAR,
  quantity INT,
  price FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT product_pk PRIMARY KEY (id),
  CONSTRAINT product_references_cart_fk FOREIGN KEY (cart_id)
    REFERENCES carts(id)
);

-- migrate:down

