import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";

function getDatabaseUrl() {
  if (config.database.url && config.database.url.trim() !== "") {
    return config.database.url;
  }

  const fs = require("fs");
  let password = "";

  if (config.database.passwordFile) {
    if (fs.existsSync(config.database.passwordFile)) {
      password = fs.readFileSync(config.database.passwordFile, "utf-8").trim();
    }
  }

  if (!password) {
    const localPasswordFile = require("path").resolve(
      process.cwd(),
      "config/db_password.txt",
    );
    if (fs.existsSync(localPasswordFile)) {
      password = fs.readFileSync(localPasswordFile, "utf-8").trim();
    }
  }

  return `postgresql://${config.database.user}:${password}@${config.database.host}:${config.database.port}/${config.database.name}`;
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
