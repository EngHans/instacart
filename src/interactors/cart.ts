import { PoolClient } from "pg";

import { Cart } from "../entities/carts";
import postgresql from "../gateways/postgresql";
import { calculateTotal } from "../use-cases/totalCalculator";

export const getCarts = async (): Promise<Cart[]> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const getCartsResponse = await postgresql.getCarts(poolClient);

    getCartsResponse.forEach((cart: Cart) => {
      cart.total = calculateTotal(cart);
    });

    return getCartsResponse;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};
