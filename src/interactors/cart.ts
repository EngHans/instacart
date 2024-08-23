import { PoolClient } from "pg";

import { Cart, MaximumRedeemablePoints, UpdateCartInput } from "../entities/carts";
import postgresql from "../gateways/postgresql";
import { getMaximumRedeemablePoints } from "../use-cases/loyalty";
import { calculateTotal, calculateTotalWithPoints } from "../use-cases/totalCalculator";
import { isUndefined } from "../utils.ts";

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

export const getCartById = async (id: string): Promise<Cart> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const getCartResponse = await postgresql.getCartById(poolClient, id);

    getCartResponse.total = calculateTotal(getCartResponse);

    return getCartResponse;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};

export const updateCart = async (input: UpdateCartInput): Promise<Cart> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, input.cart_id);

    if (!isUndefined(input.coupon_code)) {
      cart.coupon_code = input.coupon_code ?? null;
      cart.total = calculateTotal(cart);
    }

    if (!isUndefined(input.points)) {
      cart.points = input.points ?? null;
      const { user_id } = cart;
      cart.total = await calculateTotalWithPoints(cart, user_id);
    }

    await postgresql.saveCart(poolClient, cart);
    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};

export const getLoyaltyPointsByCartId = async (input: UpdateCartInput): Promise<MaximumRedeemablePoints> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, input.cart_id);

    const points = await getMaximumRedeemablePoints(cart);

    return { points };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};
