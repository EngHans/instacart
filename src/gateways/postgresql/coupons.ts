import { PoolClient } from "pg";
import format from "pg-format";

import { ErrorMessage } from "../../errors/errors";
import { NotFoundError } from "../../errors/notFound.error";
import { buildCondition, DBTables } from "./basic";
import { Coupon } from "../../entities/coupons";

export const getCouponByCouponCode = async (session: PoolClient, coupon_code: string): Promise<Coupon> => {
  try {
    const query = format(
      `
        SELECT 
          *
        FROM %s
        WHERE %s
      `,
      DBTables.COUPONS_TABLE,
      buildCondition(["code"], [[coupon_code]]),
    );

    const { rows } = await session.query(query);

    return buildCouponFromRow(rows[0]);
  } catch (error) {
    throw new NotFoundError(ErrorMessage.COULD_NOT_FIND_COUPON);
  }
};

const buildCouponFromRow = (row: any): Coupon => {
  return {
    coupon_code: row.code,
    benefit: row.benefit,
  };
};
