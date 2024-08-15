import { Cart } from "../entities/carts";
import { getCustomerLoyaltyDetails, LoyaltyResponse } from "../gateways/loyalty";
import { calculateTotal } from "./totalCalculator";

export const getMaximumRedeemablePoints = async (cart: Cart): Promise<number> => {
  const availablePointsByCustomer = await getCustomerLoyaltyDetails(cart.user_id);
  const cartValueInPoints = parsePointsEquivalenceFromCart(cart, availablePointsByCustomer);

  return Math.min(availablePointsByCustomer.points, cartValueInPoints);
};

const parsePointsEquivalenceFromCart = (cart: Cart, loyaltyPoints: LoyaltyResponse): number => {
  const equivalentPoints = calculateTotal(cart) * loyaltyPoints.redemptionEquivalence.conversionRate;
  const roundedPoints = Math.floor(equivalentPoints);

  return roundedPoints;
};
