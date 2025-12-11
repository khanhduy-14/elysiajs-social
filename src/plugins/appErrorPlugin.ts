import { Elysia } from "elysia";
import {
  isAppError,
  parseValidationError,
  ErrorSchemas,
  ErrorCodes,
  AppError,
} from "../utils/errors";
import { ResponseBuilder } from "../utils/response";

export type ErrorSchemaKey = keyof typeof ErrorSchemas;
export { ErrorSchemas };

export const appErrorPlugin = new Elysia({
  name: "appErrorPlugin",
}).onError({ as: "global" }, ({ error, set, store, code }) => {
  const requestId = (store as any)?.requestId || "unknown";

  if (code === "VALIDATION") {
    const validationError = parseValidationError(error.message);
    set.status = validationError.status;
    return ResponseBuilder.error(
      {
        code: validationError.code,
        message: validationError.message,
        details: validationError.details,
      },
      requestId,
    );
  }

  if (error instanceof AppError) {
    set.status = error.status;
    return ResponseBuilder.error(
      {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      requestId,
    );
  }

  set.status = 500;
  return ResponseBuilder.error(
    {
      code: ErrorCodes.INTERNAL_ERROR,
      message: "Internal server error",
    },
    requestId,
  );
});
