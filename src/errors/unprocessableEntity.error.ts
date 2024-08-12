import { STATUS_CODES } from "../gateways/basics";
import { ServerError } from "./server.error";

export class UnprocessableEntityError extends ServerError {
  constructor(message: string, errors?: any[]) {
    super(message, STATUS_CODES.UNPROCESSABLE_ENTITY, errors);
  }
}
