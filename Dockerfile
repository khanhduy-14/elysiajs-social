FROM oven/bun:1.3.4

WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Create config directory\n\
mkdir -p config\n\
\n\
# Create config.json from environment variables\n\
cat > config/config.json << EOF\n\
{\n\
  "app": {\n\
    "nodeEnv": "${NODE_ENV:-production}",\n\
    "port": 3000,\n\
    "logLevel": "info"\n\
  },\n\
  "database": {\n\
    "url": "${DATABASE_URL}"\n\
  },\n\
  "authentication": {\n\
    "passwordSaltLength": ${PASSWORD_SALT_LENGTH:-10}\n\
  },\n\
  "secrets": {\n\
    "appSecret": "${APP_SECRET}",\n\
    "jwtAccessSecret": "${JWT_ACCESS_SECRET}",\n\
    "jwtRefreshSecret": "${JWT_REFRESH_SECRET}"\n\
  },\n\
  "rsa": {\n\
    "privateKeyPath": "config/rsa_private.pem",\n\
    "publicKeyPath": "config/rsa_public.pem"\n\
  }\n\
}\n\
EOF\n\
\n\
# Create RSA private key\n\
if [ -n "$RSA_PRIVATE_KEY" ]; then\n\
  cat > config/rsa_private.pem << EOF\n\
${RSA_PRIVATE_KEY}\n\
EOF\n\
fi\n\
\n\
# Create RSA public key\n\
if [ -n "$RSA_PUBLIC_KEY" ]; then\n\
  cat > config/rsa_public.pem << EOF\n\
${RSA_PUBLIC_KEY}\n\
EOF\n\
fi\n\
\n\
# Run migrations\n\
bun run db:migrate\n\
\n\
# Start the application\n\
exec "$@"' > entrypoint.sh && chmod +x entrypoint.sh

# Expose port
EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
CMD ["bun", "run", "src/index.ts"]
