import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { redeemLoyaltyPoints } from "../gateways/loyalty";

export const calculateTotal = async (cart: Cart): Promise<number> => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const { couponDiscount, redeemedPoints } = await calculateDiscounts(cart, totalBeforeDiscounts);

  return totalBeforeDiscounts - couponDiscount - redeemedPoints;
};

export const calculateDiscounts = async (cart: Cart, subtotal: number): Promise<{ couponDiscount: number, redeemedPoints: number }> => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);
  const redeemedPoints = await calculateRedeemedPoints(cart);
  return { couponDiscount, redeemedPoints };
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};

export const calculateRedeemedPoints = async (cart: Cart): Promise<number> => {
  const redeemedPointsValue = await redeemLoyaltyPoints(cart.user_id, cart.redeemed_points);
  return redeemedPointsValue;
}

