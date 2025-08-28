import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "../../../gateways/basics";
import {
  applyCashbackPointsByCartId,
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

export const applyCashbackPointsByCartIdController = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: cart_id } = req.params;
      const { cashbackPointsToApply } = req.body;

      const cartUpdatedWithDiscountApplied = await applyCashbackPointsByCartId({ cart_id, cashbackPointsToApply });

      res.status(STATUS_CODES.OK).json(cartUpdatedWithDiscountApplied);
    } catch (error) {
      next(error);
    }
  },
];
