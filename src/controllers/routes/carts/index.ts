import { Router } from "express";

import { getCartByIdController, getCartsController, updateCartByIdController } from "./cart";

const carts = Router();

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Retrieve a list of carts
 *     responses:
 *       200:
 *         description: A list of carts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   items:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ['item1', 'item2']
 */
carts.get("/", getCartsController);
carts.get("/:id", getCartByIdController);
carts.put("/:id", updateCartByIdController);

export default carts;
