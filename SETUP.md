# Guía de Setup - Portal B2B Argenta

Esta guía te llevará paso a paso en la configuración inicial del proyecto.

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js 18 o superior
- ✅ npm 9 o superior
- ✅ Docker y Docker Compose
- ✅ Git

Verificar versiones:
```bash
node --version  # Debe ser >= 18
npm --version   # Debe ser >= 9
docker --version
docker-compose --version
```

## 🚀 Setup Paso a Paso

### PASO 1: Iniciar la Base de Datos

1. Navega a la raíz del proyecto:
```bash
cd B2b
```

2. Inicia PostgreSQL y Redis con Docker:
```bash
docker-compose up -d
```

3. Verifica que los contenedores estén corriendo:
```bash
docker-compose ps
```

Deberías ver 3 servicios activos:
- `argenta-postgres` (puerto 5432)
- `argenta-redis` (puerto 6379)
- `argenta-pgadmin` (puerto 5050)

4. (Opcional) Accede a pgAdmin para verificar la base de datos:
- URL: http://localhost:5050
- Email: admin@argenta.com
- Password: admin

### PASO 2: Configurar el Backend (Vendure)

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

Esto puede tomar unos minutos la primera vez.

3. Verifica que el archivo `.env` exista:
```bash
cat .env
```

Si necesitas modificar la configuración de base de datos, edita el archivo `.env`:
```bash
nano .env  # o usa tu editor preferido
```

4. Poblar la base de datos con datos iniciales:
```bash
npm run populate
```

Este comando:
- Crea las tablas en PostgreSQL
- Crea el usuario superadmin
- Crea roles personalizados (Cliente, Vendedor, Asistente, Gerencia)
- Crea productos de ejemplo
- Configura métodos de envío

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Si todo está bien, deberías ver:
```
✅ Servidor Vendure iniciado correctamente
📍 Admin API: http://localhost:3000/admin-api
📍 Shop API: http://localhost:3000/shop-api
📍 Admin UI: http://localhost:3002/admin
```

6. Verifica que el backend esté funcionando:
- Abre http://localhost:3000/shop-api en tu navegador
- Deberías ver el GraphQL Playground

7. (Opcional) Accede al Admin UI:
- URL: http://localhost:3002/admin
- Usuario: superadmin
- Password: superadmin

### PASO 3: Configurar el Frontend (Next.js)

1. Abre una NUEVA terminal (deja el backend corriendo)

2. Navega a la carpeta frontend:
```bash
cd frontend
```

3. Instala las dependencias:
```bash
npm install
```

4. Verifica que el archivo `.env.local` exista:
```bash
cat .env.local
```

El archivo debe contener:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SHOP_API_PATH=/shop-api
```

5. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Por defecto Next.js usa el puerto 3000, pero como el backend ya lo está usando, Next.js automáticamente usará el puerto 3001.

6. Abre el navegador en http://localhost:3001

Deberías ver la página de inicio del portal B2B Argenta.

## ✅ Verificación del Setup

### Backend Funcionando ✓

Verifica que estas URLs respondan:

1. Shop API (GraphQL Playground):
   http://localhost:3000/shop-api

2. Admin API (GraphQL Playground):
   http://localhost:3000/admin-api

3. Admin UI:
   http://localhost:3002/admin

### Frontend Funcionando ✓

1. Home Page:
   http://localhost:3001

2. La página debe cargar sin errores en la consola del navegador

### Base de Datos ✓

1. Accede a pgAdmin: http://localhost:5050

2. Conéctate al servidor PostgreSQL:
   - Host: postgres (o localhost si no funciona)
   - Port: 5432
   - Database: argenta_b2b
   - Username: postgres
   - Password: postgres

3. Verifica que existan tablas en la base de datos `argenta_b2b`

## 🎯 Próximos Pasos

Ahora que tienes el setup básico funcionando, puedes:

1. **Explorar el Admin UI** (http://localhost:3002/admin)
   - Crear productos
   - Gestionar clientes
   - Configurar roles

2. **Probar las APIs GraphQL**
   - Shop API: http://localhost:3000/shop-api
   - Ejecutar queries de ejemplo

3. **Desarrollar los Plugins Personalizados**
   - Implementar resolvers
   - Crear entidades
   - Desarrollar la lógica de negocio

4. **Desarrollar el Frontend**
   - Crear páginas
   - Desarrollar componentes
   - Integrar con el backend

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que Docker esté corriendo: `docker ps`
2. Reinicia los contenedores: `docker-compose restart`
3. Verifica los logs: `docker-compose logs postgres`

### Error: "Port 3000 is already in use"

**Solución:**
1. Mata el proceso en el puerto 3000:
```bash
# En Linux/Mac
lsof -ti:3000 | xargs kill -9

# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. O cambia el puerto en `backend/.env`:
```
PORT=3001
```

### Error: "npm install" falla

**Solución:**
1. Limpia el cache de npm:
```bash
npm cache clean --force
```

2. Elimina node_modules y reinstala:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend no se conecta al Backend

**Solución:**
1. Verifica que el backend esté corriendo en el puerto 3000
2. Verifica las variables de entorno en `frontend/.env.local`
3. Reinicia el servidor de Next.js

### Error: "Unauthorized" en GraphQL

**Solución:**
1. Asegúrate de estar autenticado
2. Ejecuta la mutation de login primero
3. Las cookies deben estar habilitadas en el navegador

## 📚 Recursos Adicionales

- [Documentación de Vendure](https://docs.vendure.io)
- [Documentación de Next.js](https://nextjs.org/docs)
- [GraphQL](https://graphql.org/learn/)
- [Docker](https://docs.docker.com/)

## 🆘 Soporte

Si encuentras problemas que no están cubiertos en esta guía:

1. Revisa los logs del backend: `cd backend && npm run dev` (observa los mensajes de error)
2. Revisa los logs de Docker: `docker-compose logs`
3. Revisa la consola del navegador (F12) para errores del frontend

---

✨ **¡Listo! Tu entorno de desarrollo está configurado y funcionando.**
