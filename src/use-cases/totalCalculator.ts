import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { getEquivalencePointsInUsd } from "./loyalty";

export const calculateTotal = async (cart: Cart): Promise<number> => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);
  const discounts = calculateDiscounts(cart, totalBeforeDiscounts);
  const pointsRedeemed = await getEquivalencePointsInUsd(cart, cart.points_redeemed);
  return totalBeforeDiscounts - discounts - pointsRedeemed;
};

export const calculateDiscounts = (cart: Cart, subtotal: number): number => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);

  return couponDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};
