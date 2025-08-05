-- migrate:up
ALTER TABLE carts
ADD COLUMN points_redeemed INTEGER DEFAULT 0 NOT NULL;
-- migrate:down

