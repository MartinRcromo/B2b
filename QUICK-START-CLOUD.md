# ⚡ Quick Start - Deployment en 15 minutos

Guía rápida para deployar el Portal B2B Argenta en la nube **sin instalar nada en tu PC**.

## 🎯 Stack Elegido (TODO GRATIS)

- 🗄️ **Supabase** - Base de datos PostgreSQL
- 🔧 **Railway** - Backend (Vendure)
- 🎨 **Vercel** - Frontend (Next.js)

---

## ✅ PASO 1: Supabase (2 minutos)

1. Ve a https://supabase.com → Sign up con GitHub
2. "New Project" → Nombre: `argenta-b2b`
3. Genera una password fuerte → **Cópiala**
4. Region: Brazil → "Create project"
5. Espera 2 minutos
6. Settings ⚙️ → Database → Connection string → URI
7. **Copia** esta URL completa:
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

✅ **Ya tienes la base de datos**

---

## ✅ PASO 2: Railway (5 minutos)

1. Ve a https://railway.app → Login con GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona el repo `B2b` → "Deploy Now"
4. Click en el servicio → Variables → Raw Editor
5. Pega esto (cambia los valores):

```env
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.xxx.supabase.co:5432/postgres
COOKIE_SECRET=un-secreto-super-largo-y-aleatorio-cambiar
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=TuPasswordSeguro123
PORT=3000
SHOP_API_PATH=/shop-api
ADMIN_API_PATH=/admin-api
NODE_ENV=production
```

6. Click "Save"
7. Espera 3-5 minutos (se buildea automáticamente)
8. Settings → Networking → "Generate Domain"
9. **Copia tu URL**: `https://xxx.up.railway.app`

✅ **Ya tienes el backend funcionando**

Verifica: Abre `https://tu-url.up.railway.app/shop-api` → Deberías ver GraphQL

---

## ✅ PASO 3: Vercel (3 minutos)

1. Ve a https://vercel.com → Sign up con GitHub
2. "Add New..." → "Project"
3. Busca `B2b` → "Import"
4. **Root Directory**: Click Edit → escribe `frontend`
5. Environment Variables → Agrega:

```
NEXT_PUBLIC_API_URL=https://tu-url.up.railway.app
NEXT_PUBLIC_SHOP_API_PATH=/shop-api
NEXT_PUBLIC_ADMIN_API_PATH=/admin-api
```

⚠️ Reemplaza `https://tu-url.up.railway.app` con tu URL de Railway

6. Click "Deploy"
7. Espera 2 minutos
8. **Copia tu URL**: `https://xxx.vercel.app`

✅ **Ya tienes el frontend funcionando**

---

## 🎉 ¡LISTO!

Tu portal está 100% en la nube:

### 🌐 URLs de tu proyecto:

- **Frontend (Clientes)**: `https://xxx.vercel.app`
- **Backend API**: `https://xxx.up.railway.app/shop-api`
- **Admin Panel**: `https://xxx.up.railway.app/admin`
- **Base de datos**: Supabase dashboard

### 🔑 Credenciales Admin:

```
URL: https://tu-railway-url.up.railway.app/admin
Usuario: admin
Password: (el que configuraste en SUPERADMIN_PASSWORD)
```

---

## 🔧 Próximos pasos opcionales

1. **Poblar datos de prueba** (desde Railway):
   - Instala Railway CLI: `npm i -g @railway/cli`
   - Login: `railway login`
   - Run: `railway run npm run populate`

2. **Personalizar dominio** (opcional):
   - Vercel: Settings → Domains
   - Railway: Settings → Networking

3. **Agregar productos**:
   - Entra al Admin Panel
   - Catalog → Products → Create

---

## 📖 Documentación completa

Para más detalles, lee: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🆘 Problemas?

### Backend no inicia
- Verifica la `DATABASE_URL` en Railway
- Revisa los logs: Railway → View Logs

### Frontend no conecta al backend
- Verifica `NEXT_PUBLIC_API_URL` en Vercel
- Debe ser tu URL de Railway (sin `/` al final)

### Error de base de datos
- Verifica que Supabase esté activo
- La password en `DATABASE_URL` debe ser correcta

---

**Todo funcionando?** 🎉
Ahora puedes empezar a desarrollar los plugins y funcionalidades!
