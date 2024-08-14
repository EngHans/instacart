import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";

export const calculateTotal = (cart: Cart): number => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discounts = calculateDiscounts(cart, totalBeforeDiscounts);

  return totalBeforeDiscounts - discounts;
};

export const calculateDiscounts = (cart: Cart, subtotal: number): number => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);

  return couponDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};
