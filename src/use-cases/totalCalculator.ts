import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { getSwapPointsToCoins } from "../gateways/loyalty";

export const calculateTotal = (cart: Cart): number => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discountsByCoupons = calculateDiscounts(cart, totalBeforeDiscounts);

  return totalBeforeDiscounts - discountsByCoupons;
};

export const calculateDiscounts = (cart: Cart, subtotal: number): number => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);

  return couponDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};

export const calculateDiscountPoints = async (assigned_points: number) => {
  const swapPointsToCoins = await getSwapPointsToCoins(assigned_points);

  return (
    swapPointsToCoins.redemptionEquivalence.conversionValue * swapPointsToCoins.redemptionEquivalence.conversionRate
  );
};
