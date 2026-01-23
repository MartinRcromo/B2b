# 🚀 Guía de Deployment en la Nube - Portal B2B Argenta

Esta guía te permitirá deployar el proyecto completo en la nube **sin necesidad de permisos de administrador** en tu PC.

## 📋 Arquitectura de Deployment

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIOS                             │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────┐
│   Frontend    │────────>│   Backend    │
│               │         │              │
│ Vercel        │         │  Railway     │
│ o Netlify     │         │  (Vendure)   │
└───────────────┘         └──────┬───────┘
                                 │
                                 ▼
                          ┌─────────────┐
                          │  Database   │
                          │  Supabase   │
                          │ (PostgreSQL)│
                          └─────────────┘
```

## 🎯 Servicios que vamos a usar (100% GRATIS para empezar)

1. **Supabase** - Base de datos PostgreSQL
2. **Railway** - Backend (Vendure)
3. **Vercel o Netlify** - Frontend (Next.js)

---

# PASO 1: Crear Base de Datos en Supabase

## 1.1. Crear cuenta en Supabase

1. Ve a https://supabase.com
2. Click en "Start your project"
3. Regístrate con tu cuenta de GitHub (recomendado) o email

## 1.2. Crear un nuevo proyecto

1. Click en "New Project"
2. Completa los datos:
   - **Name**: argenta-b2b
   - **Database Password**: Genera una contraseña fuerte y **guárdala** (la necesitarás)
   - **Region**: Elige la más cercana (Brazil para Argentina)
   - **Plan**: Free (0 USD)
3. Click en "Create new project"
4. Espera 2-3 minutos mientras se crea el proyecto

## 1.3. Obtener credenciales de conexión

1. En tu proyecto de Supabase, ve a **Settings** (⚙️) → **Database**
2. Scroll hasta la sección **Connection string**
3. Selecciona **URI** y verás algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
4. Copia esta URL completa (reemplaza `[YOUR-PASSWORD]` con tu contraseña)
5. **GUARDA ESTA URL** - la necesitarás para Railway

También anota estos datos por separado:
- **Host**: `db.xxxxxxxxxxxxx.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: Tu contraseña

---

# PASO 2: Deployar Backend en Railway

## 2.1. Crear cuenta en Railway

1. Ve a https://railway.app
2. Click en "Login" → Sign up with GitHub
3. Autoriza Railway con tu cuenta de GitHub

## 2.2. Crear nuevo proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Si es la primera vez:
   - Click en "Configure GitHub App"
   - Selecciona el repositorio `B2b`
   - Guarda
4. Selecciona el repositorio `B2b`
5. Click en "Deploy Now"

## 2.3. Configurar variables de entorno

Railway detectará automáticamente el proyecto Node.js. Ahora configura las variables:

1. En tu proyecto de Railway, click en el servicio (aparecerá como "B2b")
2. Ve a la pestaña **Variables**
3. Click en **Raw Editor** y pega lo siguiente:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Vendure Config
COOKIE_SECRET=tu-secreto-super-seguro-aqui-cambiar-en-produccion
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=admin123

# API Config
PORT=3000
SHOP_API_PATH=/shop-api
ADMIN_API_PATH=/admin-api
NODE_ENV=production

# App URL (Railway lo genera automáticamente, pero puedes dejarlo vacío por ahora)
APP_URL=https://tu-app.up.railway.app

# Flexus ERP (configurar más tarde)
FLEXUS_API_URL=
FLEXUS_API_KEY=

# AI Search (configurar más tarde si quieres)
OPENAI_API_KEY=
CLAUDE_API_KEY=
```

⚠️ **IMPORTANTE**:
- Reemplaza `DATABASE_URL` con la URL que obtuviste de Supabase
- Cambia `SUPERADMIN_PASSWORD` por algo seguro
- Cambia `COOKIE_SECRET` por un string aleatorio largo

4. Click en **Save**

## 2.4. Configurar el build

1. En la pestaña **Settings** de tu servicio
2. Scroll hasta **Build Command** y asegúrate que diga:
   ```
   cd backend && npm install && npm run build
   ```
3. En **Start Command** debe decir:
   ```
   cd backend && npm start
   ```
4. Click en **Deploy** en la parte superior

## 2.5. Obtener la URL de tu backend

1. Espera a que el deploy termine (2-5 minutos)
2. Railway te dará una URL como: `https://b2b-production.up.railway.app`
3. Ve a **Settings** → **Networking** → **Generate Domain**
4. Copia esa URL, la necesitarás para el frontend

## 2.6. Verificar que funciona

Abre en tu navegador:
```
https://tu-app.up.railway.app/shop-api
```

Deberías ver el GraphQL Playground.

---

# PASO 3A: Deployar Frontend en Vercel (RECOMENDADO)

## 3.1. Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Click en "Sign Up"
3. Usa "Continue with GitHub"

## 3.2. Importar proyecto

1. Click en "Add New..." → "Project"
2. Busca el repositorio `B2b`
3. Click en "Import"

## 3.3. Configurar el proyecto

En la pantalla de configuración:

1. **Framework Preset**: Next.js (se detecta automáticamente)
2. **Root Directory**: Click en "Edit" y escribe `frontend`
3. **Build Command**: `npm run build` (por defecto)
4. **Output Directory**: `.next` (por defecto)

## 3.4. Configurar variables de entorno

En la sección **Environment Variables**, agrega:

```
NEXT_PUBLIC_API_URL=https://tu-app.up.railway.app
NEXT_PUBLIC_SHOP_API_PATH=/shop-api
NEXT_PUBLIC_ADMIN_API_PATH=/admin-api
```

⚠️ **Reemplaza** `https://tu-app.up.railway.app` con la URL que obtuviste de Railway en el Paso 2.5

5. Click en "Deploy"

## 3.5. Verificar deployment

1. Espera 2-3 minutos
2. Vercel te dará una URL como: `https://b2b-xxxxx.vercel.app`
3. Abre esa URL en tu navegador
4. Deberías ver el Portal B2B de Argenta funcionando

---

# PASO 3B: Deployar Frontend en Netlify (ALTERNATIVA)

Si prefieres usar Netlify en lugar de Vercel:

## 3.1. Crear cuenta en Netlify

1. Ve a https://netlify.com
2. Click en "Sign Up" → GitHub

## 3.2. Importar proyecto

1. Click en "Add new site" → "Import an existing project"
2. Selecciona "GitHub"
3. Busca y selecciona el repositorio `B2b`

## 3.3. Configurar build settings

1. **Base directory**: `frontend`
2. **Build command**: `npm run build`
3. **Publish directory**: `frontend/.next`

## 3.4. Configurar variables de entorno

En "Site settings" → "Environment variables", agrega:

```
NEXT_PUBLIC_API_URL=https://tu-app.up.railway.app
NEXT_PUBLIC_SHOP_API_PATH=/shop-api
NEXT_PUBLIC_ADMIN_API_PATH=/admin-api
```

⚠️ **Reemplaza** con tu URL de Railway

## 3.5. Deploy

1. Click en "Deploy site"
2. Espera 2-3 minutos
3. Netlify te dará una URL como: `https://argenta-b2b.netlify.app`

---

# PASO 4: Inicializar la Base de Datos

Como es la primera vez, necesitas poblar la base de datos con datos iniciales.

## Opción A: Desde Railway CLI (Recomendado)

1. Instala Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login en Railway:
   ```bash
   railway login
   ```

3. Desde la carpeta del proyecto, corre:
   ```bash
   railway run npm run populate
   ```

## Opción B: Desde el dashboard de Railway

1. Ve a tu proyecto en Railway
2. Click en tu servicio
3. Ve a la pestaña **Deployments**
4. Click en el deployment activo
5. En la parte superior derecha, click en los 3 puntos → **View Logs**
6. Busca si hay errores

Si ves errores de "tablas no creadas", necesitarás:
1. Ir a Settings → Variables
2. Agregar: `RUN_MIGRATIONS=true`
3. Redesplegar

---

# 🎉 ¡LISTO! Tu portal está en la nube

Ahora tienes:

✅ **Frontend**: `https://tu-app.vercel.app` o `https://tu-app.netlify.app`
✅ **Backend**: `https://tu-app.up.railway.app`
✅ **Base de datos**: Supabase

## Accesos:

### Admin UI:
```
URL: https://tu-app.up.railway.app/admin
Usuario: admin (o el que configuraste)
Password: admin123 (o el que configuraste)
```

### GraphQL Playground:
```
Shop API: https://tu-app.up.railway.app/shop-api
Admin API: https://tu-app.up.railway.app/admin-api
```

---

# 🔧 Troubleshooting

## Error: "Cannot connect to database"

1. Verifica que la `DATABASE_URL` en Railway sea correcta
2. Asegúrate de haber reemplazado `[YOUR-PASSWORD]` con tu password real
3. Verifica que el proyecto de Supabase esté activo

## Error: "Module not found" en Railway

1. Ve a Settings → Build Command
2. Asegúrate que diga: `cd backend && npm install && npm run build`
3. Redesplegar

## Frontend no se conecta al backend

1. Verifica que `NEXT_PUBLIC_API_URL` en Vercel/Netlify apunte a tu URL de Railway
2. Verifica que no tenga slash `/` al final
3. Redesplegar el frontend

## Railway se queda "Building..."

1. Ve a View Logs
2. Busca errores de compilación TypeScript
3. Si hay errores de tipos, puedes deshabilitarlos temporalmente agregando en Variables:
   ```
   SKIP_TYPE_CHECK=true
   ```

---

# 💰 Costos (GRATIS para empezar)

- **Supabase Free**: 500 MB database, 2 GB bandwidth
- **Railway Free**: $5 USD de crédito mensual (suficiente para desarrollo)
- **Vercel Free**: 100 GB bandwidth, builds ilimitados
- **Netlify Free**: 100 GB bandwidth, 300 build minutes

Todos tienen planes gratuitos generosos que te permitirán desarrollar y probar sin gastar nada.

---

# 🔄 Próximos pasos

1. **Configurar dominio custom** (opcional)
2. **Agregar productos** desde el Admin UI
3. **Configurar integración con Flexus ERP**
4. **Implementar los plugins personalizados**
5. **Configurar emails** (Resend, SendGrid, etc.)

---

# 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Revisa la consola del navegador (F12)
3. Verifica las variables de entorno

**URLs de los servicios:**
- Supabase: https://app.supabase.com
- Railway: https://railway.app
- Vercel: https://vercel.com
- Netlify: https://netlify.com
