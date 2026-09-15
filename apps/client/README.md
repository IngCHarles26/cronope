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
