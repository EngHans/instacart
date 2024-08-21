import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { getLoyaltyPointsEquivalence } from "../gateways/loyalty";

export const calculateTotal = async (cart: Cart): Promise<number> => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discounts = await calculateDiscounts(cart, totalBeforeDiscounts);

  return totalBeforeDiscounts - discounts;
};

export const calculateDiscounts = async (cart: Cart, subtotal: number): Promise<number> => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);
  const loyaltyDiscount = await calculateLoyaltyDiscounts(cart.user_id, cart.points);

  return couponDiscount + loyaltyDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};

export const calculateLoyaltyDiscounts = async (userId: string, points: number | null): Promise<number> => {
  if (points) {
    const equivalence = await getLoyaltyPointsEquivalence(userId, points);
    return equivalence.conversionValue;
  }
  return 0;
};
