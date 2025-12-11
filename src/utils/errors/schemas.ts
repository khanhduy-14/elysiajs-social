import { t } from "elysia";
import {
  ERROR_CLASSES,
  APP_ERROR_INSTANCES,
  AppErrorName,
  ErrorCodes,
} from "./index";
import { createErrorResponseSchema } from "../response";

// Mapped type for all app error names plus the validationError key
type ErrorSchemaMap = {
  [K in AppErrorName | "validationError"]: ReturnType<
    typeof createErrorResponseSchema
  >;
};

function buildErrorSchemas(): ErrorSchemaMap {
  const entries: Array<[string, ReturnType<typeof createErrorResponseSchema>]> =
    Object.entries(ERROR_CLASSES).map(([name, Ctor], idx) => {
      const instance = (APP_ERROR_INSTANCES as readonly any[])[idx];
      return [name, createErrorResponseSchema(instance.code, instance.message)];
    });

  entries.push([
    "validationError",
    createErrorResponseSchema(
      ErrorCodes.VALIDATION_ERROR,
      "Validation failed",
      t.Array(
        t.Object({
          field: t.String(),
          message: t.String(),
        }),
      ),
    ),
  ]);

  return Object.fromEntries(entries) as ErrorSchemaMap;
}

export const ErrorSchemas = buildErrorSchemas();
export type ErrorSchemaKey = keyof typeof ErrorSchemas;
