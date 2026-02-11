# Backend 77080

Backend API con Express + MongoDB, con varios enfoques de autenticacion:

- Session tradicional (`/auth/*`)
- Passport Local + Session (`/api/auth/*`)
- JWT Bearer (`/api/auth/jwt/*`)
- JWT en cookie HttpOnly (`/api/auth-jwt/*`), usado tambien por rutas protegidas de alumnos nuevas (`/new-student/*`)

Este README documenta la estructura actual del proyecto, instalacion, configuracion con `.env`, y uso endpoint por endpoint.

## Tabla de contenidos

- [Stack y arquitectura](#stack-y-arquitectura)
- [Estructura actual del proyecto](#estructura-actual-del-proyecto)
- [Requisitos](#requisitos)
- [Clonar e instalar](#clonar-e-instalar)
- [Variables de entorno](#variables-de-entorno)
- [Ejecutar el proyecto](#ejecutar-el-proyecto)
- [Flujos de autenticacion](#flujos-de-autenticacion)
- [Modelos de datos](#modelos-de-datos)
- [API reference](#api-reference)
- [Colecciones de Postman](#colecciones-de-postman)
- [Troubleshooting](#troubleshooting)

## Stack y arquitectura

- Node.js + Express 5
- MongoDB + Mongoose
- Sessions con `express-session` y `connect-mongo`
- Password hashing con `bcrypt`
- JWT con `jsonwebtoken`
- Passport (`passport-local`, `passport-jwt`, `passport-github2`)

Patron principal usado en parte del proyecto:

- Router -> Controller -> Service -> Model

Tambien conviven rutas "directas" (router + model) para fines de practica/comparacion.

## Estructura actual del proyecto

```text
BE_2_77080/
|-- app.js
|-- package.json
|-- package-lock.json
|-- .gitignore
|-- .env.example
|-- README.md
`-- src/
    |-- config/
    |   |-- auth/
    |   |   `-- passport.config.js
    |   |-- db/
    |   |   `-- connect.config.js
    |   `-- env/
    |       `-- env.config.js
    |-- controllers/
    |   `-- student.controller.js
    |-- middleware/
    |   |-- auth.middleware.js
    |   |-- logger.middleware.js
    |   `-- polices.middleware.js
    |-- models/
    |   |-- student.model.js
    |   |-- user.model.js
    |   `-- dto/
    |       `-- student.dto.js
    |-- postman/
    |   |-- Auth.postman_collection.json
    |   `-- Students.postman_collection.json
    |-- router/
    |   |-- router.js
    |   |-- custom/
    |   |   `-- CustomRouter.js
    |   `-- routes/
    |       |-- advanced.router.js
    |       |-- api.v1.router.js
    |       |-- auth.router.js
    |       |-- home.router.js
    |       |-- jwt.router.js
    |       |-- new.student.router.js
    |       |-- process.router.js
    |       |-- profile.router.js
    |       |-- student.router.js
    |       `-- user.router.js
    |-- server/
    |   `-- server.app.js
    `-- services/
        `-- student.service.js
```

## Requisitos

- Node.js (recomendado LTS actual)
- npm
- MongoDB local o MongoDB Atlas

## Clonar e instalar

```bash
git clone https://github.com/Drako01/BE_2_77080.git
cd BE_2_77080
npm install
```

## Variables de entorno

1. Crear `.env` desde `.env.example`:

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

1. Completar valores reales en `.env`.

### Variables soportadas

| Variable | Requerida | Descripcion |
|---|---|---|
| `NODE_ENV` | No | Entorno (`development`, `production`, etc). Default: `development`. |
| `PORT` | No | Puerto del server. Default: `5000`. |
| `MONGO_TARGET` | No | `LOCAL` o `ATLAS`. Default: `LOCAL`. |
| `MONGO_URL` | Si, cuando `MONGO_TARGET=LOCAL` | URI de Mongo local. |
| `MONGO_ATLAS_URL` | Si, cuando `MONGO_TARGET=ATLAS` | URI de Mongo Atlas. |
| `SECRET_SESSION` | Si | Secreto para `express-session` y firmado de cookies. |
| `JWT_SECRET` | Si | Secreto para firmar/verificar JWT. |
| `GITHUB_CLIENT_ID` | Opcional | Requerido si habilitas OAuth GitHub. |
| `GITHUB_CLIENT_SECRET` | Opcional | Requerido si habilitas OAuth GitHub. |
| `GITHUB_CALLBACK_URL` | Opcional | Callback OAuth GitHub. |

Nota: el proyecto valida en arranque `SECRET_SESSION`, `JWT_SECRET` y la URI Mongo segun `MONGO_TARGET`.

## Ejecutar el proyecto

Desarrollo (con nodemon):

```bash
npm run dev
```

Produccion/local simple:

```bash
npm start
```

Servidor esperado:

```text
http://localhost:<PORT>
```

Endpoint base de prueba:

```http
GET /
```

## Flujos de autenticacion

### 1) Session tradicional (`/auth/*`)

- Login guarda `req.session.user`
- Rutas protegidas por `requireLogin`

### 2) Passport Local + Session (`/api/auth/*`)

- Login usa strategy `local` de passport
- Tambien utiliza session server-side

### 3) JWT Bearer (`/api/auth/jwt/*`)

- `/api/auth/jwt/login` devuelve token en JSON
- `/api/auth/jwt/me` espera header:

```http
Authorization: Bearer <token>
```

### 4) JWT Cookie (`/api/auth-jwt/*`)

- Login setea cookie `access_token` (HttpOnly)
- `requireJwtCookie` autentica usando passport-jwt desde la cookie
- Este flujo habilita acceso a `/new-student/*` y varias rutas de `/advanced/*`

## Modelos de datos

### Student

Campos:

- `name`: String
- `email`: String (unico)
- `age`: Number

### User

Campos:

- `first_name`: String
- `last_name`: String
- `email`: String (unico, lowercase, trim)
- `password`: String (hash bcrypt, puede ser null para OAuth)
- `age`: Number
- `role`: `user | seller | admin` (default `user`)
- `githubid`: String

## API reference

### Health/Home

- `GET /` -> mensaje de bienvenida

### Students clasico (`/student`) - sin auth

- `GET /student` -> lista estudiantes
- `POST /student` -> crea estudiante
- `GET /student/:id` -> estudiante por id
- `PUT /student/:id` -> actualiza estudiante
- `DELETE /student/:id` -> elimina estudiante

Body ejemplo create/update:

```json
{
  "name": "Hugo",
  "email": "hugo@mail.com",
  "age": 25
}
```

### Auth con session basica (`/auth`)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` (requiere session)
- `GET /auth` (requiere session)
- `GET /auth/me` (requiere session, via `profile.router`)

Register body:

```json
{
  "first_name": "Johnny",
  "last_name": "Cage",
  "email": "johnny@example.com",
  "password": "password123",
  "age": 30
}
```

### Auth avanzada (`/api/auth`)

- `POST /api/auth/register`
- `POST /api/auth/login` (passport local + session)
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/jwt/login` -> devuelve token JWT
- `GET /api/auth/jwt/me` -> requiere `Authorization: Bearer <token>`

OAuth GitHub (ver nota en troubleshooting):

- `GET /api/auth/github`
- `GET /api/auth/github/callback`
- `GET /api/auth/github/fail`

### Auth JWT en cookie (`/api/auth-jwt`)

- `POST /api/auth-jwt/register`
- `POST /api/auth-jwt/login` -> setea cookie `access_token`
- `GET /api/auth-jwt/me` -> requiere cookie + role `user|admin`
- `POST /api/auth-jwt/logout` -> limpia cookie

### Students con controller/service (`/new-student`) - protegido por JWT cookie

Regla global: requiere cookie `access_token` valida.

- `GET /new-student` -> autenticado
- `GET /new-student/:id` -> roles `admin|user`
- `POST /new-student` -> solo `admin`
- `PUT /new-student/:id` -> solo `admin`
- `DELETE /new-student/:id` -> solo `admin`

Body create:

```json
{
  "name": "Ana",
  "email": "ana@mail.com",
  "age": 21
}
```

### Rutas avanzadas (`/advanced`)

- `GET /advanced/students/:id` -> requiere JWT cookie + roles `admin|user`, usa preload por params
- `GET /advanced/v1/ping` -> `{ "ok": true, "version": "v1" }`
- `GET /advanced/students/:id/courses` -> requiere JWT cookie
- `GET /advanced/boom` -> lanza error controlado para demo

### Subrouter API v1 (`/api/v1`)

- `GET /api/v1/` -> home
- `GET /api/v1/student` y CRUD completo igual que `/student`
- `POST /api/v1/api/auth/*` y resto de auth avanzada anidada

### Process/diagnostics (`/process`)

- `GET /process` -> variables publicas (`NODE_ENV`, `PORT`, `MONGO_TARGET`)
- `GET /process/info` -> info de proceso (pid, memory, argv, uptime, etc.)

### Fallback

- Cualquier ruta no definida responde `404` con:

```json
{ "error": "Page not found.!" }
```

## Colecciones de Postman

Ubicadas en:

- `src/postman/Auth.postman_collection.json`
- `src/postman/Students.postman_collection.json`

Importalas en Postman y define variable `base_url` (ejemplo: `http://localhost:8000`).

## Troubleshooting

### Error de variables de entorno faltantes al arrancar

Revisa `.env` y que existan:

- `SECRET_SESSION`
- `JWT_SECRET`
- `MONGO_URL` o `MONGO_ATLAS_URL` segun `MONGO_TARGET`

### Error de conexion MongoDB

- Verifica que Mongo este levantado (si usas local)
- Verifica usuario/password/cluster (si usas Atlas)
- Confirma que `MONGO_TARGET` coincide con la URI cargada

### 401 / 403 en rutas protegidas

- 401: falta login/token/cookie
- 403: usuario autenticado pero sin role requerido

Importante: el rol por default del usuario registrado es `user`.  
Para probar endpoints solo `admin` (por ejemplo `POST /new-student`), debes actualizar el campo `role` del usuario en MongoDB a `admin`.

### OAuth GitHub no funciona

En el estado actual, la strategy de GitHub en `src/config/auth/passport.config.js` esta comentada.  
Si quieres usar `/api/auth/github`, debes habilitar esa strategy y completar variables `GITHUB_*`.

## Scripts npm

- `npm run dev`: arranque con nodemon
- `npm start`: arranque normal
- `npm test`: placeholder (no tests implementados)

## Licencia

[MIT](./LICENCE)
