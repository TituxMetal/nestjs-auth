# NestJs Complete Authentication

Implementation of a complete authentication system with access token and refresh token, using
[NestJS framework] with Typescript, [Prisma orm] with [PostgreSQL] in [Docker container].

This project was made from the awesome tutorials from Vladimir Agaev on its [youtube channel]

## Usage

Before running the project you need to install the dependencies by running `yarn install` command.
Then, you must create a **_.env_** file in the project root and add the needed environment variables
(see **_.env.example_** file)

Make sure that you have a Postgres database up and running and change the **_DATABSE_URL_**
environment variable in the **_.env_** file in the root of the project.

Alternatively, you can run the database in a Docker container with this command:

```bash
docker compose up -d
```

OR

```bash
yarn docker:up -d
```

For local development just run the `yarn dev` command, this will start the project in dev mode and
deploy the prisma migrations.

[youtube channel]: https://www.youtube.com/watch?v=uAKzFhE3rxU 'Code With Vlad Youtube Channel'
[nestjs framework]: https://nestjs.com/ 'NestJS: A progressive Node.js framework'
[prisma orm]: https://prisma.io 'Prisma: A next-generation ORM'

[PostgreSQL]: https://www.postgresql.org/ 'PostgreSQL: The world\'s most advanced open source
database'

[docker container]:
  https://docker.com
  'Docker: Accelerate how you build, share, and run modern applications.'
