import { Product } from "./products";

export interface Cart {
  id: string;
  user_id: string;
  total: number;
  coupon_code: string | null;
  products: Product[];
}

export interface UpdateCartInput {
  cart_id: string;
  coupon_code?: string;
}
