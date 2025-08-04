import { Coupon } from "./coupons";
import { Product } from "./products";

export interface Cart {
  id: string;
  user_id: string;
  total: number;
  coupon_code: string | null;
  products: Product[];
  coupon: Coupon | null;
  redeemed_points: number;
}

export interface UpdateCartInput {
  cart_id: string;
  coupon_code?: string;
  points?: number;
}

export interface MaximumRedeemablePoints {
  points: number;
}
