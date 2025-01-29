# RPG STOREFRONT API

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Usage](#usage)
4. [EndPoints](#endpoints)
5. [Authentication](#authentication)
6. [License](#license)

## Description

RPG STOREFRONT API is an API that allows you idk because idk what it does honestly.

- Fastify

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

4. Run the server!
``` bash
npm run dev
```

## Usage

You can now make request to the API. Here is an example of how to get a list of users:

``` bash
"https://localhost:3000/users"
```

Example request using `curl`:

``` bash
curl -X GET https://localhost:3000/users
```

## EndPoints

GET /users
- Retrieves a list of users.

Response (200):
``` bash
[
  {
    "id": undefined,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  ...
]
```

## Authentication

- Currently, the API does not require authentication. However, in the future, endpoints like `/users` will be secured with JWT authentication.

- JWT Authentication: Once implemented, you'll need to include and Authorization header with the token:

``` bash
curl -X GET https://localhost:3000/users -H "Authorization: Bearer <your_token>"
```

## License

- This project is licensed under the MIT License. See the `LICENSE` file for more details.
