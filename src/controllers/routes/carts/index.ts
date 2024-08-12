import { Router } from "express";

import { getCartsController } from "./cart";

const carts = Router();

carts.get("/", getCartsController);

export default carts;
