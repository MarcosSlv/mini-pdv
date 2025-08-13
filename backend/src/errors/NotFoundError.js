import { ApiError } from "./ApiError.js";

export class NotFoundError extends ApiError {
  constructor(message) {
    super(404, message);
  }
}