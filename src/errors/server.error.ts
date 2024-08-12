import { STATUS_CODES } from "../gateways/basics";

export class ServerError extends Error {
  status: number;
  errors: any;

  constructor(message: string, statusCode: number = STATUS_CODES.INTERNAL_ERROR, errors?: any) {
    super(message);
    this.status = statusCode;
    this.errors = errors;
  }
}
