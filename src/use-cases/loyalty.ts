import { Cart } from "../entities/carts";
import { getCustomerLoyaltyDetails, getEquivalencePoints, LoyaltyResponse } from "../gateways/loyalty";
import { calculateTotal } from "./totalCalculator";

export const getMaximumRedeemablePoints = async (cart: Cart): Promise<number> => {
  const availablePointsByCustomer = await getCustomerLoyaltyDetails(cart.user_id);
  const cartValueInPoints = await parsePointsEquivalenceFromCart(cart, availablePointsByCustomer);

  return Math.min(availablePointsByCustomer.points, cartValueInPoints);
};
export const isRedeemablePointsByUser = async (cart: Cart, points: number): Promise<void> => {
  const availablePointsByCustomer = await getCustomerLoyaltyDetails(cart.user_id);
  if (points > availablePointsByCustomer.points) {
    throw new Error(`Insufficient loyalty points to redeem by user with id: ${cart.user_id}`);
  }
};
export const isRedeemablePointsByCart = async (cart: Cart, points: number): Promise<void> => {
  const maximum_redeemable_points_cart = await getMaximumRedeemablePoints(cart);
  if (points > maximum_redeemable_points_cart) {
    throw new Error(`Insufficient loyalty points to redeem for cart with id: ${cart.id}`);
  }
};
export const getEquivalencePointsInUsd = async (cart: Cart, points: number): Promise<number> => {
  const equivalentPoints = await getEquivalencePoints(cart.user_id, points);
  return equivalentPoints;
};
const parsePointsEquivalenceFromCart = async (cart: Cart, loyaltyPoints: LoyaltyResponse): Promise<number> => {
  const equivalentPoints = (await calculateTotal(cart)) * loyaltyPoints.redemptionEquivalence.conversionRate;
  const roundedPoints = Math.floor(equivalentPoints);
  return roundedPoints;
};
