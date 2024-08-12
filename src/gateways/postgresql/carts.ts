import { PoolClient } from "pg";
import format from "pg-format";

import { Cart } from "../../entities/carts";
import { ErrorMessage } from "../../errors/errors";
import { NotFoundError } from "../../errors/notFound.error";
import { buildCondition, DBTables } from "./basic";
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
      buildCondition(["id"], [[id]])
    );

    const { rows } = await session.query(query);

    return buildCartFromRow(session, rows[0]);
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_FIND_CART);
  }
};

const buildCartFromRow = async (session: PoolClient, row: any): Promise<Cart> => {
  return {
    id: row.id,
    user_id: row.user_id,
    total: row.total,
    products: await getProductsByCartId(session, row.id as string),
  };
};
