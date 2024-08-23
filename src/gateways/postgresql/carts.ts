import { PoolClient } from "pg";
import format from "pg-format";

import { Cart } from "../../entities/carts";
import { ErrorMessage } from "../../errors/errors";
import { NotFoundError } from "../../errors/notFound.error";
import { buildCondition, DBTables } from "./basic";
import { getCouponByCouponCode } from "./coupons";
import { getProductsByCartId } from "./products";

export const getCarts = async (session: PoolClient): Promise<Cart[]> => {
  try {
    const query = format(
      `
        SELECT 
          *
        FROM %s
      `,
      DBTables.CARTS_TABLE,
    );

    const { rows } = await session.query(query);

    return Promise.all(
      rows.map((row) => {
        return buildCartFromRow(session, row);
      }),
    );
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_FIND_CARTS);
  }
};

export const getCartById = async (session: PoolClient, id: string): Promise<Cart> => {
  try {
    const query = format(
      `
        SELECT 
          *
        FROM %s
        WHERE %s
      `,
      DBTables.CARTS_TABLE,
      buildCondition(["id"], [[id]]),
    );

    const { rows } = await session.query(query);

    return buildCartFromRow(session, rows[0]);
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_FIND_CART);
  }
};

export const saveCart = async (session: PoolClient, cart: Cart): Promise<void> => {
  try {
    const query = format(
      `
      INSERT INTO %s (id, user_id, coupon_code, created_at, updated_at, points)
        VALUES(%L, %L, %L, now(), now(), %L)
        ON CONFLICT (id)
        DO UPDATE SET
          coupon_code = EXCLUDED.coupon_code,
          updated_at = EXCLUDED.updated_at,
          points = EXCLUDED.points
      `,
      DBTables.CARTS_TABLE,
      cart.id,
      cart.user_id,
      cart.coupon_code,
      cart.points,
    );

    await session.query(query);
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_SAVE_CART);
  }
};

const buildCartFromRow = async (session: PoolClient, row: any): Promise<Cart> => {
  return {
    id: row.id,
    user_id: row.user_id,
    coupon_code: row.coupon_code ?? null,
    total: 0,
    products: await getProductsByCartId(session, row.id as string),
    coupon: row.coupon_code ? await getCouponByCouponCode(session, row.coupon_code as string) : null,
    points: row.points ?? null,
  };
};
