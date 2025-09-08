import pool from "./api";
import { applyPointsToCart, getCartById, getCarts, saveCart } from "./carts";
import { getCouponByCouponCode } from "./coupons";

export default {
  pool,
  getCarts,
  getCartById,
  saveCart,
  getCouponByCouponCode,
  applyPointsToCart,
};
