# RPG STOREFRONT API

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Docs](#docs)
5. [License](#license)

## Description

Description
RPG STOREFRONT API is a Fastify-based API designed to manage RPG storefront operations.

Key Technologies:

- Fastify (Lightweight and high-performance backend framework)
- Drizzle ORM (Modern database ORM)
- PostgreSQL (Relational database)

## Installation

To get started with the API, follow these steps:

1. Clone the repository
```bash
git clone git@github.com:clasesVD/rpg-storefront-api.git
```

2. Install dependencies
```bash
npm install
```

3. Create or modify `.env` file
```env
PORT=3000
DATABASE_URL=postgres://<username>:<password>@<hostname>:<port>/<database_name>
LOG_LEVEL=debug # Level for the Fastify (Pino) logger. Common values: trace, debug, info, warn, error, fatal.
NODE_ENV=development # The current environment (development, production, test)
HOST=http://localhost # The base URL where Swagger is hosted.
```
- For more details on `DATABASE_URL`, refer to the [documentation](https://www.postgresql.org/docs/current/libpq-connect.html)

4. Start the database with Docker
If you're using Docker for the database, run:

```bash
docker compose up
```

This will start the PostgreSQL container in the background.

5. Run database migrations (Drizzle ORM)
```bash
npx drizzle-kit migrate
```

6. Run the server!
```bash
npm run dev
```

## Usage

Once the server is running, you can make requests to the API with any HTTP client like Postman or curl:

```bash
curl -X GET http://localhost:3000/health
```

## Docs

- You can check the [swagger docs](http://localhost:3000/docs) to see the available endpoints.

## License

- This project is licensed under the MIT License. See the `LICENSE` file for more details.
