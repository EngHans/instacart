import { PoolClient } from "pg";

import { ApplyCashbackPoints, Cart, MaximumRedeemablePoints, UpdateCartInput } from "../entities/carts";
import postgresql from "../gateways/postgresql";
import { getMaximumRedeemablePoints } from "../use-cases/loyalty";
import { calculateTotal } from "../use-cases/totalCalculator";
import { isUndefined } from "../utils.ts";
import { validateCashbackAmount } from "../use-cases/validateCashbackPoints";
import { getEquivalenceDetails } from "../gateways/loyalty";

export const getCarts = async (): Promise<Cart[]> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const getCartsResponse = await postgresql.getCarts(poolClient);

    for (const cart of getCartsResponse) {
      const amountCashbackEquivalence = cart.cashback_points_redeemabled
        ? await getEquivalenceDetails(cart.user_id, cart.cashback_points_redeemabled)
        : null;

      cart.total = calculateTotal(cart, amountCashbackEquivalence?.conversionValue);
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
    console.log(getCartResponse);

    const amountCashbackEquivalence = getCartResponse.cashback_points_redeemabled
      ? await getEquivalenceDetails(getCartResponse.user_id, getCartResponse.cashback_points_redeemabled)
      : null;

    getCartResponse.total = calculateTotal(getCartResponse, amountCashbackEquivalence?.conversionValue);

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

export const applyCashbackPointsByCartId = async ({
  cart_id,
  cashbackPointsToApply,
}: ApplyCashbackPoints): Promise<boolean> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, cart_id);

    const maxPointsToRedeemableForCart = await getMaximumRedeemablePoints(cart);
    validateCashbackAmount(cashbackPointsToApply, maxPointsToRedeemableForCart);

    cart.cashback_points_redeemabled = cashbackPointsToApply;
    await postgresql.saveCart(poolClient, cart);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};
