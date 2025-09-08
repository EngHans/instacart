import { Coupon } from "./coupons";
import { Product } from "./products";

export interface Cart {
  id: string;
  user_id: string;
  total: number;
  assigned_points: number | null;
  coupon_code: string | null;
  products: Product[];
  coupon: Coupon | null;
}

export interface UpdateCartInput {
  cart_id: string;
  coupon_code?: string;
}

export interface MaximumRedeemablePoints {
  points: number;
}

export interface ApplyLoyaltyPointsToCartInput extends Pick<UpdateCartInput, "cart_id">, MaximumRedeemablePoints {
  user_id: string;
}

export interface EquivalenceResult {
  conversionValue: string;
  conversionRate: number;
  currencyCode: string;
}
