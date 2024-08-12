import format from "pg-format";

import { Cart } from "../../entities/carts";
import { ErrorMessage } from "../../errors/errors";
import { NotFoundError } from "../../errors/notFound.error";
import { DBTables } from "./basic";

export const getCarts = async (session: any): Promise<Cart[]> => {
  try {
    const query = format(
      `
        SELECT 
          *
        FROM ${DBTables.CARTS_TABLE}
      `,
    );

    const { rows } = await session.query(query);

    return rows.map(buildCartFromRow);
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_FIND_CARTS);
  }
};

function buildCartFromRow(row: any): Cart {
  return {
    id: row.id,
    user_id: row.user_id,
    total: row.total,
  };
}
