-- migrate:up

ALTER TABLE carts
ADD COLUMN applied_points INTEGER DEFAULT 0;


-- migrate:down

