# Bike Chrono Frontend

Bike Chrono's web application. This client lets administrators configure competitions and operators record participant times during a cycling race. It consumes the server API over HTTP and uses Socket.IO to synchronize timing in real time.

## Technical value

- Single-page application built with React 19, TypeScript, and Vite.
- Declarative navigation with React Router.
- Session- and role-based route protection (`admin` and `counter`).
- Remote data management with TanStack React Query.
- Typed Axios HTTP client with shared contracts from `@cronope/schemas`.
- Forms with React Hook Form and Zod validation.
- Local state and real-time connection state with Zustand.
- Browser-based Better Auth integration.
- Multi-operator timing with `socket.io-client`.
- Visual system based on Tailwind CSS 4, reusable components, and `lucide-react`.

## Client responsibilities

The frontend provides interfaces to:

- Sign in and sign out.
- Check the current session and redirect users according to authentication state.
- Display a protected administrative dashboard.
- Create operator users.
- Create, edit, and block competitors.
- Create categories and teams, and edit teams.
- Create and manage competitions.
- Activate or deactivate competitions.
- Configure competition categories, participants, starting order, and operators.
- View competition results.
- Retrieve the competition assigned for the day.
- Record times from the operator view.
- Display timing-point connection status and synchronize current participant times.

## Technology stack

| Area                  | Technology                             |
| --------------------- | -------------------------------------- |
| UI                    | React 19                               |
| Language              | TypeScript                             |
| Build and development | Vite 8                                 |
| Routing               | React Router 8                         |
| Remote data           | TanStack React Query 5                 |
| HTTP client           | Axios                                  |
| Authentication        | Better Auth React                      |
| Forms                 | React Hook Form + Zod                  |
| State                 | Zustand 5                              |
| Real time             | Socket.IO Client 4                     |
| Styling               | Tailwind CSS 4 + `tw-animate-css`      |
| Components            | Base UI, shadcn, and custom components |
| Icons                 | Lucide React                           |
| Shared types          | Internal `@cronope/schemas` package    |

## Architecture

```text
apps/client/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── competitions/      # Competition management, editing, and results
│   │   ├── extras/            # Categories, teams, and competitors
│   │   ├── login/             # Login, sessions, and route guards
│   │   ├── timer/             # Timing and Socket.IO communication
│   │   ├── users/             # Operator users
│   │   ├── sidebar/           # Dashboard navigation
│   │   ├── pages/             # Main pages and 404
│   │   ├── ui/                # Reusable interface primitives
│   │   └── app/               # Loading, toasts, inputs, and common actions
│   ├── layouts/               # Administrative dashboard layout
│   ├── lib/
│   │   ├── api.ts             # Axios client and API routes
│   │   ├── auth-client.ts     # Better Auth client
│   │   └── store/             # Navigation and Socket.IO stores
│   ├── App.tsx                # Route tree and guards
│   ├── main.tsx               # Global providers and React mount
│   └── index.css              # Visual tokens and Tailwind styles
└── vite.config.ts
```

## Application flows and routes

| Route                  | Access           | Functionality                        |
| ---------------------- | ---------------- | ------------------------------------ |
| `/`                    | Public           | Home page                            |
| `/login`               | Public           | Sign in                              |
| `/panel`               | Session required | Administrative dashboard             |
| `/panel/users`         | `admin` only     | User creation                        |
| `/panel/extras`        | `admin` only     | Categories, teams, and competitors   |
| `/panel/competitions`  | `admin` only     | Full competition management          |
| `/timer`               | `counter` only   | Timing operations                    |
| `/live`                | Public           | Planned public live information area |
| `/live/:competitionId` | Public           | Planned public competition route     |

Protected routes display a loading state while the session is checked. Unauthenticated visitors return to `/login`, while users without the required role return to the dashboard.

## Administrative dashboard

The dashboard uses a layout with side navigation and organizes administrative tasks by domain:

- **Users:** operator creation and account-related actions.
- **Extras:** category, team, and competitor maintenance.
- **Competitions:** actions to edit information, toggle status, manage categories, participants, and operators, reorder participants, review results, and delete competitions.

Forms are decoupled into reusable components and connected to React Query hooks specific to each module.

## Timing view

The `/timer` route targets the `counter` role and retrieves the competition assigned for the day. The interface displays loading or no-competition states and, when an assignment exists, opens the time-recording flow.

The client maintains a Socket.IO store and hooks to subscribe to and clean up event listeners. This makes it possible to:

- Connect an operator to their session and competition.
- See which timing points are connected.
- Share already processed participants.
- Share a participant's current times between operators.
- Reset the current time before confirming the record.

HTTP communication uses typed responses with the shared `APIResponse<T>` shape.

## Authentication and access control

The client integrates Better Auth with session support and the administrative plugin. React Query retrieves the session, which is used at three levels:

1. `AuthPass` keeps the login screen from appearing for users with an active session.
2. `AuthGuard` protects the dashboard and timing view.
3. `RoleGuard` restricts administrative routes to `admin` and the timing view to `counter`.

Roles and types are imported from `@cronope/schemas`, so the interface and backend share the same domain contract.

## API integration

The HTTP client is configured in `src/lib/api.ts` with:

- A base URL built from `VITE_SERVER`.
- Local fallback `http://localhost:3000`.
- `/api` prefix.
- `withCredentials: true` for cookie-based sessions.
- Typed `GET`, `POST`, `PATCH`, and `DELETE` methods.

Local configuration example:

```env
VITE_SERVER=http://localhost:3000
```

The Better Auth client currently uses `http://localhost:3000/api/auth`. In other environments, this URL must match the deployed authentication server.

## Requirements

- Node.js 20 or newer.
- pnpm 10 or newer.
- Bike Chrono backend available at the server specified by `VITE_SERVER`.
- Dependencies installed from the monorepo root.

## Local installation and execution

From the monorepo root:

```bash
pnpm install
```

To run only the client:

```bash
pnpm --filter client dev
```

Vite serves the application at `http://localhost:5173` by default.

Available scripts in `apps/client`:

```bash
# Development with HMR
pnpm --filter client dev

# TypeScript and production build
pnpm --filter client build

# Lint
pnpm --filter client lint

# Preview the build
pnpm --filter client preview
```

To run the frontend and backend through the monorepo script:

```bash
pnpm dev
```

## Quality and maintainability

- Separation by functional domains and reusable UI components.
- Hooks specific to each module's queries and mutations.
- Authentication and authorization guards in the router.
- Shared contracts and types from `@cronope/schemas`.
- React Query for caching, synchronizing, and updating remote data.
- Socket.IO listener cleanup when components unmount.
- ESLint and TypeScript integrated into the build flow.
- React Compiler enabled in the project configuration.

## Current status and evolution

The application includes the main administrative dashboard and time-recording flows. The `live` routes are prepared in the router, but their public screens are still placeholders. Planned improvements include:

- Complete the public live view for each competition.
- Improve public results presentation.
- Add automated component and user-flow tests.
- Configure the authentication URL externally for non-local deployments.

## Relationship with the backend

This README documents only `apps/client`. The API, Prisma model, server authentication, and Socket.IO gateway are documented in [apps/server/README.md](../server/README.md).

# Bike Chrono Frontend

Aplicación web de Bike Chrono. Este cliente permite a administradores configurar competencias y a operadores registrar tiempos de participantes durante una carrera de ciclismo. Consume la API del servidor mediante HTTP y utiliza Socket.IO para sincronizar el cronometraje en tiempo real.

## Valor técnico

- Single-page application construida con React 19, TypeScript y Vite.
- Navegación declarativa con React Router.
- Protección de rutas por sesión y por rol (`admin` y `counter`).
- Gestión de datos remotos con TanStack React Query.
- Cliente HTTP tipado con Axios y contratos compartidos desde `@cronope/schemas`.
- Formularios con React Hook Form y validación mediante Zod.
- Estado local y de conexión en tiempo real con Zustand.
- Integración de autenticación Better Auth desde el navegador.
- Cronometraje multioperador con `socket.io-client`.
- Sistema visual basado en Tailwind CSS 4, componentes reutilizables y `lucide-react`.

## Responsabilidad del cliente

El frontend ofrece las interfaces para:

- Iniciar y cerrar sesión.
- Consultar el estado de la sesión actual y redirigir al usuario según su autenticación.
- Mostrar un panel protegido para la operación administrativa.
- Crear usuarios operadores.
- Crear, editar y bloquear competidores.
- Crear categorías y equipos, y editar equipos.
- Crear y administrar competencias.
- Activar o desactivar competencias.
- Configurar categorías, participantes, orden de salida y operadores de una competencia.
- Consultar resultados de una competencia.
- Obtener la competencia asignada para el día.
- Registrar tiempos desde la vista del operador.
- Mostrar el estado de conexión de los puntos de cronometraje y sincronizar tiempos actuales entre ellos.

## Stack tecnológico

| Área               | Tecnología                            |
| ------------------ | ------------------------------------- |
| UI                 | React 19                              |
| Lenguaje           | TypeScript                            |
| Build y desarrollo | Vite 8                                |
| Routing            | React Router 8                        |
| Datos remotos      | TanStack React Query 5                |
| Cliente HTTP       | Axios                                 |
| Autenticación      | Better Auth React                     |
| Formularios        | React Hook Form + Zod                 |
| Estado             | Zustand 5                             |
| Tiempo real        | Socket.IO Client 4                    |
| Estilos            | Tailwind CSS 4 + `tw-animate-css`     |
| Componentes        | Base UI, shadcn y componentes propios |
| Iconos             | Lucide React                          |
| Tipos compartidos  | Paquete interno `@cronope/schemas`    |

## Arquitectura

```text
apps/client/
├── public/                    # Recursos estáticos
├── src/
│   ├── components/
│   │   ├── competitions/      # Gestión, edición y resultados
│   │   ├── extras/            # Categorías, equipos y competidores
│   │   ├── login/             # Login, sesión y guards de rutas
│   │   ├── timer/             # Cronometraje y comunicación Socket.IO
│   │   ├── users/             # Usuarios operadores
│   │   ├── sidebar/           # Navegación del panel
│   │   ├── pages/             # Páginas principales y 404
│   │   ├── ui/                # Primitivas reutilizables de interfaz
│   │   └── app/               # Loading, toasts, inputs y acciones comunes
│   ├── layouts/               # Layout del panel administrativo
│   ├── lib/
│   │   ├── api.ts             # Cliente Axios y rutas de la API
│   │   ├── auth-client.ts     # Cliente Better Auth
│   │   └── store/             # Stores de navegación y Socket.IO
│   ├── App.tsx                # Árbol de rutas y guards
│   ├── main.tsx               # Providers globales y montaje de React
│   └── index.css              # Tokens visuales y estilos Tailwind
└── vite.config.ts
```

## Flujos y rutas de la aplicación

| Ruta                   | Acceso           | Funcionalidad                                  |
| ---------------------- | ---------------- | ---------------------------------------------- |
| `/`                    | Público          | Página de inicio                               |
| `/login`               | Público          | Inicio de sesión                               |
| `/panel`               | Sesión requerida | Panel administrativo                           |
| `/panel/users`         | Solo `admin`     | Creación de usuarios                           |
| `/panel/extras`        | Solo `admin`     | Categorías, equipos y competidores             |
| `/panel/competitions`  | Solo `admin`     | Gestión completa de competencias               |
| `/timer`               | Solo `counter`   | Operación de cronometraje                      |
| `/live`                | Público          | Área prevista para información pública en vivo |
| `/live/:competitionId` | Público          | Ruta prevista para una competencia pública     |

Las rutas protegidas muestran un estado de carga mientras se consulta la sesión. Un visitante no autenticado vuelve a `/login`, mientras que un usuario con un rol no permitido vuelve al panel.

## Panel administrativo

El panel usa un layout con navegación lateral y organiza las tareas de administración por dominio:

- **Usuarios:** alta de operadores y acciones relacionadas con sus cuentas.
- **Extras:** mantenimiento de categorías, equipos y competidores.
- **Competencias:** tarjetas con acciones para editar información, alternar estado, gestionar categorías, participantes y operadores, ordenar participantes, revisar resultados y eliminar.

Los formularios están desacoplados en componentes reutilizables y conectados a hooks específicos de React Query para consultar y actualizar información.

## Vista de cronometraje

La ruta `/timer` está orientada al rol `counter` y obtiene la competencia asignada para el día. La interfaz muestra estados de carga o ausencia de competencia y, cuando existe una asignación, abre el flujo de registro de tiempos.

El cliente mantiene un store de Socket.IO y hooks para suscribirse y limpiar listeners de eventos. Esto permite:

- Conectar el operador con su sesión y competencia.
- Visualizar qué puntos de cronometraje están conectados.
- Compartir participantes ya procesados.
- Compartir los tiempos actuales de un participante entre operadores.
- Reiniciar el tiempo actual antes de confirmar el registro.

La comunicación HTTP utiliza respuestas tipadas con la forma compartida `APIResponse<T>`.

## Autenticación y control de acceso

El cliente integra Better Auth con soporte de sesión y plugin administrativo. La sesión se consulta mediante React Query y se utiliza en tres niveles:

1. `AuthPass` evita mostrar el login a usuarios que ya tienen sesión.
2. `AuthGuard` protege el panel y la vista de cronometraje.
3. `RoleGuard` restringe las rutas administrativas a `admin` y la vista de cronometraje a `counter`.

Los roles y tipos se importan desde `@cronope/schemas`, de modo que la interfaz y el backend comparten el mismo contrato de dominio.

## Integración con la API

El cliente HTTP se configura en `src/lib/api.ts` con:

- Base URL formada a partir de `VITE_SERVER`.
- Fallback local `http://localhost:3000`.
- Prefijo `/api`.
- `withCredentials: true` para sesiones basadas en cookies.
- Métodos tipados `GET`, `POST`, `PATCH` y `DELETE`.

Ejemplo de configuración local:

```env
VITE_SERVER=http://localhost:3000
```

El cliente de Better Auth usa actualmente `http://localhost:3000/api/auth`. En otros entornos, esta URL debe configurarse para coincidir con el servidor de autenticación desplegado.

## Requisitos

- Node.js 20 o superior.
- pnpm 10 o superior.
- Backend de Bike Chrono disponible en el servidor indicado por `VITE_SERVER`.
- Dependencias instaladas desde la raíz del monorepo.

## Instalación y ejecución local

Desde la raíz del monorepo:

```bash
pnpm install
```

Para ejecutar únicamente el cliente:

```bash
pnpm --filter client dev
```

Por defecto, Vite sirve la aplicación en `http://localhost:5173`.

Scripts disponibles en `apps/client`:

```bash
# Desarrollo con HMR
pnpm --filter client dev

# TypeScript y build de producción
pnpm --filter client build

# Lint
pnpm --filter client lint

# Previsualización del build
pnpm --filter client preview
```

Para ejecutar frontend y backend mediante el script del monorepo:

```bash
pnpm dev
```

## Calidad y mantenibilidad

- Separación por dominios funcionales y componentes de UI reutilizables.
- Hooks específicos para consultas y mutaciones de cada módulo.
- Guards de autenticación y autorización en el router.
- Contratos y tipos compartidos con el paquete `@cronope/schemas`.
- React Query para cachear, sincronizar y actualizar datos remotos.
- Limpieza de listeners Socket.IO al desmontar componentes.
- ESLint y TypeScript integrados en el flujo de build.
- React Compiler habilitado en la configuración del proyecto.

## Estado actual y evolución

La aplicación cuenta con los flujos principales del panel administrativo y del registro de tiempos. Las rutas `live` están preparadas en el router, pero sus pantallas públicas todavía son placeholders. Entre las mejoras previstas se encuentran:

- Completar la vista pública en vivo por competencia.
- Mejorar la presentación pública de resultados.
- Añadir pruebas automatizadas de componentes y flujos de usuario.
- Configurar de forma externa la URL de autenticación para despliegues no locales.

## Relación con el backend

Este README documenta únicamente `apps/client`. La API, el modelo Prisma, la autenticación del servidor y el gateway Socket.IO están documentados en [apps/server/README.md](../server/README.md).
