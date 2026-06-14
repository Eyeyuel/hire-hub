> caching using reddis resourecse:
> https://www.youtube.com/watch?v=KXnkhWRCj40&t=10s
> https://www.youtube.com/watch?v=SK4Qcoeiegc&t=372s

> modules/

Contains your business features.

modules/
├── auth/
├── users/
├── companies/
├── jobs/
├── applications/
└── notifications/

Each feature contains:

users/
├── dto/
├── entities/
├── users.controller.ts
├── users.service.ts
└── users.module.ts

> common/

Reusable code shared across the entire application.

common/
├── decorators/
├── guards/
├── filters/
├── interceptors/
├── pipes/
├── constants/
└── utils/

Examples:

decorators/
@CurrentUser()
@Public()
@Roles()

guards/
JwtAuthGuard
RolesGuard

filters/
GlobalExceptionFilter

interceptors/
ResponseInterceptor
LoggingInterceptor

pipes/
ParseUuidPipe

> config/

Application configuration files.

config/
├── app.config.ts
├── database.config.ts
├── redis.config.ts
└── jw

> config/

Application configuration files.

config/
├── app.config.ts
├── database.config.ts
├── redis.config.ts
└── jwt.config.ts

Example:

export default () => ({
port: process.env.PORT,
});

or

export default () => ({
host: process.env.POSTGRES_HOST,
port: process.env.POSTGRES_PORT,
});

This keeps env/config logic separate from business logic.

> database/

Everything related to the database itself.

database/
├── data-source.ts
├── migrations/
├── seeders/
└── factories/
data-source.ts

Used by TypeORM CLI:

pnpm migration:generate
pnpm migration:run
migrations/

Generated migration files:

17123456789-InitialSchema.ts
seeders/

Initial data:

admin user
sample companies
sample jobs
