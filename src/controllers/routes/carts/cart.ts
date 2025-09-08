import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "../../../gateways/basics";
import {
  applyLoyaltyPointsToCartById,
  getCartById,
  getCarts,
  getLoyaltyPointsByCartId,
  updateCart,
} from "../../../interactors/cart";

export const getCartsController = [
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const getCartsResponse = await getCarts();
      res.status(STATUS_CODES.OK).json(getCartsResponse);
    } catch (error) {
      next(error);
    }
  },
];

export const getCartByIdController = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const getCartsResponse = await getCartById(id);
      res.status(STATUS_CODES.OK).json(getCartsResponse);
    } catch (error) {
      next(error);
    }
  },
];

export const updateCartByIdController = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { coupon_code } = req.body;
      const getCartsResponse = await updateCart({ cart_id: id, coupon_code });
      res.status(STATUS_CODES.OK).json(getCartsResponse);
    } catch (error) {
      next(error);
    }
  },
];

export const getLoyaltyPointsByCartIdController = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const getLoyaltyPointsResponse = await getLoyaltyPointsByCartId({ cart_id: id });

      res.status(STATUS_CODES.OK).json(getLoyaltyPointsResponse);
    } catch (error) {
      next(error);
    }
  },
];

export const applyLoyaltyPointsToCartByIdController = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { points, user_id } = req.body;

      if (!id) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "id is required" });
      }

      if (!user_id) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "user_id is required" });
      }

      const pointsNumber = Number(points);

      if (isNaN(pointsNumber)) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "points must be a number and not NaN" });
      }

      const applyLoyaltyPointsToCartResponse = await applyLoyaltyPointsToCartById({
        user_id,
        cart_id: id,
        points: pointsNumber,
      });

      res.status(STATUS_CODES.OK).json(applyLoyaltyPointsToCartResponse);
    } catch (error) {
      next(error);
    }
  },
];
