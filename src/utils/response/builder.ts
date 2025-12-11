import { v4 as uuidv4 } from "uuid";
import { t, TSchema } from "elysia";
import { ErrorCode } from "../errors/errorCodes";
import { createId } from "@paralleldrive/cuid2";

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details: unknown;
    requestId: string;
  };
}

export interface SuccessResponse<T> {
  data: T;
  requestId: string;
}

export const createSuccessResponseSchema = <T extends TSchema>(dataSchema: T) =>
  t.Object({
    data: dataSchema,
    requestId: t.String({ examples: [uuidv4().toString()] }),
  });

export const createErrorResponseSchema = <T extends TSchema>(
  code: string,
  message: string,
  detailsSchema?: T,
) =>
  t.Object({
    error: t.Object({
      code: t.String({ examples: [code] }),
      message: t.String({ examples: [message] }),
      details: detailsSchema ?? t.Unknown(),
      requestId: t.String({ examples: [uuidv4()] }),
    }),
  });

export class ResponseBuilder {
  static error(
    data: {
      code: ErrorCode;
      message: string;
      details?: any;
    },
    requestId?: string,
  ): ErrorResponse {
    return {
      error: {
        code: data.code,
        message: data.message,
        details: data.details ?? null,
        requestId: requestId ?? uuidv4(),
      },
    };
  }

  static success<T>(data: T, requestId?: string): SuccessResponse<T> {
    return {
      data,
      requestId: requestId ?? uuidv4(),
    };
  }
}
