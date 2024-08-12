import { Cart } from "../entities/carts";

export const calculateTotals = (cart: Cart): number => {
  const total = cart.products.reduce((accumulated, product)=> {
    return accumulated + (product.price * product.quantity);
  }, 0);
  return total;
}
