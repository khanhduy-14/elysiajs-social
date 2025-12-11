#  Social With ElysiaJS

A modern, production-ready social platform built with **Elysia**, **Bun**, and **PostgreSQL**. — created primarily for learning, testing, and experimenting

## 🚀 Features

- **Fast Runtime**: Built with [Bun](https://bun.sh) for superior performance
- **Modern Framework**: [Elysia](https://elysiajs.com) - a lightweight, type-safe web framework
- **Type Safety**: Full TypeScript support with strict type checking
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team) for type-safe database queries
- **Authentication**: JWT-based authentication with secure password hashing
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **CORS Support**: Built-in CORS middleware for cross-origin requests
- **Logging**: Structured logging with Pino
- **Docker**: Complete Docker setup for easy deployment and development
- **Error Handling**: Comprehensive error handling with custom error classes

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Management](#database-management)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (v1.3.4) - [Installation guide](https://bun.sh/docs/installation)
- **Docker & Docker Compose** - [Installation guide](https://docs.docker.com/get-docker/)
- **Node.js** (v20) - Optional, for package management compatibility

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd elysia-social-apis-example
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Copy the entire configuration template folder:

cp -r config.example config


Then update the secrets in the files under config/ with your own values for production use.


## Running the Application

### Development Mode (With Docker)

The easiest way to run the full stack:

```bash
npm run start:dev
```

The server will start at `http://localhost:3000`

### Production Build

```bash
bun run build
```

## API Documentation

Once the application is running, access the interactive API documentation:

- **OpenAPI JSON**: [http://localhost:3000/api/json](http://localhost:3000/openapi)

All endpoints are automatically documented with request/response schemas.

## Project Structure

```
elysia-social-apis-example/
├── src/
│   ├── config/              # Configuration management
│   │   ├── index.ts         # Config loader
│   │   └── routes.ts        # Route definitions
│   ├── db/
│   │   ├── db.ts            # Database connection and setup
│   │   └── schema/          # Drizzle ORM schemas
│   │       └── user.ts      # User table schema
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication (login, register, refresh)
│   │   └── user/            # User management (CRUD operations)
│   ├── plugins/             # Elysia plugins
│   │   ├── loggingPlugin.ts # Request/response logging
│   │   └── appErrorPlugin.ts # Global error handling
│   ├── utils/               # Utility functions and error classes
│   └── index.ts             # Application entry point
├── config/
│   ├── config.json          # Application configuration
│   ├── db_password.txt      # Database password (secret)
│   └── rsa-*                # RSA keys for JWT signing
├── docker-compose.yml       # Docker service definitions
├── Dockerfile               # Application container image
├── package.json             # Project dependencies
└── README.md                # This file
```

## Database Management

### Initialize Database Schema

Generate database migrations from the schema:

```bash
bun run db:generate -- <migration-name>
```

Example:
```bash
bun run db:generate -- add_users_table
```

### Run Migrations

Apply pending migrations to your database:

```bash
bun run db:migrate
```

## Available Scripts

```bash
npm run start:dev    # Start full stack with Docker
bun run dev         # Start only the application (requires local DB)
bun run db:generate # Generate database migrations
bun run db:migrate  # Run pending migrations
npm run test        # Run tests (not yet implemented)
```

## Key Technologies

| Technology | Purpose |
|-----------|---------|
| [Elysia](https://elysiajs.com) | Web framework |
| [Bun](https://bun.sh) | JavaScript runtime |
| [PostgreSQL](https://www.postgresql.org) | Database |
| [Drizzle ORM](https://orm.drizzle.team) | Database toolkit |
| [JWT](https://jwt.io) | Authentication |
| [Bcrypt](https://www.npmjs.com/package/bcryptjs) | Password hashing |
| [Pino](https://getpino.io) | Structured logging |
| [Docker](https://www.docker.com) | Containerization |


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and general help
- **Documentation**: Check the [Elysia docs](https://elysiajs.com) and [Bun docs](https://bun.sh/docs)

---

**Happy coding!** 🚀
