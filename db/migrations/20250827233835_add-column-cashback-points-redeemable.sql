-- migrate:up

ALTER TABLE carts ADD COLUMN cashback_points_redeemabled FLOAT

-- migrate:down