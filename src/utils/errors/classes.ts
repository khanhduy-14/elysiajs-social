import { ErrorCode, ErrorCodes } from "./errorCodes";

export interface AppErrorMetadata {
  status: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
}

export interface AppErrorOptions extends Partial<AppErrorMetadata> {
  message: string;
}

export class AppError extends Error implements AppErrorMetadata {
  status: number;
  code: ErrorCode;
  message: string;
  details?: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.status = options.status || 500;
    this.code = options.code || ErrorCodes.INTERNAL_ERROR;
    this.message = options.message;
    this.details = options.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    details?: Array<{ field: string; message: string }>,
  ) {
    super({
      status: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      message,
      details,
    });
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super({
      status: 401,
      code: ErrorCodes.UNAUTHENTICATED,
      message,
    });
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super({
      status: 403,
      code: ErrorCodes.FORBIDDEN,
      message,
    });
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super({
      status: 404,
      code: ErrorCodes.NOT_FOUND,
      message,
    });
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists", code?: ErrorCode) {
    super({
      status: 409,
      code: code || ErrorCodes.DUPLICATE_EMAIL,
      message,
    });
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class DuplicateEmailError extends ConflictError {
  constructor(email: string) {
    super(`Email "${email}" already exists`, ErrorCodes.DUPLICATE_EMAIL);
    Object.setPrototypeOf(this, DuplicateEmailError.prototype);
  }
}

export class JWTTokenExpiredError extends AppError {
  constructor(message: string = "Token has expired") {
    super({
      status: 401,
      code: ErrorCodes.TOKEN_EXPIRED,
      message,
    });
    Object.setPrototypeOf(this, JWTTokenExpiredError.prototype);
  }
}

export class RSADecryptionError extends AppError {
  constructor(message: string = "Failed to decrypt password") {
    super({
      status: 400,
      code: ErrorCodes.VALIDATION_ERROR,
      message,
    });
    Object.setPrototypeOf(this, RSADecryptionError.prototype);
  }
}

export class RSAEncryptionError extends AppError {
  constructor(message: string = "Failed to encrypt password") {
    super({
      status: 500,
      code: ErrorCodes.INTERNAL_ERROR,
      message,
    });
    Object.setPrototypeOf(this, RSAEncryptionError.prototype);
  }
}

export interface DatabaseErrorOptions {
  message: string;
  code?: ErrorCode;
  details?: unknown;
  originalError?: Error;
}

export class DatabaseError extends AppError {
  originalError?: Error;

  constructor(options: DatabaseErrorOptions) {
    super({
      status: 400,
      code: options.code || ErrorCodes.DATABASE_ERROR,
      message: options.message,
      details: options.details,
    });
    this.originalError = options.originalError;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class DatabaseConnectionError extends AppError {
  originalError?: Error;

  constructor(
    message: string = "Database service unavailable",
    originalError?: Error,
  ) {
    super({
      status: 503,
      code: ErrorCodes.DATABASE_CONNECTION_ERROR,
      message,
    });
    this.originalError = originalError;
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
