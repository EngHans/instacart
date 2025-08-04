-- migrate:up
ALTER TABLE carts ADD COLUMN redeemed_points INT DEFAULT 0;

