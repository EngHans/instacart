import { Router } from "express";

import { getCartByIdController, getCartsController } from "./cart";

const carts = Router();

carts.get("/", getCartsController);
carts.get("/:id", getCartByIdController);

export default carts;
