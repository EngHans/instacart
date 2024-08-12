import { NextFunction, Request, Response } from "express";

import { ErrorMessage } from "../../errors/errors";
import { STATUS_CODES } from "../../gateways/basics";

export const healthCheck = (_: Request, res: Response) => {
  res.status(STATUS_CODES.OK).json({ status: "INSTACART_IS_HEALTHY" });
};

export const logRequest = (req: Request, _: Response, next: NextFunction) => {
  const { url, method, body } = req;
  console.log("REQUEST_RECEIVED", { url, method, body });
  next();
};

export const notFound = (_: Request, res: Response, __: NextFunction) => {
  res.status(STATUS_CODES.NOT_FOUND).json({ error: ErrorMessage.NOT_FOUND });
};

export const logError = (error: any, _: Request, res: Response, __: NextFunction) => {
  let httpCode = (error.httpCode as number) ?? STATUS_CODES.INTERNAL_ERROR;
  if (error.name === "UnauthorizedError") {
    httpCode = STATUS_CODES.UNAUTHORIZED;
  }
  console.error("ERROR", {}, error);
  res.status(httpCode).json({ error: error.message });
};
