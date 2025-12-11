import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { authController } from "./modules/auth/controller";
import { loggingPlugin } from "./plugins/loggingPlugin";
import { appErrorPlugin } from "./plugins/appErrorPlugin";
import cors from "@elysiajs/cors";
import { userController } from "./modules/user/controller";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "Social API Docs Spec",
          version: "1.0.0",
        },
      },
    }),
  )
  .use(cors({ origin: "http://localhost:3000", credentials: true }))
  .use(loggingPlugin)
  .use(appErrorPlugin)

  .use(authController)
  .use(userController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
