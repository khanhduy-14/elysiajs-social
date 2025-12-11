import { Elysia } from "elysia";
import pino from "pino";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { multistream } from "pino";
import { parseValidationError } from "../utils/errors";
import { config } from "../config";

// -------------------------
// Helpers
// -------------------------

const getLogFileName = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return path.join(process.cwd(), "logs", `app-${yyyy}-${mm}-${dd}.log`);
};

// Ensure logs folder exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// File stream (JSON logs)
const fileStream = fs.createWriteStream(getLogFileName(), { flags: "a" });

// Pretty console formatter
const consolePretty = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
    ignore: "pid,hostname",
  },
});

// -------------------------
// Logger (Bun-Safe)
// -------------------------

const logger = pino(
  {
    level: config.app.logLevel,
    base: null,
  },
  multistream([
    { stream: consolePretty }, // pretty console
    { stream: fileStream }, // raw JSON file
  ]),
);

// Safe wrapper
const safeLog = (
  logFn: (obj: any, msg?: string) => void,
  obj: any,
  msg: string,
) => {
  try {
    logFn(obj, msg);
  } catch (error) {
    console.error("[Logger Error]", error);
  }
};

// -------------------------
// Logging Plugin
// -------------------------

export const loggingPlugin = new Elysia({ name: "logging" })
  .derive({ as: "global" }, ({ request }) => {
    try {
      const url = new URL(request.url);
      const requestId = uuidv4();
      const startTime = Date.now();
      const method = request.method;
      const pathname = url.pathname;
      const query = url.search;

      safeLog(
        (obj, msg) => logger.info(obj, msg),
        {
          requestId,
          method,
          pathname,
          query,
          type: "request_start",
        },
        "Incoming request",
      );

      return {
        requestId,
        startTime,
        method,
        pathname,
        query,
        shouldLog: true,
      };
    } catch (error) {
      console.error("[Logging Plugin - Derive Error]", error);
      return {
        requestId: uuidv4(),
        startTime: Date.now(),
        method: "UNKNOWN",
        pathname: "UNKNOWN",
        query: "",
        shouldLog: false,
      };
    }
  })
  .onAfterHandle(
    { as: "global" },
    ({
      requestId,
      responseValue,
      startTime,
      method,
      pathname,
      query,
      shouldLog,
    }) => {
      try {
        if (!shouldLog || startTime == null) return;

        const duration = Date.now() - startTime;

        safeLog(
          (obj, msg) => logger.info(obj, msg),
          {
            requestId,
            method,
            pathname,
            query,
            responseValue,
            duration,
            type: "request_end",
          },
          "Request completed",
        );
      } catch (error) {
        console.error("[Logging Plugin - AfterHandle Error]", error);
      }
    },
  )
  .onError(
    { as: "global" },
    ({
      error,
      requestId,
      startTime,
      method,
      pathname,
      query,
      code,
      status,
      shouldLog,
    }) => {
      try {
        if (!shouldLog || startTime == null) return;

        const duration = Date.now() - startTime;

        safeLog(
          (obj, msg) => logger.error(obj, msg),
          {
            status,
            requestId,
            method,
            pathname,
            query,
            duration,
            error:
              code === "VALIDATION"
                ? parseValidationError(error.message)
                : error instanceof Error
                  ? error.message
                  : String(error),
            stack:
              code === "VALIDATION"
                ? ""
                : error instanceof Error
                  ? error.stack
                  : undefined,
            type: "request_error",
          },
          "Request failed",
        );
      } catch (logError) {
        console.error("[Logging Plugin - Error Handler Error]", logError);
      }
    },
  );
