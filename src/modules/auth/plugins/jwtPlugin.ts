import { Elysia, t } from "elysia";
import jwtUtil from "../../../utils/jwt";
import { AuthenticationError } from "../../../utils/errors";
import { AuthModel } from "../model";

export const jwtModel = t.Object({
  accessToken: t.String({
    examples: [
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imcwb3lxNnIwZGN4ajg1MDYwb2p2enhvdCIsImVtYWlsIjoia2QxNEB5b3BtYWlsLmNvbSIsIm5hbWUiOiJrZDE0IiwiYXZhdGFyVXJsIjoiaHR0cHM6Ly9waWNzdW0ucGhvdG9zLzIwMC8zMDAiLCJjcmVhdGVkQXQiOiIyMDI1LTEyLTEwVDA5OjE4OjE1LjQ0OVoiLCJ1cGRhdGVkQXQiOiIyMDI1LTEyLTEwVDA5OjE4OjE1LjQ0OVoiLCJpYXQiOjE3NjUzNTgyOTUsImV4cCI6MTc2NTM1OTE5NSwiYXVkIjoiZWx5c2lhLXNvY2lhbC11c2VycyIsImlzcyI6ImVseXNpYS1zb2NpYWwtYXBwIn0.7Yi_yT6k2Td7KzvA3XdOLVVIrwY6N_eDSRipTZ0WJV0",
    ],
  }),
  refreshToken: t.String({
    examples: [
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imcwb3lxNnIwZGN4ajg1MDYwb2p2enhvdCIsImVtYWlsIjoia2QxNEB5b3BtYWlsLmNvbSIsIm5hbWUiOiJrZDE0IiwiYXZhdGFyVXJsIjoiaHR0cHM6Ly9waWNzdW0ucGhvdG9zLzIwMC8zMDAiLCJjcmVhdGVkQXQiOiIyMDI1LTEyLTEwVDA5OjE4OjE1LjQ0OVoiLCJ1cGRhdGVkQXQiOiIyMDI1LTEyLTEwVDA5OjE4OjE1LjQ0OVoiLCJpYXQiOjE3NjUzNTgyOTUsImV4cCI6MTc2NTM1OTE5NSwiYXVkIjoiZWx5c2lhLXNvY2lhbC11c2VycyIsImlzcyI6ImVseXNpYS1zb2NpYWwtYXBwIn0.7Yi_yT6k2Td7KzvA3XdOLVVIrwY6N_eDSRipTZ0WJV0",
    ],
  }),
});

export const AuthHeader = t.Object({
  authorization: t.String({
    description: "Bearer access token",
    examples: ["Bearer <access_token>"],
  }),
});

export const jwtPlugin = new Elysia({ name: "jwt-plugin" })
  .derive({ as: "scoped" }, () => ({
    jwt: jwtUtil,
  }))
  .macro("isAuth", {
    resolve: ({ headers, jwt }) => {
      const authHeader = headers.authorization;

      if (!authHeader) {
        throw new AuthenticationError("Authorization token is missing");
      }

      try {
        const token = jwt!.extractBearerToken(authHeader);
        const rawPayload = jwt!.verifyAccessToken(
          token,
        ) as AuthModel.signInResponse;

        return {
          user: rawPayload,
        };
      } catch (error) {
        throw error;
      }
    },
  });
