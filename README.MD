# RPG STOREFRONT API

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [EndPoints](#endpoints)
5. [Authentication](#authentication)
6. [License](#license)

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
``` bash
git clone git@github.com:clasesVD/rpg-storefront-api.git
```

2. Install dependencies
``` bash
npm install
```

3. Create or modify `.env` file
``` bash
PORT=`PORT NUMBER` // Default is `3000`, but you can modify it to suit your needs.
DATABASE_URL=postgres://username:password@hostname:port/database_name // For more details, refer to the [documentation](https://www.postgresql.org/docs/current/libpq-connect.html)
```

4. Start the database with Docker
If you're using Docker for the database, run:

``` bash
docker-compose up -d
```

This will start the PostgreSQL container in the background.

5. Run database migrations (Drizzle ORM)
If this is your first time setting up the project, generate and apply migrations:

``` bash
npm run migrate:generate
npm run migrate:apply
```

Or if migrations already exist:

``` bash
npm run migrate:apply
```

6. Run the server!
``` bash
npm run dev
```

## Usage

Once the server is running, you can make requests to the API.

Example request to retrieve a list of users:

``` bash
curl -X GET http://localhost:3000/users
```

Or open this URL in your browser:

``` bash
http://localhost:3000/users
```

## EndPoints

GET /users
- Retrieves a list of users.

Response (200 OK):
``` bash
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
]
```

## Authentication

- Currently, the API does not require authentication. However, in the future, endpoints like `/users` will be secured with JWT authentication.

- JWT Authentication: Once implemented, you'll need to include and Authorization header with the token:

``` bash
curl -X GET https://localhost:3000/users -H "Authorization: Bearer <your_token>" // For more details, refer to the [documentation](https://jwt.io/introduction)
```

## License

- This project is licensed under the MIT License. See the `LICENSE` file for more details.
