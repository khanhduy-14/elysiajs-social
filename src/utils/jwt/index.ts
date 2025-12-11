import jwt from "jsonwebtoken";
import { AuthenticationError, JWTTokenExpiredError } from "../errors";
import { config } from "../../config";

export interface JWTOptions {
  expiresIn?: string;
  issuer?: string;
  audience?: string;
}

const ACCESS_TOKEN_SECRET = config.secrets.jwtAccessSecret;
const REFRESH_TOKEN_SECRET = config.secrets.jwtRefreshSecret;

export function generateToken<T extends Record<string, any>>(
  payload: T,
  secret: string,
  options?: JWTOptions,
): string {
  return jwt.sign(payload as jwt.JwtPayload, secret, {
    expiresIn: options?.expiresIn,
    issuer: options?.issuer,
    audience: options?.audience,
  } as jwt.SignOptions);
}

export function generateAccessToken<T extends Record<string, any>>(
  payload: T,
  options?: JWTOptions,
): string {
  return generateToken(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: options?.expiresIn ?? "15m",
    issuer: options?.issuer ?? "elysia-social-app",
    audience: options?.audience ?? "elysia-social-users",
  });
}

export function generateRefreshToken<T extends Record<string, any>>(
  payload: T,
  options?: JWTOptions,
): string {
  return generateToken(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: options?.expiresIn ?? "7d",
    issuer: options?.issuer ?? "elysia-social-app",
    audience: options?.audience ?? "elysia-social-users",
  });
}

function handleVerifyError(error: unknown): never {
  if (error instanceof jwt.TokenExpiredError) {
    throw new JWTTokenExpiredError("Token expired");
  }

  throw new AuthenticationError("Invalid authentication");
}

export function verifyToken<T extends Record<string, any>>(
  token: string,
  secret: string,
): T {
  try {
    return jwt.verify(token, secret) as T;
  } catch (err) {
    handleVerifyError(err);
  }
}

export function verifyAccessToken<T extends Record<string, any>>(
  token: string,
): T {
  return verifyToken<T>(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken<T extends Record<string, any>>(
  token: string,
): T {
  return verifyToken<T>(token, REFRESH_TOKEN_SECRET);
}

export function extractBearerToken(authHeader?: string): string {
  if (!authHeader || typeof authHeader !== "string") {
    throw new AuthenticationError("Invalid authentication");
  }

  const prefix = "Bearer ";
  if (!authHeader.startsWith(prefix)) {
    throw new AuthenticationError("Invalid authentication");
  }

  const token = authHeader.slice(prefix.length).trim();
  if (!token) {
    throw new AuthenticationError("Invalid authentication");
  }

  return token;
}

export function decodeToken<T extends Record<string, any>>(
  token: string,
): T | null {
  try {
    const decoded = jwt.decode(token);
    return (decoded as T) ?? null;
  } catch {
    return null;
  }
}

const jwtUtil = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractBearerToken,
  decodeToken,
};

export default jwtUtil;
