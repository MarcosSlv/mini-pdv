import { ApiError } from "./ApiError.js";

export class BadRequestError extends ApiError {
  constructor(message) {
    super(400, message);
  }
}
