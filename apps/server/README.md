# Bike Chrono Backend

Backend de Bike Chrono, una plataforma para administrar competencias de ciclismo y registrar tiempos de participantes en distintos puntos de una ruta. Este servicio concentra la lógica de negocio, la persistencia, la autenticación y la comunicación en tiempo real con los usuarios que operan los puntos de cronometraje.

## Valor técnico

- API modular construida con NestJS y TypeScript.
- Persistencia relacional con PostgreSQL y Prisma ORM.

## Responsabilidad del servicio

El backend permite:

...

## Stack tecnológico

| Área | Tecnología |
| ---- | ---------- |

## Arquitectura

El servidor está organizado por módulos de dominio:

...

## API HTTP

Todas las rutas HTTP de este apartado se sirven bajo `/api`.

...

## Cronometraje en tiempo real

El gateway Socket.IO usa el namespace `competition-time`.

...

## Autenticación y autorización

Better Auth está configurado con:

...

## Modelo de datos

El esquema Prisma incluye las siguientes entidades principales:

...

## Validación y contratos compartidos

Los payloads de competencias, competidores, usuarios, categorías y equipos se validan con esquemas Zod importados desde el paquete interno `@cronope/schemas`. Esto permite compartir tipos y reglas entre `apps/server` y `apps/client`.

...

## Requisitos

- Node.js 20 o superior.
- pnpm 10 o superior.

## Instalación y ejecución local

Desde la raíz del monorepo:

...

## Calidad y mantenibilidad

- TypeScript estricto y módulos de NestJS separados por responsabilidad.
- Servicios desacoplados de los controladores para concentrar la lógica de negocio.

## Estado actual y siguientes mejoras

El backend ya cuenta con la base funcional para administrar competencias, participantes y puntos de registro de tiempos. Entre las líneas de evolución identificadas en el proyecto están:

...

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
└── docker-compose.yml      # PostgreSQL local para desarrollo
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
- PostgreSQL 14 o superior, local o mediante Docker.
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

Para levantar PostgreSQL con la configuración incluida:

```bash
cd apps/server
docker compose up -d db
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
