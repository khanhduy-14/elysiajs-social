import { Elysia, t } from "elysia";
import { API_ROUTE } from "../../config/routes";
import { UserModel } from "./model";
import { UserService } from "./service";
import { AuthHeader, jwtPlugin } from "../auth/plugins/jwtPlugin";
import { loggingPlugin } from "../../plugins/loggingPlugin";
import {
  ResponseBuilder,
  createSuccessResponseSchema,
} from "../../utils/response/builder";
import { ErrorSchemas } from "../../plugins/appErrorPlugin";

export const userController = new Elysia({
  prefix: API_ROUTE.USER._,
})
  .use(loggingPlugin)
  .use(jwtPlugin)
  .get(
    API_ROUTE.USER.ME,
    async ({ user, requestId }) => {
      const dbUser = await UserService.getById(user.id);
      return ResponseBuilder.success(
        { ...dbUser, id: dbUser.publicId },
        requestId,
      );
    },
    {
      response: {
        200: createSuccessResponseSchema(UserModel.meResponse),
        401: ErrorSchemas.AuthenticationError,
        404: ErrorSchemas.NotFoundError,
      },
      headers: AuthHeader,
      isAuth: true,
    },
  );
