# Bike Chrono

Bike Chrono is a web platform for managing cycling competitions and recording participant times at different points along a route. The repository contains a frontend application, a backend API, and a shared package of schemas and types.

## What it solves

The system covers the operational flow of a competition:

1. An administrator creates the competition and configures its dates, city, categories, and start intervals.
2. Competitors, teams, and participants are registered.
3. Operator users are assigned to timing points.
4. Operators record times from a specialized interface.
5. The system synchronizes timing-point status and current times through Socket.IO.
6. The dashboard displays results and manages the competition lifecycle.

## Main capabilities

- Manage competitions, categories, participants, and teams.
- Create, edit, and block competitors.
- Create operator users.
- Access roles: `admin` and `counter`.
- Protected administrative dashboard.
- Timing view for assigned operators.
- Time recording through the API and real-time synchronization.
- Results and same-day competition lookup.
- Shared frontend and backend validation through Zod.
- Relational persistence with PostgreSQL.

## Monorepo architecture

```text
bike-chrono/
├── apps/
│   ├── client/          # React SPA for administration and timing
│   └── server/          # NestJS API, authentication, Prisma, and WebSockets
├── packages/
│   └── schemas/         # Shared types, Zod schemas, and contracts
├── funcionalidad.md     # Reference functional specification
├── package.json         # Workspace scripts and configuration
├── pnpm-workspace.yaml  # Apps and packages definition
└── turbo.json           # Turborepo tasks and dependencies
```

### Client application

Built with React, TypeScript, and Vite. It manages navigation, sessions, forms, remote state, and the administrator and operator experience.

- Administrative dashboard: `/panel`.
- User, extra, and competition management for `admin`.
- Timing for `counter`: `/timer`.
- Authentication and authorization through React Router guards.
- React Query for API queries and mutations.
- Socket.IO Client for real-time communication.

Specific documentation: [apps/client/README.md](apps/client/README.md).

### Server application

Built with NestJS and TypeScript. It exposes the API under the `/api` prefix, centralizes business logic, persists data with Prisma, and coordinates real-time timing.

- REST API for competitions, competitors, users, categories, and teams.
- Better Auth for sessions, email/password authentication, and roles.
- PostgreSQL as the database.
- Prisma as the ORM and typed client.
- Socket.IO through the `competition-time` namespace.
- Uniform HTTP response and error contracts.

Specific documentation: [apps/server/README.md](apps/server/README.md).

### Shared package

`packages/schemas` is published inside the workspace as `@cronope/schemas`. It contains:

- Zod schemas for input validation.
- Domain types and API responses.
- Types related to competitions, participants, competitors, users, and timing.
- Constants and events shared by the client and server.

Example:

```ts
import { competitionSchema, type APIResponse } from "@cronope/schemas";
```

HTTP responses follow the `APIResponse<T>` contract:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "..."
}
```

The `data` property contains the typed result of each operation. Errors keep the same structure with `success: false` and `data: null`.

## Data flow

```mermaid
flowchart LR
    Admin[Administrator] --> Client[React Client]
    Counter[Timing Operator] --> Client
    Client -->|HTTP /api| Server[NestJS Server]
    Client <-->|Socket.IO competition-time| Server
    Server --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL)]
    Client -.-> Schemas[@cronope/schemas]
    Server -.-> Schemas
```

The client uses HTTP for CRUD operations and queries. The Socket.IO gateway synchronizes operational timing state between users connected to the same competition.

## Technology stack

| Layer               | Technologies                                  |
| ------------------- | --------------------------------------------- |
| Frontend            | React 19, TypeScript, Vite 8                  |
| Navigation          | React Router                                  |
| Remote data         | TanStack React Query, Axios                   |
| Forms               | React Hook Form, Zod                          |
| State and real time | Zustand, Socket.IO Client                     |
| UI                  | Tailwind CSS 4, Base UI, shadcn, Lucide React |
| Backend             | NestJS 11, TypeScript, Express                |
| Authentication      | Better Auth                                   |
| Persistence         | PostgreSQL, Prisma 7                          |
| Contracts           | Internal `@cronope/schemas` package           |
| Workspace           | pnpm 10, pnpm workspaces, Turborepo           |

## Requirements

- Node.js 20 or newer.
- pnpm 10 or newer.
- An accessible PostgreSQL instance for the backend.

## Installation

From the repository root:

```bash
pnpm install
```

Configure the server variables in `apps/server/.env`. At minimum, the backend needs a PostgreSQL connection URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bike_chrono"
```

Generate the Prisma client and apply migrations:

```bash
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma migrate dev
```

For the frontend to consume the local backend, configure `apps/client/.env`:

```env
VITE_SERVER=http://localhost:3000
```

## Development

To run the frontend and backend together from the root:

```bash
pnpm dev
```

Typical local services:

- Frontend: `http://localhost:5173`.
- Backend: `http://localhost:3000`.
- API: `http://localhost:3000/api`.
- Authentication: `http://localhost:3000/api/auth`.

They can also be run separately:

```bash
pnpm --filter client dev
pnpm --filter server dev
```

The Turborepo development process includes the shared `@cronope/schemas` package so its compiled types are available while the applications run.

## Main commands

```bash
# Install dependencies
pnpm install

# Run the complete environment
pnpm dev

# Build packages and applications
pnpm turbo build

# Check the client
pnpm --filter client lint
pnpm --filter client build

# Check the server
pnpm --filter server lint
pnpm --filter server build
pnpm --filter server test

# Build shared contracts
pnpm --filter @cronope/schemas build
```

## Product roles

| Role      | Main experience                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `admin`   | Manages users, competitors, categories, teams, and competitions. Configures participants, operators, and results. |
| `counter` | Accesses the assigned competition and records times from timing points.                                           |

Frontend routes and backend permissions use these same roles.

## Project status

The repository includes the main competition-management and time-recording flows. The public `live` routes are prepared in the client, but their screens are still evolving. Planned improvements include PDF report generation, public competitor registration, broader test coverage, and OpenAPI documentation.

## Related documentation

- [Frontend documentation](apps/client/README.md)
- [Backend documentation](apps/server/README.md)
- [Functional specification](funcionalidad.md)

## License

Private project with no public license declared.

# Bike Chrono

Bike Chrono es una plataforma web para administrar competencias de ciclismo y registrar los tiempos de sus participantes en distintos puntos de una ruta. El repositorio contiene una aplicación frontend, una API backend y un paquete compartido de esquemas y tipos.

## Qué resuelve

El sistema cubre el flujo operativo de una competencia:

1. Un administrador crea la competencia y configura sus fechas, ciudad, categorías e intervalos de salida.
2. Se registran competidores, equipos y participantes.
3. Se asignan usuarios operadores a los puntos de cronometraje.
4. Los operadores registran tiempos desde una interfaz especializada.
5. El sistema sincroniza el estado de los puntos y los tiempos actuales mediante Socket.IO.
6. El panel permite consultar resultados y administrar el ciclo de vida de la competencia.

## Capacidades principales

- Gestión de competencias, categorías, participantes y equipos.
- Alta, edición y bloqueo de competidores.
- Creación de usuarios operadores.
- Roles de acceso `admin` y `counter`.
- Panel administrativo con navegación protegida.
- Vista de cronometraje para operadores asignados.
- Registro de tiempos por API y sincronización en tiempo real.
- Resultados y consulta de la competencia del día.
- Validación compartida entre frontend y backend mediante Zod.
- Persistencia relacional en PostgreSQL.

## Arquitectura del monorepo

```text
bike-chrono/
├── apps/
│   ├── client/          # SPA React para administración y cronometraje
│   └── server/          # API NestJS, autenticación, Prisma y WebSockets
├── packages/
│   └── schemas/         # Tipos, esquemas Zod y contratos compartidos
├── funcionalidad.md     # Especificación funcional de referencia
├── package.json         # Scripts y configuración del workspace
├── pnpm-workspace.yaml  # Definición de apps y paquetes
└── turbo.json           # Tareas y dependencias de Turborepo
```

### Aplicación cliente

Construida con React, TypeScript y Vite. Gestiona navegación, sesión, formularios, estado remoto y la experiencia de los administradores y operadores.

- Panel administrativo: `/panel`.
- Gestión de usuarios, extras y competencias para `admin`.
- Cronometraje para `counter`: `/timer`.
- Autenticación y autorización mediante guards de React Router.
- React Query para consultas y mutaciones contra la API.
- Socket.IO Client para comunicación en tiempo real.

Documentación específica: [apps/client/README.md](apps/client/README.md).

### Aplicación servidor

Construida con NestJS y TypeScript. Expone la API bajo el prefijo `/api`, centraliza la lógica de negocio, persiste la información con Prisma y coordina el cronometraje en tiempo real.

- API REST para competencias, competidores, usuarios, categorías y equipos.
- Better Auth para sesiones, correo y contraseña y roles.
- PostgreSQL como base de datos.
- Prisma como ORM y cliente tipado.
- Socket.IO mediante el namespace `competition-time`.
- Respuestas HTTP y errores con contratos uniformes.

Documentación específica: [apps/server/README.md](apps/server/README.md).

### Paquete compartido

`packages/schemas` se publica dentro del workspace como `@cronope/schemas`. Contiene:

- Esquemas Zod para validar entradas.
- Tipos de dominio y respuestas de API.
- Tipos relacionados con competencias, participantes, competidores, usuarios y cronometraje.
- Constantes y eventos compartidos entre cliente y servidor.

Ejemplo:

```ts
import { competitionSchema, type APIResponse } from "@cronope/schemas";
```

Las respuestas HTTP siguen el contrato `APIResponse<T>`:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "..."
}
```

La propiedad `data` contiene el resultado tipado de cada operación. Los errores conservan la misma estructura con `success: false` y `data: null`.

## Flujo de datos

```mermaid
flowchart LR
    Admin[Administrador] --> Client[React Client]
    Counter[Operador de cronometraje] --> Client
    Client -->|HTTP /api| Server[NestJS Server]
    Client <-->|Socket.IO competition-time| Server
    Server --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL)]
    Client -.-> Schemas[@cronope/schemas]
    Server -.-> Schemas
```

El cliente utiliza HTTP para operaciones CRUD y consultas. El gateway Socket.IO se reserva para sincronizar el estado operativo del cronometraje entre usuarios conectados a una misma competencia.

## Stack tecnológico

| Capa                 | Tecnologías                                   |
| -------------------- | --------------------------------------------- |
| Frontend             | React 19, TypeScript, Vite 8                  |
| Navegación           | React Router                                  |
| Datos remotos        | TanStack React Query, Axios                   |
| Formularios          | React Hook Form, Zod                          |
| Estado y tiempo real | Zustand, Socket.IO Client                     |
| UI                   | Tailwind CSS 4, Base UI, shadcn, Lucide React |
| Backend              | NestJS 11, TypeScript, Express                |
| Autenticación        | Better Auth                                   |
| Persistencia         | PostgreSQL, Prisma 7                          |
| Contratos            | Paquete interno `@cronope/schemas`            |
| Workspace            | pnpm 10, pnpm workspaces, Turborepo           |

## Requisitos

- Node.js 20 o superior.
- pnpm 10 o superior.
- Una instancia de PostgreSQL accesible para el backend.

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install
```

Configura las variables del servidor en `apps/server/.env`. Como mínimo, el backend necesita una URL de conexión a PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/bike_chrono"
```

Genera el cliente Prisma y aplica las migraciones:

```bash
pnpm --filter server exec prisma generate
pnpm --filter server exec prisma migrate dev
```

Para que el frontend consuma el backend local, configura `apps/client/.env`:

```env
VITE_SERVER=http://localhost:3000
```

## Desarrollo

Para ejecutar frontend y backend juntos desde la raíz:

```bash
pnpm dev
```

Servicios locales habituales:

- Frontend: `http://localhost:5173`.
- Backend: `http://localhost:3000`.
- API: `http://localhost:3000/api`.
- Autenticación: `http://localhost:3000/api/auth`.

También se pueden ejecutar por separado:

```bash
pnpm --filter client dev
pnpm --filter server dev
```

El proceso de desarrollo de Turborepo incluye el paquete compartido `@cronope/schemas` para que sus tipos compilados estén disponibles mientras trabajan las aplicaciones.

## Comandos principales

```bash
# Instalar dependencias
pnpm install

# Ejecutar todo el entorno
pnpm dev

# Construir paquetes y aplicaciones
pnpm turbo build

# Revisar el cliente
pnpm --filter client lint
pnpm --filter client build

# Revisar el servidor
pnpm --filter server lint
pnpm --filter server build
pnpm --filter server test

# Construir los contratos compartidos
pnpm --filter @cronope/schemas build
```

## Roles del producto

| Rol       | Experiencia principal                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `admin`   | Administra usuarios, competidores, categorías, equipos y competencias. Configura participantes, operadores y resultados. |
| `counter` | Accede a la competencia asignada y registra tiempos desde los puntos de cronometraje.                                    |

Las rutas del frontend y los permisos configurados en el backend trabajan con estos mismos roles.

## Estado del proyecto

El repositorio cuenta con los flujos principales para la administración de competencias y el registro de tiempos. Las rutas públicas `live` están preparadas en el cliente, pero sus pantallas todavía se encuentran en evolución. También están identificadas como mejoras futuras la generación de reportes PDF, el registro público de competidores, una cobertura de pruebas más amplia y la documentación OpenAPI.

## Documentación relacionada

- [Documentación del frontend](apps/client/README.md)
- [Documentación del backend](apps/server/README.md)
- [Especificación funcional](funcionalidad.md)

## Licencia

Proyecto privado y sin licencia pública declarada.

# cronope
