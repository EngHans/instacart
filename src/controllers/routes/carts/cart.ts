import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "../../../gateways/basics";
import postgresql from "../../../gateways/postgresql";

export const getCartsController = [
  async (_: Request, res: Response, next: NextFunction) => {
    const poolClient = await postgresql.pool.connect();
    try {
      const getCartsResponse = await postgresql.getCarts(poolClient);

      res.status(STATUS_CODES.OK).json(getCartsResponse);
    } catch (error) {
      next(error);
    } finally {
      poolClient.release();
    }
  },
];
