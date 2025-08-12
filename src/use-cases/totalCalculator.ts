import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { getEquivalenceAmountFromCart } from "./loyalty";

export const calculateTotal = async (cart: Cart, includePoints: boolean = true): Promise<number> => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discounts = calculateDiscounts(cart, totalBeforeDiscounts);
  let total = totalBeforeDiscounts - discounts;

  if (includePoints) {
    const points_amount = await getEquivalenceAmountFromCart(cart, +(cart.applied_points || 0));
    total = total - points_amount;
  }

  return total;
};

export const calculateDiscounts = (cart: Cart, subtotal: number): number => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);

  return couponDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};
