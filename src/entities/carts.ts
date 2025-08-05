import { Coupon } from "./coupons";
import { Product } from "./products";

export interface Cart {
  id: string;
  user_id: string;
  points_redeemed: number;
  total: number;
  coupon_code: string | null;
  products: Product[];
  coupon: Coupon | null;
}

export interface UpdateCartInput {
  cart_id: string;
  coupon_code?: string;
}

export interface RedeemCartInput {
  cart_id: string;
  points_to_redeem: number;
}
export interface MaximumRedeemablePoints {
  points: number;
}
