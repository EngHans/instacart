import { Product } from "./products";

export interface Cart {
  id: string;
  user_id: string;
  total: number;
  products: Product[];
}
