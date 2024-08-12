import { NextFunction, Request, Response } from "express";
import { PoolClient } from "pg";

import { STATUS_CODES } from "../../../gateways/basics";
import postgresql from "../../../gateways/postgresql";
import { getCarts } from "../../../interactors/cart";

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
    const poolClient: PoolClient = await postgresql.pool.connect();
    const { id } = req.params;
    try {
      const getCartsResponse = await postgresql.getCartById(poolClient, id);

      res.status(STATUS_CODES.OK).json(getCartsResponse);
    } catch (error) {
      next(error);
    } finally {
      poolClient.release();
    }
  },
];
