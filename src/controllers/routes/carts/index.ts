import { Router } from "express";

import {
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

export default carts;
