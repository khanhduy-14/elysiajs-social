import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateEmailError,
  JWTTokenExpiredError,
  RSADecryptionError,
  RSAEncryptionError,
  DatabaseError,
  DatabaseConnectionError,
} from "./classes";

export const ERROR_CLASSES = {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateEmailError,
  JWTTokenExpiredError,
  RSADecryptionError,
  RSAEncryptionError,
  DatabaseError,
  DatabaseConnectionError,
} as const;

export const APP_ERROR_INSTANCES = [
  new AuthenticationError(),
  new AuthorizationError(),
  new NotFoundError(),
  new DuplicateEmailError("example@email.com"),
  new JWTTokenExpiredError(),
  new RSADecryptionError(),
  new RSAEncryptionError(),
  new DatabaseError({ message: "Database operation failed" }),
  new DatabaseConnectionError(),
] as const;

export type AppErrorName = keyof typeof ERROR_CLASSES;

export type AppErrorCode = AppErrorName;
