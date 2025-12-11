import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: config.database.url
    ? { url: config.database.url }
    : {
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: (() => {
          if (config.database.passwordFile) {
            const fs = require("fs");
            return fs
              .readFileSync(config.database.passwordFile, "utf-8")
              .trim();
          }
          return "";
        })(),
        database: config.database.name,
      },
});
