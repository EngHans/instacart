import { Coupon } from "./coupons";
import { Product } from "./products";

export interface Cart {
  id: string;
  user_id: string;
  total: number;
  coupon_code: string | null;
  products: Product[];
  coupon: Coupon | null;
  cashback_points_redeemabled?: number | null;
}

export interface UpdateCartInput {
  cart_id: string;
  coupon_code?: string;
}

export interface MaximumRedeemablePoints {
  points: number;
}

export interface ApplyCashbackPoints {
  cart_id: string;
  cashbackPointsToApply: number;
}
