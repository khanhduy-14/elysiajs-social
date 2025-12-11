import { db } from "../../db/db";
import { user } from "../../db/schema/user";
import { AuthModel } from "./model";
import { hash, compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import jwtUtil from "../../utils/jwt";
import { AuthenticationError, DuplicateEmailError } from "../../utils/errors";
import { config } from "../../config";

export interface RefreshTokenPayload {
  id: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export abstract class AuthService {
  static async signUp({
    name,
    email,
    password,
    avatarUrl,
  }: AuthModel.signUpBody): Promise<{
    user: typeof user.$inferSelect;
    tokens: TokenPair;
  }> {
    const hashedPassword = await hash(
      password,
      config.authentication.passwordSaltLength,
    );

    try {
      const [newUser] = await db
        .insert(user)
        .values({
          email: email,
          name: name,
          password: hashedPassword,
          avatarUrl: avatarUrl,
        })
        .returning();

      const accessPayload: AuthModel.signInResponse = {
        id: newUser.publicId,
        email: newUser.email,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      const refreshPayload: RefreshTokenPayload = {
        id: newUser.publicId,
        email: newUser.email,
      };

      const tokens: TokenPair = {
        accessToken: jwtUtil.generateAccessToken(accessPayload),
        refreshToken: jwtUtil.generateRefreshToken(refreshPayload),
      };

      return { user: newUser, tokens };
    } catch (error) {
      if (error?.cause?.constraint === "user_email_unique") {
        throw new DuplicateEmailError(email);
      }
      throw error;
    }
  }

  static async signIn({ email, password }: AuthModel.signInBody): Promise<{
    user: typeof user.$inferSelect;
    tokens: TokenPair;
  }> {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!existingUser) {
      throw new AuthenticationError();
    }

    const isPasswordValid = await compare(password, existingUser.password);

    if (!isPasswordValid) {
      throw new AuthenticationError();
    }

    const accessPayload: AuthModel.signInResponse = {
      id: existingUser.publicId,
      email: existingUser.email,
      name: existingUser.name,
      avatarUrl: existingUser.avatarUrl,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    const refreshPayload: RefreshTokenPayload = {
      id: existingUser.publicId,
      email: existingUser.email,
    };

    const tokens: TokenPair = {
      accessToken: jwtUtil.generateAccessToken(accessPayload),
      refreshToken: jwtUtil.generateRefreshToken(refreshPayload),
    };

    return {
      user: existingUser,
      tokens,
    };
  }

  static async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded =
        jwtUtil.verifyRefreshToken<RefreshTokenPayload>(refreshToken);

      if (!decoded.id) {
        throw new AuthenticationError("Invalid token");
      }

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.publicId, decoded.id));

      if (!existingUser) {
        throw new AuthenticationError("Invalid token");
      }

      const accessPayload: AuthModel.signInResponse = {
        id: existingUser.publicId,
        email: existingUser.email,
        name: existingUser.name,
        avatarUrl: existingUser.avatarUrl,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      };

      const newRefreshPayload: RefreshTokenPayload = {
        id: existingUser.publicId,
        email: existingUser.email,
      };

      return {
        accessToken: jwtUtil.generateAccessToken(accessPayload),
        refreshToken: jwtUtil.generateRefreshToken(newRefreshPayload),
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError("Invalid token");
    }
  }

  static async logout(userId: string): Promise<void> {
    console.log(`User ${userId} logged out`);
  }
}
