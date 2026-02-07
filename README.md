# 🚀 API REST - Express + MySQL + React Native

API REST completa para gestión de usuarios y autenticación, compatible con aplicaciones web y móviles (React Native + Expo).

## ✨ Características

- 🔐 **Autenticación JWT**: Sistema completo de registro y login
- 🔒 **Seguridad**: Contraseñas hasheadas con bcrypt
- 📱 **Multi-plataforma**: Compatible con Web y React Native/Expo
- 🗃️ **Base de Datos MySQL**: Conexión robusta con pool de conexiones
- ✅ **Validaciones**: Validación completa de datos de entrada
- 📄 **Paginación**: Listado de usuarios con paginación
- 🔍 **Búsqueda**: Búsqueda de usuarios por nombre
- 🛡️ **CORS configurado**: Listo para desarrollo web y móvil
- 📊 **Health Check**: Endpoint para monitoreo del estado

## 🛠️ Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos
- **mysql2** - Cliente MySQL con promesas
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **express-validator** - Validación de datos
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

## 📋 Requisitos Previos

- Node.js v14+ ([Descargar aquí](https://nodejs.org/))
- MySQL v5.7+ ([Descargar aquí](https://dev.mysql.com/downloads/))
- npm o yarn

## ⚙️ Configuración Inicial (IMPORTANTE)

### 1. **Clonar el repositorio**

```bash
git clone https://github.com/TU-USUARIO/api-express-mysql.git
cd api-express-mysql
```

### 2. **Instalar dependencias**

```bash
npm install
```

### 3. **Configurar variables de entorno**

Crea un archivo `.env` copiando el ejemplo:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edita el archivo `.env` con tus datos:

```env
# Configuración del servidor
PORT=3001
NODE_ENV=development
API_PREFIX=/api/v1

# Configuración de MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=api_usuarios_db
DB_PORT=3306

# JWT Secret (cámbiala por una clave única y segura)
JWT_SECRET=mi_clave_super_secreta_2026
JWT_EXPIRES_IN=24h
```

### 4. **Crear la base de datos**

Abre MySQL Workbench o tu cliente MySQL favorito y ejecuta:

```sql
CREATE DATABASE api_usuarios_db;
USE api_usuarios_db;
```

Luego ejecuta el script que está en [`docs/database.sql`](docs/database.sql)

**O desde terminal:**

```bash
mysql -u root -p < docs/database.sql
```

### 5. **Ejecutar la aplicación**

```bash
# Modo desarrollo
npm run dev

# O modo producción
npm start
```

Deberías ver en consola:

```
🚀 Servidor iniciado correctamente
🌐 URL: http://localhost:3001
📋 API Base: http://localhost:3001/api/v1
```

## 🗄️ Estructura del Proyecto

```
express/
├── config/
│   └── database.js          # Configuración de conexión MySQL
├── controllers/
│   └── userController.js    # Controladores de usuarios
├── middleware/
│   └── validation.js        # Middleware de validaciones
├── models/
│   └── User.js             # Modelo de usuario
├── routes/
│   └── userRoutes.js       # Rutas de usuarios
├── docs/
│   └── database.sql        # Script de creación de BD
├── .env                    # Variables de entorno
├── app.js                  # Aplicación principal
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## 📖 Documentación de la API

### Base URL

```
http://localhost:3000/api/v1
```

### Endpoints Disponibles

#### 🏠 General

| Método | Endpoint  | Descripción                      |
| ------ | --------- | -------------------------------- |
| GET    | `/`       | Información general de la API    |
| GET    | `/health` | Estado de salud de la aplicación |
| GET    | `/docs`   | Documentación básica             |

#### � Autenticación

| Método | Endpoint         | Descripción                   | Auth |
| ------ | ---------------- | ----------------------------- | ---- |
| POST   | `/auth/register` | Registrar nuevo usuario       | No   |
| POST   | `/auth/login`    | Iniciar sesión                | No   |
| GET    | `/auth/profile`  | Obtener perfil del usuario    | Sí   |
| PUT    | `/auth/profile`  | Actualizar perfil del usuario | Sí   |
| POST   | `/auth/refresh`  | Renovar token JWT             | Sí   |
| POST   | `/auth/logout`   | Cerrar sesión                 | Sí   |

#### �👥 Usuarios

| Método | Endpoint        | Descripción                | Auth |
| ------ | --------------- | -------------------------- | ---- |
| GET    | `/users`        | Obtener todos los usuarios | No   |
| GET    | `/users/search` | Buscar usuarios por nombre | No   |
| GET    | `/users/stats`  | Estadísticas de usuarios   | No   |
| GET    | `/users/:id`    | Obtener usuario por ID     | No   |
| POST   | `/users`        | Crear nuevo usuario        | No   |
| PUT    | `/users/:id`    | Actualizar usuario         | No   |
| DELETE | `/users/:id`    | Eliminar usuario           | No   |

### 📝 Ejemplos de Uso

#### 🔐 Autenticación

#### 1. Registrar nuevo usuario

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "+1234567890",
  "password": "MiPassword123!"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "+1234567890",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      "fecha_actualizacion": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### 2. Iniciar sesión

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "+1234567890",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      "fecha_actualizacion": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### 3. Obtener perfil (requiere autenticación)

```http
GET /api/v1/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Actualizar perfil

```http
PUT /api/v1/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "telefono": "+1234567891",
  "currentPassword": "MiPassword123!",
  "newPassword": "NuevaPassword456!"
}
```

#### 👥 Gestión de Usuarios

#### 5. Obtener todos los usuarios

```http
GET /api/v1/users

# Con paginación
GET /api/v1/users?page=1&limit=10

# Con búsqueda
GET /api/v1/users?search=juan
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuarios obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "telefono": "+1234567890",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      "fecha_actualizacion": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 2. Obtener usuario por ID

```http
GET /api/v1/users/1
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario obtenido correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "+1234567890",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    "fecha_actualizacion": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Crear nuevo usuario

```http
POST /api/v1/users
Content-Type: application/json

{
  "nombre": "María García",
  "email": "maria@ejemplo.com",
  "telefono": "+9876543210"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": 2,
    "nombre": "María García",
    "email": "maria@ejemplo.com",
    "telefono": "+9876543210",
    "fecha_creacion": "2024-01-15T11:00:00.000Z",
    "fecha_actualizacion": "2024-01-15T11:00:00.000Z"
  }
}
```

#### 4. Actualizar usuario

```http
PUT /api/v1/users/1
Content-Type: application/json

{
  "nombre": "Juan Carlos Pérez",
  "email": "juan.carlos@ejemplo.com",
  "telefono": "+1234567891"
}
```

#### 5. Buscar usuarios

```http
GET /api/v1/users/search?q=juan
```

#### 6. Eliminar usuario

```http
DELETE /api/v1/users/1
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario eliminado correctamente"
}
```

### 🔍 Validaciones

#### Campos Requeridos

- **nombre**: 2-100 caracteres, solo letras y espacios
- **email**: Email válido, máximo 255 caracteres
- **telefono**: 7-20 caracteres, formato de teléfono válido

#### Ejemplos de Errores

```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "field": "email",
      "message": "Debe ser un email válido",
      "value": "email-invalido"
    }
  ]
}
```

## 🚨 Manejo de Errores

La API maneja varios tipos de errores:

### Códigos de Estado HTTP

| Código | Descripción                 |
| ------ | --------------------------- |
| 200    | Éxito                       |
| 201    | Creado                      |
| 400    | Solicitud incorrecta        |
| 404    | No encontrado               |
| 409    | Conflicto (email duplicado) |
| 500    | Error interno del servidor  |

### Formato de Respuesta de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalle específico del error"
}
```

## 🔧 Configuración Avanzada

### Variables de Entorno

```env
# Servidor
NODE_ENV=production          # development | production
PORT=3000                   # Puerto del servidor
API_PREFIX=/api/v1          # Prefijo de la API

# Base de Datos
DB_HOST=localhost           # Host de MySQL
DB_PORT=3306               # Puerto de MySQL
DB_USER=usuario            # Usuario de MySQL
DB_PASSWORD=contraseña     # Contraseña de MySQL
DB_NAME=usuarios_db        # Nombre de la base de datos
```

### Pool de Conexiones MySQL

La aplicación usa un pool de conexiones para optimizar el rendimiento:

- **connectionLimit**: 10 conexiones máximas
- **acquireTimeout**: 60 segundos
- **timeout**: 60 segundos
- **reconnect**: Habilitado

## 🧪 Pruebas

### Usando curl

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Usuario",
    "email": "test@ejemplo.com",
    "telefono": "+1234567890"
  }'

# Obtener usuarios
curl http://localhost:3000/api/v1/users

# Obtener usuario específico
curl http://localhost:3000/api/v1/users/1
```

### Usando Postman

1. Importar la colección de endpoints
2. Configurar el environment con la base URL
3. Ejecutar las pruebas CRUD

## 📊 Monitoring

### Health Check

```http
GET /health
```

Respuesta cuando todo está bien:

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "services": {
    "database": "connected",
    "server": "running"
  }
}
```

## 🚀 Despliegue

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
# Instalar dependencias de producción
npm install --production

# Iniciar aplicación
npm start
```

### Con PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start app.js --name "users-api"

# Monitorear
pm2 status
pm2 logs users-api
```

## 🔒 Seguridad

### Medidas Implementadas

- Validación estricta de entrada
- Sanitización de datos
- Protección CORS configurada
- Manejo seguro de errores
- Límites de payload

### Recomendaciones Adicionales

- Usar HTTPS en producción
- Implementar autenticación JWT
- Rate limiting
- Logging de seguridad

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a MySQL**

   - Verificar que MySQL esté ejecutándose
   - Comprobar credenciales en `.env`
   - Verificar que la base de datos exista

2. **Puerto en uso**

   - Cambiar el puerto en `.env`
   - Matar el proceso que usa el puerto

3. **Errores de validación**
   - Verificar formato de datos enviados
   - Revisar la documentación de campos requeridos

## 📈 Mejoras Futuras

- [ ] Autenticación y autorización
- [ ] Rate limiting
- [ ] Caching con Redis
- [ ] Logs estructurados
- [ ] Pruebas unitarias
- [ ] Documentación con Swagger
- [ ] Dockerización
- [ ] CI/CD

## 📄 Licencia

ISC License

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Crear un issue en el repositorio
- Revisar la documentación en `/docs`
- Verificar el health check en `/health`
