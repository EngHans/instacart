import { PoolClient } from "pg";

import { ApplyLoyaltyPointsToCartInput, Cart, MaximumRedeemablePoints, UpdateCartInput } from "../entities/carts";
import { ConflictError } from "../errors/conflict.error";
import { NotFoundError } from "../errors/notFound.error";
import { getSwapPointsToCoins } from "../gateways/loyalty";
import postgresql from "../gateways/postgresql";
import { getMaximumRedeemablePoints } from "../use-cases/loyalty";
import { calculateDiscountPoints, calculateTotal } from "../use-cases/totalCalculator";
import { isUndefined } from "../utils.ts";

export const getCarts = async (): Promise<Cart[]> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const getCartsResponse = await postgresql.getCarts(poolClient);

    await Promise.all(
      getCartsResponse.map(async (cart: Cart) => {
        cart.total = calculateTotal(cart);

        const totalDiscountPoints = cart.assigned_points ? await calculateDiscountPoints(cart.assigned_points) : 0;

        cart.total = cart.total - totalDiscountPoints;
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

    getCartResponse.total = calculateTotal(getCartResponse);

    const totalDiscountPoints = getCartResponse.assigned_points
      ? await calculateDiscountPoints(getCartResponse.assigned_points)
      : 0;

    getCartResponse.total = getCartResponse.total - totalDiscountPoints;

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

export const applyLoyaltyPointsToCartById = async (input: ApplyLoyaltyPointsToCartInput): Promise<Cart> => {
  const poolClient: PoolClient = await postgresql.pool.connect();
  try {
    const cart = await postgresql.getCartById(poolClient, input.cart_id);

    if (!cart) {
      throw new NotFoundError("Cart not exists");
    }

    const maximumRedeemablePoints = await getMaximumRedeemablePoints(cart);

    if (maximumRedeemablePoints < input.points) {
      throw new ConflictError("Number of points is great than maximun permited");
    }

    const swapPointsToCoins = await getSwapPointsToCoins(input.points);

    cart.assigned_points = input.points;

    await postgresql.applyPointsToCart(poolClient, cart);

    const totalPrice = cart.products.reduce((accumulated, product) => {
      return accumulated + product.price * product.quantity;
    }, 0);

    const totalPointsPrice =
      swapPointsToCoins.redemptionEquivalence.conversionValue * swapPointsToCoins.redemptionEquivalence.conversionRate;

    cart.total = totalPrice - totalPointsPrice;

    return cart;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    poolClient.release();
  }
};
