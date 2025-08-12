import { PoolClient } from "pg";

import { Cart, GetLoyaltyPointsAmunt, MaximumRedeemablePoints, UpdateCartInput } from "../entities/carts";
import postgresql from "../gateways/postgresql";
import { getMaximumRedeemablePoints, getEquivalenceAmountFromCart } from "../use-cases/loyalty";
import { calculateTotal } from "../use-cases/totalCalculator";
import { isUndefined } from "../utils.ts";

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

export const getLoyaltyPointsAmountByCartId = async (input: GetLoyaltyPointsAmunt) => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, input.cart_id);

    const maxPoints = await getMaximumRedeemablePoints(cart);

    console.log("maxPoints", maxPoints);
    if (maxPoints < input.points) {
      throw new Error("User doesn't have enough points");
    }

    const pointsEquivalency = await getEquivalenceAmountFromCart(cart, input.points);

    const total = await calculateTotal(cart, false);

    cart.total = total - pointsEquivalency;

    if (pointsEquivalency > total) {
      throw new Error("Cart value is lower than points amount");
    }

    cart.applied_points = input.points;

    await postgresql.saveCart(poolClient, cart);
    return { success: true, cart };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};
