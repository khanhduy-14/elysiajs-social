import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import fs from "fs";
import path from "path";
import * as schema from "./schema/index";
import { DatabaseConnectionError } from "../utils/errors";
import { config } from "../config";

function getPassword(): string {
  const passwordFile = config.database.passwordFile;

  if (fs.existsSync(passwordFile)) {
    return fs.readFileSync(passwordFile, "utf-8").trim();
  }

  const localPasswordFile = path.resolve(
    process.cwd(),
    "config/db_password.txt",
  );
  if (fs.existsSync(localPasswordFile)) {
    return fs.readFileSync(localPasswordFile, "utf-8").trim();
  }

  throw new Error(
    `Database password not found. Checked:\n  - ${passwordFile}\n  - ${localPasswordFile}`,
  );
}

const password = getPassword();
const databaseUrl = `postgresql://${config.database.user}:${password}@${config.database.host}:${config.database.port}/${config.database.name}`;

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
