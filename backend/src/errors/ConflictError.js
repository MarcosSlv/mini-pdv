import { ApiError } from "./ApiError.js";

export class ConflictError extends ApiError {
  constructor(message) {
    super(409, message);
  }
}
