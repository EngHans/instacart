import { Router } from "express";

import {
  applyLoyaltyPointsToCartByIdController,
  getCartByIdController,
  getCartsController,
  getLoyaltyPointsByCartIdController,
  updateCartByIdController,
} from "./cart";

const carts = Router();

carts.get("/", getCartsController);
carts.get("/:id", getCartByIdController);
carts.put("/:id", updateCartByIdController);
carts.get("/:id/maximum_redeemable_points", getLoyaltyPointsByCartIdController);
carts.put("/:id/apply_loyalty_points_to_cart", applyLoyaltyPointsToCartByIdController);

export default carts;
