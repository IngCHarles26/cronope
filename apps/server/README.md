# Bike Chrono Backend

Bike Chrono's backend is a platform for managing cycling competitions and recording participant times at different points along a route. This service centralizes business logic, persistence, authentication, and real-time communication with timing-point operators.

## Technical value

- Modular API built with NestJS and TypeScript.
- Relational persistence with PostgreSQL and Prisma ORM.
- Session-based authentication with Better Auth and Prisma integration.
- Separate roles and permissions for administrators and timing operators (`counter`).
- Real-time time recording through Socket.IO and WebSockets.
- Declarative payload validation with Zod schemas shared with the frontend.
- Consistent HTTP responses and errors for easier client integration.
- Architecture prepared to manage competitions, categories, participants, teams, operators, and results.

## Service responsibilities

The backend can:

- Create, view, edit, activate, and delete competitions.
- Configure competition categories, starting order, and participation day.
- Register competitors with personal, athletic, and emergency-contact data.
- Assign competitors and teams to competitions.
- Create categories and teams, and edit teams.
- Create operator users and assign them to competitions as timing points.
- Retrieve the competition of the day and competition results.
- Add times to participants.
- Coordinate multiple connected timing points.
- Report operator connection status and current times in real time.

## Technology stack

| Area           | Technology                                 |
| -------------- | ------------------------------------------ |
| Runtime        | Node.js                                    |
| Language       | TypeScript                                 |
| Framework      | NestJS 11                                  |
| HTTP API       | Express through `@nestjs/platform-express` |
| Real time      | Socket.IO through NestJS WebSockets        |
| Database       | PostgreSQL 14+                             |
| ORM            | Prisma 7                                   |
| Authentication | Better Auth + Prisma adapter               |
| Validation     | Zod 4 and `ZodValidationPipe`              |
| Testing        | Jest, Supertest, and `@nestjs/testing`     |
| Monorepo       | pnpm workspaces + Turborepo                |

## Architecture

The server is organized into domain modules:

```text
apps/server/
├── common/                 # Global HTTP pipe, interceptor, and filter
├── prisma/                 # Prisma schema and migrations
├── src/
│   ├── competition/        # Competitions, categories, participants, and results
│   ├── competitor/         # Competitor creation and editing
│   ├── time/               # Real-time timing gateway
│   ├── users/              # Operator user creation
│   ├── others/             # Categories, teams, and seed data
│   ├── lib/auth.ts         # Better Auth configuration
│   └── prisma.service.ts   # Shared Prisma client
```

The application starts with the global `/api` prefix. Successful HTTP responses use this shape:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "..."
}
```

Errors follow the same contract with `success: false`, an HTTP status code, `data: null`, and a client-readable message.

## HTTP API

All routes in this section are served under `/api`.

### Competitions

| Method   | Route                                              | Purpose                              |
| -------- | -------------------------------------------------- | ------------------------------------ |
| `POST`   | `/competition`                                     | Create a competition                 |
| `GET`    | `/competition`                                     | List competitions                    |
| `GET`    | `/competition/:id`                                 | Get a competition                    |
| `GET`    | `/competition/today`                               | Get the competition of the day       |
| `GET`    | `/competition/results/:id`                         | Get results                          |
| `PATCH`  | `/competition/:id`                                 | Edit competition data                |
| `PATCH`  | `/competition/toggle/:id`                          | Activate or deactivate a competition |
| `PATCH`  | `/competition/update-categories/:id`               | Update categories                    |
| `PATCH`  | `/competition/update-participants/:id`             | Update participants                  |
| `PATCH`  | `/competition/update-counters/:id`                 | Assign or update operators           |
| `PATCH`  | `/competition/add-participant-time/:participantId` | Save a participant time              |
| `DELETE` | `/competition/:id`                                 | Delete a competition                 |

### Competitors

| Method  | Route                        | Purpose                       |
| ------- | ---------------------------- | ----------------------------- |
| `POST`  | `/competitor`                | Create a competitor           |
| `GET`   | `/competitor`                | List competitors              |
| `PATCH` | `/competitor/:id`            | Edit a competitor             |
| `PATCH` | `/competitor/toggle-ban/:id` | Block or unblock a competitor |

The competitor model includes name, surname, document, birth date, sex, country, phone, license, blood type, email, allergies, emergency contact, and blocked status.

### Users, categories, and teams

| Method  | Route                | Purpose                   |
| ------- | -------------------- | ------------------------- |
| `POST`  | `/users/new-user`    | Create an operator user   |
| `POST`  | `/others/categories` | Create categories         |
| `GET`   | `/others/categories` | List categories           |
| `POST`  | `/others/teams`      | Create teams              |
| `GET`   | `/others/teams`      | List teams                |
| `PATCH` | `/others/team/:id`   | Edit a team               |
| `GET`   | `/others/seed`       | Run development seed data |

Better Auth is integrated through `AuthModule`; its session and access routes are under the `/api` prefix according to the Better Auth configuration.

## Real-time timing

The Socket.IO gateway uses the `competition-time` namespace.

To connect, the client must send the following handshake data:

```ts
io("http://localhost:3000/competition-time", {
  auth: {
    token: "SESSION_TOKEN",
    competitionId: "COMPETITION_ID",
  },
});
```

The connection is accepted only when:

1. The token belongs to an existing session.
2. The user is assigned as an operator for that competition.

Once connected, the gateway:

- Identifies the timing-point order and alias.
- Publishes operator connection status.
- Synchronizes participants that have already been processed.
- Shares a participant's current times among connected points.
- Allows the current time to be reset or cleared before persistence.

Gateway event names are shared from `@cronope/schemas`, avoiding duplicated contracts between frontend and backend.

## Authentication and authorization

Better Auth is configured with:

- Email and password sign-in.
- Sessions persisted in PostgreSQL.
- Bearer token support.
- Administration and access-control plugin.
- Session-cookie cache configured for six minutes.

The domain roles are:

| Role      | Main capabilities                                                    |
| --------- | -------------------------------------------------------------------- |
| `admin`   | Manage users, categories, competitors, and the competition lifecycle |
| `counter` | View categories, competitors, and competitions, and record times     |

The WebSocket connection also checks that the operator is assigned to the requested competition. Authentication routes and final deployment restrictions should be reviewed with the environment configuration before publishing the service.

## Data model

The Prisma schema includes these main entities:

- `User`, `Session`, `Account`, and `Verification`: Better Auth identity and sessions.
- `Competition`: name, city, dates, status, start intervals, and start time.
- `Category`: category catalog.
- `CategoriesInCompetition`: competition-category relation with day, order, and description.
- `Competitor`: cyclist personal and athletic information.
- `Participant`: competitor registration in a competition, category, team, bib, order, and finish status.
- `Team`: teams associated with participants.
- `Counter`: operator assignments to competitions, including point alias and order.

The schema includes relations, unique keys, and indexes to prevent duplicates in documents, phones, emails, registrations, and operator assignments.

## Validation and shared contracts

Competition, competitor, user, category, and team payloads are validated with Zod schemas imported from the internal `@cronope/schemas` package. This lets `apps/server` and `apps/client` share types and rules.

The application uses:

- `ZodValidationPipe` to reject invalid input with readable field errors.
- `TransformInterceptor` to normalize successful responses.
- `AllExceptionsFilter` to normalize HTTP exceptions and unexpected errors.
- `ConfigModule` to load variables from `.env`.
- CORS configured for local monorepo clients.

## Requirements

- Node.js 20 or newer.
- pnpm 10 or newer.
- PostgreSQL 14 or newer.
- Environment variables configured in `apps/server/.env`.

Minimum expected variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bike_chrono"
```

Better Auth may also require secret and trusted-URL variables defined by the runtime environment. Real secrets must not be committed to the repository.

## Local installation and execution

From the monorepo root:

```bash
pnpm install
```

After configuring `apps/server/.env`, generate the client and apply migrations:

```bash
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma migrate dev
```

Available commands in `apps/server`:

```bash
# Development
pnpm --filter server dev

# Build
pnpm --filter server build

# Production
pnpm --filter server start:prod

# Unit tests
pnpm --filter server test

# Coverage
pnpm --filter server test:cov

# End-to-end tests
pnpm --filter server test:e2e

# Lint
pnpm --filter server lint
```

The server listens on port `3000` by default. This can be changed with `PORT`.

## Quality and maintainability

- Strict TypeScript and NestJS modules separated by responsibility.
- Services decoupled from controllers to centralize business logic.
- Reusable schemas and types in a shared monorepo package.
- Prisma as a typed data-access layer.
- Jest and Supertest available for unit and end-to-end tests.
- ESLint and Prettier integrated into service scripts.
- Real-time communication isolated in a dedicated timing-domain gateway.

## Current status and future improvements

The backend has the functional foundation for managing competitions, participants, and timing points. Identified areas of evolution include:

- Generate start-list and summary reports in PDF.
- Allow public competitor registration.
- Complete the results flow with multiple times per participant.
- Add support for payments and multiple nationalities.
- Expand test coverage and OpenAPI documentation.

These features are planned evolution and are not currently available in production.

# Bike Chrono Backend

Backend de Bike Chrono, una plataforma para administrar competencias de ciclismo y registrar tiempos de participantes en distintos puntos de una ruta. Este servicio concentra la lógica de negocio, la persistencia, la autenticación y la comunicación en tiempo real con los usuarios que operan los puntos de cronometraje.

## Valor técnico

- API modular construida con NestJS y TypeScript.
- Persistencia relacional con PostgreSQL y Prisma ORM.
- Autenticación basada en sesiones con Better Auth, adaptada a Prisma.
- Roles y permisos diferenciados para administradores y operadores de cronometraje (`counter`).
- Registro de tiempos en tiempo real mediante Socket.IO y WebSockets.
- Validación declarativa de payloads con esquemas Zod compartidos con el frontend.
- Respuestas HTTP y errores con una estructura consistente para facilitar la integración del cliente.
- Arquitectura preparada para gestionar competencias, categorías, participantes, equipos, operadores y resultados.

## Responsabilidad del servicio

El backend permite:

- Crear, consultar, editar, activar y eliminar competencias.
- Configurar las categorías de una competencia, su orden de salida y el día de participación.
- Registrar competidores con sus datos personales, deportivos y de contacto de emergencia.
- Asignar competidores y equipos a una competencia.
- Crear categorías y equipos, y editar equipos.
- Crear usuarios operadores y asociarlos a competencias como puntos de cronometraje.
- Consultar la competencia del día y los resultados de una competencia.
- Agregar tiempos a los participantes.
- Coordinar varios puntos de registro conectados simultáneamente.
- Informar en tiempo real el estado de conexión de los operadores y los tiempos que se están tomando.

## Stack tecnológico

| Área          | Tecnología                                  |
| ------------- | ------------------------------------------- |
| Runtime       | Node.js                                     |
| Lenguaje      | TypeScript                                  |
| Framework     | NestJS 11                                   |
| API HTTP      | Express mediante `@nestjs/platform-express` |
| Tiempo real   | Socket.IO mediante NestJS WebSockets        |
| Base de datos | PostgreSQL 14+                              |
| ORM           | Prisma 7                                    |
| Autenticación | Better Auth + adaptador Prisma              |
| Validación    | Zod 4 y `ZodValidationPipe`                 |
| Testing       | Jest, Supertest y `@nestjs/testing`         |
| Monorepo      | pnpm workspaces + Turborepo                 |

## Arquitectura

El servidor está organizado por módulos de dominio:

```text
apps/server/
├── common/                 # Pipe, interceptor y filtro HTTP globales
├── prisma/                 # Esquema y migraciones de Prisma
├── src/
│   ├── competition/        # Competencias, categorías, participantes y resultados
│   ├── competitor/         # Alta y edición de competidores
│   ├── time/               # Gateway de cronometraje en tiempo real
│   ├── users/              # Creación de usuarios operadores
│   ├── others/             # Categorías, equipos y seed
│   ├── lib/auth.ts         # Configuración de Better Auth
│   └── prisma.service.ts   # Cliente Prisma compartido
└── prisma.config.ts        # Configuración de Prisma
```

La aplicación se inicia con el prefijo global `/api`. Las respuestas HTTP exitosas se normalizan con la siguiente forma:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "..."
}
```

Los errores siguen el mismo contrato con `success: false`, código HTTP, `data: null` y un mensaje utilizable por el cliente.

## API HTTP

Todas las rutas HTTP de este apartado se sirven bajo `/api`.

### Competencias

| Método   | Ruta                                               | Propósito                            |
| -------- | -------------------------------------------------- | ------------------------------------ |
| `POST`   | `/competition`                                     | Crear una competencia                |
| `GET`    | `/competition`                                     | Listar competencias                  |
| `GET`    | `/competition/:id`                                 | Consultar una competencia            |
| `GET`    | `/competition/today`                               | Obtener la competencia del día       |
| `GET`    | `/competition/results/:id`                         | Consultar resultados                 |
| `PATCH`  | `/competition/:id`                                 | Editar datos de una competencia      |
| `PATCH`  | `/competition/toggle/:id`                          | Activar o desactivar una competencia |
| `PATCH`  | `/competition/update-categories/:id`               | Actualizar categorías                |
| `PATCH`  | `/competition/update-participants/:id`             | Actualizar participantes             |
| `PATCH`  | `/competition/update-counters/:id`                 | Asignar o actualizar operadores      |
| `PATCH`  | `/competition/add-participant-time/:participantId` | Guardar un tiempo de participante    |
| `DELETE` | `/competition/:id`                                 | Eliminar una competencia             |

### Competidores

| Método  | Ruta                         | Propósito                                       |
| ------- | ---------------------------- | ----------------------------------------------- |
| `POST`  | `/competitor`                | Crear un competidor                             |
| `GET`   | `/competitor`                | Listar competidores                             |
| `PATCH` | `/competitor/:id`            | Editar un competidor                            |
| `PATCH` | `/competitor/toggle-ban/:id` | Marcar o desmarcar un competidor como bloqueado |

El modelo de competidor contempla nombre, apellido, documento, fecha de nacimiento, sexo, país, teléfono, carnet, grupo sanguíneo, correo, alergias, contacto de emergencia y estado de bloqueo.

### Usuarios, categorías y equipos

| Método  | Ruta                 | Propósito                              |
| ------- | -------------------- | -------------------------------------- |
| `POST`  | `/users/new-user`    | Crear un usuario operador              |
| `POST`  | `/others/categories` | Crear categorías                       |
| `GET`   | `/others/categories` | Listar categorías                      |
| `POST`  | `/others/teams`      | Crear equipos                          |
| `GET`   | `/others/teams`      | Listar equipos                         |
| `PATCH` | `/others/team/:id`   | Editar un equipo                       |
| `GET`   | `/others/seed`       | Ejecutar datos iniciales de desarrollo |

La autenticación de Better Auth se integra en la aplicación mediante `AuthModule`; sus rutas de sesión y acceso se encuentran bajo el prefijo `/api` de acuerdo con la configuración de Better Auth.

## Cronometraje en tiempo real

El gateway Socket.IO usa el namespace `competition-time`.

Para conectarse, el cliente debe enviar en el handshake:

```ts
io("http://localhost:3000/competition-time", {
  auth: {
    token: "SESSION_TOKEN",
    competitionId: "COMPETITION_ID",
  },
});
```

La conexión se acepta únicamente cuando:

1. El token corresponde a una sesión existente.
2. El usuario está asignado como operador de esa competencia.

Una vez conectado, el gateway:

- Identifica el orden y alias del punto de cronometraje.
- Publica el estado de conexión de los operadores.
- Sincroniza los participantes que ya fueron procesados.
- Comparte los tiempos actuales de un participante entre los puntos conectados.
- Permite reiniciar o limpiar el tiempo actual antes de persistirlo.

Los nombres de eventos del gateway se comparten desde `@cronope/schemas`, evitando duplicar contratos entre frontend y backend.

## Autenticación y autorización

Better Auth está configurado con:

- Inicio de sesión mediante correo y contraseña.
- Sesiones persistidas en PostgreSQL.
- Soporte de token Bearer.
- Plugin de administración y control de acceso.
- Caché de cookies de sesión con una duración configurada de seis minutos.

Los roles definidos por el dominio son:

| Rol       | Capacidades principales                                                             |
| --------- | ----------------------------------------------------------------------------------- |
| `admin`   | Gestionar usuarios, categorías, competidores y el ciclo de vida de las competencias |
| `counter` | Consultar categorías, competidores y competencias, y registrar tiempos              |

Además, la conexión WebSocket comprueba que el operador esté asignado a la competencia solicitada. Las rutas de autenticación y las restricciones definitivas de despliegue deben revisarse junto con la configuración del entorno antes de publicar el servicio.

## Modelo de datos

El esquema Prisma incluye las siguientes entidades principales:

- `User`, `Session`, `Account` y `Verification`: identidad y sesiones de Better Auth.
- `Competition`: nombre, ciudad, fechas, estado, intervalos de salida y hora de inicio.
- `Category`: catálogo de categorías.
- `CategoriesInCompetition`: relación entre competencia y categoría, con día, orden y descripción.
- `Competitor`: información personal y deportiva del ciclista.
- `Participant`: inscripción de un competidor en una competencia, categoría, equipo, dorsal, orden y estado de llegada.
- `Team`: equipos asociados a participantes.
- `Counter`: asignación de usuarios operadores a competencias, incluyendo alias y orden del punto.

El esquema incorpora relaciones, claves únicas e índices para evitar duplicados en documentos, teléfonos, correos, inscripciones y asignaciones de operadores.

## Validación y contratos compartidos

Los payloads de competencias, competidores, usuarios, categorías y equipos se validan con esquemas Zod importados desde el paquete interno `@cronope/schemas`. Esto permite compartir tipos y reglas entre `apps/server` y `apps/client`.

La aplicación utiliza:

- `ZodValidationPipe` para rechazar entradas inválidas con errores de campos legibles.
- `TransformInterceptor` para unificar respuestas exitosas.
- `AllExceptionsFilter` para unificar excepciones HTTP y errores inesperados.
- `ConfigModule` para cargar variables desde `.env`.
- CORS configurado para los clientes locales del monorepo.

## Requisitos

- Node.js 20 o superior.
- pnpm 10 o superior.
- PostgreSQL 14 o superior.
- Variables de entorno configuradas en `apps/server/.env`.

Variables mínimas esperadas:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/bike_chrono"
```

Better Auth también puede requerir las variables de secreto y URL de confianza definidas por el entorno de ejecución. No se deben subir secretos reales al repositorio.

## Instalación y ejecución local

Desde la raíz del monorepo:

```bash
pnpm install
```

Después de configurar `apps/server/.env`, generar el cliente y aplicar las migraciones:

```bash
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma migrate dev
```

Comandos disponibles en `apps/server`:

```bash
# Desarrollo
pnpm --filter server dev

# Compilación
pnpm --filter server build

# Producción
pnpm --filter server start:prod

# Tests unitarios
pnpm --filter server test

# Cobertura
pnpm --filter server test:cov

# Tests end-to-end
pnpm --filter server test:e2e

# Lint
pnpm --filter server lint
```

Por defecto, el servidor escucha en el puerto `3000`. Puede modificarse con `PORT`.

## Calidad y mantenibilidad

- TypeScript estricto y módulos de NestJS separados por responsabilidad.
- Servicios desacoplados de los controladores para concentrar la lógica de negocio.
- Esquemas y tipos reutilizables en un paquete compartido del monorepo.
- Prisma como capa tipada de acceso a datos.
- Jest y Supertest disponibles para pruebas unitarias y end-to-end.
- ESLint y Prettier integrados en los scripts del servicio.
- Comunicación en tiempo real aislada en un gateway específico para el dominio de cronometraje.

## Estado actual y siguientes mejoras

El backend ya cuenta con la base funcional para administrar competencias, participantes y puntos de registro de tiempos. Entre las líneas de evolución identificadas en el proyecto están:

- Generar reportes de salidas y resúmenes en PDF.
- Permitir registro público de competidores.
- Completar el flujo de resultados con múltiples tiempos por participante.
- Añadir soporte para pagos y múltiples nacionalidades.
- Reforzar la cobertura de pruebas y la documentación OpenAPI.

Estas funcionalidades se presentan como evolución prevista y no como capacidades ya disponibles en producción.
