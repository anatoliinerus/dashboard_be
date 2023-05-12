
## Description

TO DO (Some text about repo)...

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Prisma (ORM)
```bash
# IDE for your database
$ npx prisma studio 

# run migrations (apply schema changes)
$ npx prisma migrate dev # --name YOUR_MIGRATION_NAME

# run migrations on CI/CD
$ npx prisma migrate deploy

# apply db schema changes to the prisma client
$ npx prisma generate

# generate schemas for multiple db connections
$ npx prisma generate --schema prisma/schema1.prisma && npx prisma generate --schema prisma/schema2.prisma

# production mode
$ npm run start:prod
```

## Swagger UI
```bash
# here is the Swagger UI where you can check API Doc
$ http://localhost:3000/api
```
