-- migrate:up

ALTER TABLE carts ADD COLUMN points INT;

-- migrate:down

