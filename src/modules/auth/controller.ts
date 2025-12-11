import { Elysia, t } from "elysia";
import { API_ROUTE } from "../../config/routes";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import { authRSAPlugin } from "./plugins/authRSAPlugin";
import { jwtPlugin, jwtModel, AuthHeader } from "./plugins/jwtPlugin";
import { loggingPlugin } from "../../plugins/loggingPlugin";
import {
  ResponseBuilder,
  createSuccessResponseSchema,
} from "../../utils/response";
import { ErrorSchemas } from "../../plugins/appErrorPlugin";
import { config } from "../../config";

const setRefreshTokenCookie = (
  refreshTokenCookie: any,
  tokenValue: string,
): void => {
  refreshTokenCookie.set({
    value: tokenValue,
    httpOnly: true,
    secure: config.app.nodeEnv === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
};

export const authController = new Elysia({
  prefix: API_ROUTE.AUTH._,
})
  .use(loggingPlugin)
  .use(authRSAPlugin)
  .use(jwtPlugin)
  .post(
    API_ROUTE.AUTH.REGISTER,
    async ({ body, authRSA, requestId, cookie: { refreshToken } }) => {
      const decryptedPassword = authRSA.decryptPassword(body.password);
      const { user, tokens } = await AuthService.signUp({
        name: body.name,
        email: body.email,
        password: decryptedPassword,
        avatarUrl: body.avatarUrl,
      });

      setRefreshTokenCookie(refreshToken, tokens.refreshToken);

      return ResponseBuilder.success(
        {
          user: {
            id: user.publicId,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          accessToken: tokens.accessToken,
        },
        requestId,
      );
    },
    {
      body: AuthModel.signUpBody,
      response: {
        200: createSuccessResponseSchema(
          t.Object({
            user: AuthModel.signUpResponse,
            accessToken: jwtModel.properties.accessToken,
          }),
        ),
        400: ErrorSchemas.validationError,
        409: ErrorSchemas.DuplicateEmailError,
      },
    },
  )
  .post(
    API_ROUTE.AUTH.LOGIN,
    async ({ body, authRSA, requestId, cookie: { refreshToken } }) => {
      const decryptedPassword = authRSA.decryptPassword(body.password);
      const { user, tokens } = await AuthService.signIn({
        email: body.email,
        password: decryptedPassword,
      });

      setRefreshTokenCookie(refreshToken, tokens.refreshToken);

      return ResponseBuilder.success(
        {
          user: {
            id: user.publicId,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          accessToken: tokens.accessToken,
        },
        requestId,
      );
    },
    {
      body: AuthModel.signInBody,
      response: {
        200: createSuccessResponseSchema(
          t.Object({
            user: AuthModel.signInResponse,
            accessToken: jwtModel.properties.accessToken,
          }),
        ),
        400: ErrorSchemas.validationError,
        401: ErrorSchemas.AuthenticationError,
      },
    },
  )
  .post(
    API_ROUTE.AUTH.REFRESH,
    async ({ cookie: { refreshToken }, requestId }) => {
      const tokens = await AuthService.refreshToken(String(refreshToken.value));

      setRefreshTokenCookie(refreshToken, tokens.refreshToken);

      return ResponseBuilder.success(
        {
          accessToken: tokens.accessToken,
        },
        requestId,
      );
    },
    {
      response: {
        200: createSuccessResponseSchema(
          t.Object({
            accessToken: jwtModel.properties.accessToken,
          }),
        ),
        401: t.Union([
          ErrorSchemas.AuthenticationError,
          ErrorSchemas.JWTTokenExpiredError,
        ]),
      },
    },
  )
  .post(
    API_ROUTE.AUTH.LOGOUT,
    async ({ headers, jwt, requestId, cookie: { refreshToken } }) => {
      const authHeader = headers.authorization;
      const token = jwt.extractBearerToken(authHeader);
      const payload = jwt.verifyAccessToken<AuthModel.signInResponse>(token);

      await AuthService.logout(payload.id);
      refreshToken.remove();

      return ResponseBuilder.success(
        { message: "Logged out successfully" },
        requestId,
      );
    },
    {
      response: {
        200: createSuccessResponseSchema(
          t.Object({
            message: t.String({ examples: ["Logged out successfully"] }),
          }),
        ),
        401: t.Union([
          ErrorSchemas.AuthenticationError,
          ErrorSchemas.JWTTokenExpiredError,
        ]),
      },
      headers: AuthHeader,
      isAuth: true,
    },
  )
  .post(
    API_ROUTE.AUTH.GENERATE_PASSWORD,
    ({ body, authRSA, requestId }) => {
      return ResponseBuilder.success(
        authRSA.encryptPassword(body.password),
        requestId,
      );
    },
    {
      body: t.Object({
        password: t.String({ minLength: 1 }),
      }),
      response: {
        200: createSuccessResponseSchema(t.String()),
      },
    },
  );
