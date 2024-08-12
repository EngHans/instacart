import { STATUS_CODES } from "../gateways/basics";
import { ServerError } from "./server.error";

export class NotImplementedError extends ServerError {
  constructor(message: string, errors?: any[]) {
    super(message, STATUS_CODES.NOT_IMPLEMENTED, errors);
  }
}
