import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";

export const calculateTotal = (cart: Cart): number => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discounts = calculateDiscount(cart.coupon, totalBeforeDiscounts)

  return totalBeforeDiscounts - discounts;
};

export const calculateDiscount = (coupon: Coupon | null, cartTotal: number): number => {
  return coupon ? cartTotal * ( coupon.benefit / 100) : 0;
};
