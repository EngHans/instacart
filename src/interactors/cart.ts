import { PoolClient } from "pg";

import { Cart, MaximumRedeemablePoints, RedeemCartInput, UpdateCartInput } from "../entities/carts";
import postgresql from "../gateways/postgresql";
import {
  getEquivalencePointsInUsd,
  getMaximumRedeemablePoints,
  isRedeemablePointsByCart,
  isRedeemablePointsByUser,
} from "../use-cases/loyalty";
import { calculateTotal } from "../use-cases/totalCalculator";
import { isUndefined } from "../utils.ts";

export const getCarts = async (): Promise<Cart[]> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const getCartsResponse = await postgresql.getCarts(poolClient);

    await Promise.all(
      getCartsResponse.map(async (cart: Cart) => {
        cart.total = await calculateTotal(cart);
      }),
    );

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

export const redeemLoyaltyPointsByCartId = async (input: RedeemCartInput): Promise<Cart> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, input.cart_id);
    await isRedeemablePointsByUser(cart, input.points_to_redeem);
    const equivalentPoints = await getEquivalencePointsInUsd(cart, input.points_to_redeem);
    await isRedeemablePointsByCart(cart, equivalentPoints);
    cart.points_redeemed = input.points_to_redeem;
    await postgresql.saveCart(poolClient, cart);
    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};
