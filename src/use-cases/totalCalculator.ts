import { Cart } from "../entities/carts";
import { Coupon } from "../entities/coupons";
import { getPointsConvertion } from "../gateways/loyalty";

export const calculateTotal = (cart: Cart): number => {
  const totalBeforeDiscounts = cart.products.reduce((accumulated, product) => {
    return accumulated + product.price * product.quantity;
  }, 0);

  const discounts = calculateDiscounts(cart, totalBeforeDiscounts);

  return parseFloat((totalBeforeDiscounts - discounts).toFixed(2));
};

export const calculateDiscounts = (cart: Cart, subtotal: number): number => {
  const couponDiscount = calculateCouponDiscounts(cart.coupon, subtotal);

  return couponDiscount;
};

export const calculateCouponDiscounts = (coupon: Coupon | null, subtotal: number): number => {
  return coupon ? subtotal * (coupon.benefit / 100) : 0;
};

export const calculateTotalWithPoints = async (cart: Cart, user_id: string): Promise<number> => {
  const { total, points } = cart;

  const discounts = await getPointsConvertion(points as number, user_id);

  const discount = parseFloat((total - discounts.conversionValue).toFixed(2));

  if (discount < 0) {
    throw new Error("no se pueden aplicar los puntos");
  }

  return discount;
};
