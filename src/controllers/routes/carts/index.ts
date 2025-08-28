import { Router } from "express";

import {
  applyCashbackPointsByCartIdController,
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
carts.post("/:id/apply_cashback_points", applyCashbackPointsByCartIdController);

export default carts;
