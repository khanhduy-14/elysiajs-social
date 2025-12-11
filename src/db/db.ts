import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import fs from "fs";
import path from "path";
import * as schema from "./schema/index";
import { DatabaseConnectionError } from "../utils/errors";
import { config } from "../config";

function getPassword(): string {
  if (config.database.url && config.database.url.trim() !== "") {
    return "";
  }

  if (config.database.passwordFile) {
    if (fs.existsSync(config.database.passwordFile)) {
      return fs.readFileSync(config.database.passwordFile, "utf-8").trim();
    }
  }

  const localPasswordFile = path.resolve(
    process.cwd(),
    "config/db_password.txt",
  );
  if (fs.existsSync(localPasswordFile)) {
    return fs.readFileSync(localPasswordFile, "utf-8").trim();
  }

  throw new Error(
    `Database password not found. Checked:\n  - ${config.database.passwordFile}\n  - ${localPasswordFile}`,
  );
}

const databaseUrl =
  config.database.url && config.database.url.trim() !== ""
    ? config.database.url
    : `postgresql://${config.database.user}:${getPassword()}@${config.database.host}:${config.database.port}/${config.database.name}`;

const pool = new Pool({ connectionString: databaseUrl });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  throw new DatabaseConnectionError("Database pool connection failed", err);
});

pool.connect((err, client, release) => {
  if (err) {
    throw new DatabaseConnectionError("Failed to connect to database", err);
  }
  if (client) {
    release();
  }
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
