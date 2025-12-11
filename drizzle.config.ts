import type { Config } from "drizzle-kit";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const configPath = path.resolve(process.cwd(), "config/config.json");
  const passwordFilePath = path.resolve(
    process.cwd(),
    "config/db_password.txt",
  );

  if (fs.existsSync(configPath) && fs.existsSync(passwordFilePath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const password = fs.readFileSync(passwordFilePath, "utf-8").trim();

    return `postgresql://${config.database.user}:${password}@${config.database.host}:${config.database.port}/${config.database.name}`;
  }

  return `postgresql://admin@localhost:5432/social-db`;
}

const databaseUrl = getDatabaseUrl();

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
