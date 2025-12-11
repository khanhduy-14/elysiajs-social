import fs from "fs";
import path from "path";

interface AppConfig {
  app: {
    nodeEnv: string;
    port: number;
    logLevel: string;
  };
  database: {
    url?: string;
    host: string;
    port: number;
    name: string;
    user: string;
    passwordFile: string;
  };
  authentication: {
    passwordSaltLength: number;
  };
  secrets: {
    appSecret: string;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
  };
  rsa: {
    privateKeyPath: string;
    publicKeyPath: string;
  };
}

function loadConfig(): AppConfig {
  const configPath = path.resolve(process.cwd(), "config/config.json");

  if (!fs.existsSync(configPath)) {
    console.error(`Error: config/config.json not found at ${configPath}`);
    console.error("Copy from config.example/config.json.example");
    process.exit(1);
  }

  const rawConfig = fs.readFileSync(configPath, "utf-8");
  const config: AppConfig = JSON.parse(rawConfig);

  console.log(`Config loaded from: ${configPath}`);

  return config;
}

export const config = loadConfig();

export default config;
