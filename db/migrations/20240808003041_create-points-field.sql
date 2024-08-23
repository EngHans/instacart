-- migrate:up

ALTER TABLE carts
ADD IF NOT EXISTS points INT;

-- migrate:down