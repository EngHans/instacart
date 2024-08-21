import { Cart } from "../entities/carts";
import { getCustomerLoyaltyDetails, LoyaltyResponse } from "../gateways/loyalty";
import { calculateTotal } from "./totalCalculator";

export const getMaximumRedeemablePoints = async (cart: Cart): Promise<number> => {
  const availablePointsByCustomer = await getCustomerLoyaltyDetails(cart.user_id);
  const cartValueInPoints = await parsePointsEquivalenceFromCart(cart, availablePointsByCustomer);

  return Math.min(availablePointsByCustomer.points, cartValueInPoints);
};

const parsePointsEquivalenceFromCart = async (cart: Cart, loyaltyPoints: LoyaltyResponse): Promise<number> => {
  const equivalentPoints = (await calculateTotal(cart)) * loyaltyPoints.redemptionEquivalence.conversionRate;
  const roundedPoints = Math.floor(equivalentPoints);

  return roundedPoints;
};
