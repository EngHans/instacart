import { PoolClient } from "pg";

import { Cart, MaximumRedeemablePoints, UpdateCartInput } from "../entities/carts";
import postgresql from "../gateways/postgresql";
import { getMaximumRedeemablePoints } from "../use-cases/loyalty";
import { calculateTotal } from "../use-cases/totalCalculator";
import { isUndefined } from "../utils.ts";
import { ErrorMessage } from "../errors/errors";

export const getCarts = async (): Promise<Cart[]> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const getCartsResponse = await postgresql.getCarts(poolClient);
    
    for (const cart of getCartsResponse) {
      cart.total = await calculateTotal(cart);
    }

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

    getCartResponse.total = await calculateTotal(getCartResponse);

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
      cart.total = await calculateTotal(cart);
    }

    if (!isUndefined(input.points)) {
      const max_points = await getMaximumRedeemablePoints(cart);
      if (input.points! > max_points || input.points! < 0) {
        throw new Error(ErrorMessage.INVALID_POINTS);
      }
      cart.redeemed_points = input.points ?? 0;
      cart.total = await calculateTotal(cart);
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

export const redeemLoyaltyPointsByCartId = async (cart_id: string): Promise<any> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, cart_id);
    const points = await getMaximumRedeemablePoints(cart);
    

    return { points: points };
  } catch (error) {
    console.error(error);
    throw error;  
  }
};
