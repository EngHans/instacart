-- migrate:up

ALTER TABLE carts ADD COLUMN assigned_points INT;

-- migrate:down

