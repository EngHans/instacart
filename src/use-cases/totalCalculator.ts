import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { getCurrencyTotalByLoyaltyPoints } from "../gateways/loyalty";

export const calculateTotal = async (cart: Cart, needLoyaltyPointsDiscounts = true): Promise<number> => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discounts = calculateDiscounts(cart, totalBeforeDiscounts);

  const loyaltyDiscounts = await calculateLoyaltyDiscounts(cart.user_id, cart.points);

  if (!needLoyaltyPointsDiscounts) {
    return Number((totalBeforeDiscounts - discounts).toFixed(2));
  }

  const totalAfterCouponDiscounts = totalBeforeDiscounts - discounts;

  if (totalAfterCouponDiscounts > loyaltyDiscounts) {
    return Number((totalAfterCouponDiscounts - loyaltyDiscounts).toFixed(2));
  } else {
    throw new Error("Loyalty discounts cannot exceed the total after coupon discounts");
  }
};

export const calculateDiscounts = (cart: Cart, subtotal: number): number => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);

  return couponDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};

export const calculateLoyaltyDiscounts = async (userId: string, loyaltyPoints: number | null): Promise<number> => {
  if (loyaltyPoints) {
    const currencyTotal = await getCurrencyTotalByLoyaltyPoints(userId, loyaltyPoints);
    return currencyTotal.conversionValue;
  }

  return 0;
};
