import { PoolClient } from "pg";
import format from "pg-format";

import { Product } from "../../entities/products";
import { ErrorMessage } from "../../errors/errors";
import { NotFoundError } from "../../errors/notFound.error";
import { buildCondition, DBTables } from "./basic";

export const getProductsByCartId = async (session: PoolClient, cart_id: string): Promise<Product[]> => {
  try {
    const query = format(
      `
        SELECT 
          *
        FROM %s
        WHERE %s
      `,
      DBTables.PRODUCTS_TABLE,
      buildCondition(["cart_id"], [[cart_id]]),
    );

    const { rows } = await session.query(query);

    return rows.map(buildProductFromRow);
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_FIND_PRODUCTS);
  }
};

const buildProductFromRow = (row: any): Product => {
  return {
    id: row.id,
    cart_id: row.cart_id,
    price: row.price,
    sku: row.sku,
    quantity: row.quantity,
  };
};
