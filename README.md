# Portal B2B Argenta - Autopartes Automotrices

Portal ecommerce B2B headless para Argenta, fabricante argentino de ópticas y faros traseros para el mercado automotor.

## 🎯 Descripción del Proyecto

Sistema B2B completo para gestión de ventas a distribuidores, talleres y revendedores con:

- Catálogo de autopartes con búsqueda por vehículo (marca/modelo/año)
- Búsqueda predictiva con AI (OpenAI/Claude)
- Precios diferenciados por cluster de clientes
- Sistema de cotizaciones (RFQ)
- Gestión multi-usuario con 4 roles
- Cuenta corriente integrada
- Integración bidireccional con Flexus ERP

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**
- [Vendure](https://vendure.io) - Framework de ecommerce headless (TypeScript + NestJS + GraphQL)
- PostgreSQL 15 - Base de datos principal
- Redis - Cache y sesiones (opcional)

**Frontend:**
- Next.js 14+ con App Router
- React 18
- TypeScript
- TailwindCSS
- React Query (TanStack Query)
- Zustand (estado global)
- GraphQL Request

**Infraestructura:**
- Docker & Docker Compose
- PostgreSQL container
- Redis container (opcional)

## 📁 Estructura del Proyecto

```
B2b/
├── backend/                    # Vendure Backend
│   ├── src/
│   │   ├── plugins/           # Plugins custom
│   │   │   ├── argenta-autoparts-catalog/      # Búsqueda por vehículo
│   │   │   ├── argenta-customer-pricing/       # Precios por cluster
│   │   │   ├── argenta-rfq/                    # Sistema de cotizaciones
│   │   │   ├── argenta-flexus-integration/     # Integración ERP
│   │   │   ├── argenta-ai-search/              # Búsqueda con AI
│   │   │   └── argenta-customer-account/       # Cuenta corriente
│   │   ├── config/            # Configuración de roles y permisos
│   │   ├── vendure-config.ts  # Configuración principal de Vendure
│   │   ├── index.ts           # Entry point del servidor
│   │   └── populate.ts        # Script de datos iniciales
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/                   # Next.js Frontend
│   ├── app/                   # App Router
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Home page
│   │   ├── providers.tsx      # React Query y otros providers
│   │   └── globals.css        # Estilos globales
│   ├── components/
│   │   ├── search/            # Componentes de búsqueda
│   │   ├── products/          # Componentes de productos
│   │   ├── quotes/            # Componentes de cotizaciones
│   │   ├── account/           # Componentes de cuenta
│   │   └── ui/                # Componentes UI reutilizables
│   ├── lib/
│   │   └── vendure-client.ts  # Cliente GraphQL
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── .env.local
│
├── docker-compose.yml         # Servicios Docker (PostgreSQL, Redis)
└── README.md                  # Este archivo
```

## 🚀 Setup Inicial

### Pre-requisitos

- Node.js 18+
- npm 9+
- Docker & Docker Compose (para PostgreSQL)
- Git

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd B2b
```

### 2. Iniciar servicios de base de datos

```bash
# Iniciar PostgreSQL y Redis con Docker
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker-compose ps
```

Servicios disponibles:
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050` (usuario: admin@argenta.com, password: admin)

### 3. Configurar Backend (Vendure)

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones y poblar datos iniciales
npm run populate

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en:
- Shop API: http://localhost:3000/shop-api
- Admin API: http://localhost:3000/admin-api
- Admin UI: http://localhost:3002/admin

### 4. Configurar Frontend (Next.js)

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local según tus necesidades

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: http://localhost:3001

## 🔌 Plugins Personalizados

### 1. argenta-autoparts-catalog

**Propósito:** Catálogo especializado para autopartes con búsqueda por vehículo

**Funcionalidades:**
- Custom fields para productos (marca, modelo, año, tipo, código OEM)
- Búsqueda avanzada por compatibilidad vehicular
- Filtros especializados
- Resolvers GraphQL optimizados

**GraphQL Queries:**
```graphql
query SearchByVehicle($make: String, $model: String, $year: Int) {
  searchByVehicle(make: $make, model: $model, yearFrom: $year, yearTo: $year) {
    items {
      id
      name
      customFields {
        vehicleMake
        vehicleModel
        oemCode
      }
    }
  }
}
```

### 2. argenta-customer-pricing

**Propósito:** Precios diferenciados por cluster de clientes B2B

**Funcionalidades:**
- 4 clusters de precios (VIP: 25%, Premium: 15%, Standard: 5%, Nuevo: 0%)
- Precios negociados específicos por cliente
- Descuentos por volumen
- Price calculation strategy personalizada

**GraphQL Queries:**
```graphql
query GetEffectivePrice($productVariantId: ID!) {
  effectivePrice(productVariantId: $productVariantId) {
    basePrice
    clusterDiscount
    finalPrice
  }
}
```

### 3. argenta-rfq

**Propósito:** Sistema completo de cotizaciones (Request for Quote)

**Funcionalidades:**
- Estados: Pendiente, En Revisión, Enviada, Aceptada, Rechazada, Convertida, Expirada
- Negociación de precios vendedor-cliente
- Conversión de cotización a orden
- Historial de cambios
- Notificaciones por email

**GraphQL Mutations:**
```graphql
mutation RequestQuote($input: RequestQuoteInput!) {
  requestQuote(input: $input) {
    id
    code
    status
    total
  }
}
```

### 4. argenta-flexus-integration

**Propósito:** Integración bidireccional con Flexus ERP

**Funcionalidades:**
- Sincronización de productos (cada 15 min)
- Sincronización de clientes (diaria)
- Sincronización de cuenta corriente (cada 5 min)
- Envío de órdenes a Flexus
- Jobs programados
- Manejo de errores y reintentos

**Admin Mutations:**
```graphql
mutation SyncProducts {
  syncFlexusProducts {
    success
    recordsProcessed
    errors
  }
}
```

### 5. argenta-ai-search

**Propósito:** Búsqueda predictiva con AI

**Funcionalidades:**
- Interpretación de lenguaje natural
- Mapeo de sinónimos ("óptica" = "faro" = "luz")
- Búsqueda por código OEM
- Autocompletado inteligente
- Cache de búsquedas comunes
- Analytics de búsquedas

**GraphQL Queries:**
```graphql
query AISearch($query: String!) {
  aiSearch(query: $query) {
    products { id name }
    interpretedQuery
    suggestions
  }
}
```

### 6. argenta-customer-account

**Propósito:** Gestión de cuenta corriente del cliente

**Funcionalidades:**
- Visualización de saldo actual
- Límite de crédito y disponible
- Historial de movimientos
- Facturas pendientes y vencidas
- Integración con Flexus

**GraphQL Queries:**
```graphql
query MyAccountStatement {
  myAccountStatement {
    currentBalance
    creditLimit
    availableCredit
    overdueAmount
  }
}
```

## 👥 Roles y Permisos

### 1. Cliente (Customer)
- Ver catálogo y precios de su cluster
- Solicitar cotizaciones
- Ver historial de órdenes
- Ver cuenta corriente

### 2. Vendedor (Salesperson)
- Ver y gestionar cotizaciones de sus clientes
- Modificar precios en cotizaciones
- Crear órdenes en nombre del cliente
- Dashboard de ventas

### 3. Asistente Comercial (Sales Assistant)
- Gestionar cotizaciones de todos los vendedores
- Seguimiento de órdenes
- Acceso a reportes comerciales

### 4. Gerencia (Management)
- Acceso completo al sistema
- Aprobación de precios especiales
- Configuración de clusters
- Reportes ejecutivos

## 🔐 Autenticación y Seguridad

- JWT tokens para autenticación
- RBAC (Role-Based Access Control)
- Validación de permisos en cada resolver
- HTTPS obligatorio en producción
- Rate limiting en endpoints públicos
- Protección contra SQL injection (TypeORM)

## 📊 Base de Datos

### Custom Fields

**Customer:**
- `priceCluster`: Cluster de precios (VIP, Premium, Standard, Nuevo)
- `creditLimit`: Límite de crédito
- `currentBalance`: Saldo actual
- `flexusCustomerId`: ID en Flexus ERP
- `assignedSalesperson`: Vendedor asignado

**Product:**
- `vehicleMake`: Marca del vehículo
- `vehicleModel`: Modelo del vehículo
- `vehicleYearFrom`: Año desde
- `vehicleYearTo`: Año hasta
- `oemCode`: Código OEM
- `partType`: Tipo de parte

**ProductVariant:**
- `partSide`: Lado (izquierdo/derecho/ambos)
- `partPosition`: Posición (delantero/trasero)
- `finish`: Acabado (cromado/negro/transparente)

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🚢 Deployment

### Backend (Vendure)

```bash
cd backend
npm run build
npm start
```

### Frontend (Next.js)

```bash
cd frontend
npm run build
npm start
```

### Docker Production

```bash
# Build y deploy con Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Scripts Útiles

### Backend

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Build para producción
npm start            # Iniciar en producción
npm run populate     # Poblar datos iniciales
npm run migrate      # Ejecutar migraciones
```

### Frontend

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm start            # Iniciar en producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 Configuración

### Variables de Entorno - Backend

Ver archivo `.env.example` en la carpeta `backend/`

### Variables de Entorno - Frontend

Ver archivo `.env.example` en la carpeta `frontend/`

## 📚 Recursos

- [Documentación de Vendure](https://docs.vendure.io)
- [Documentación de Next.js](https://nextjs.org/docs)
- [GraphQL](https://graphql.org/)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contribución

Este es un proyecto privado de Argenta. Para contribuir:

1. Crear una rama desde `main`
2. Hacer cambios
3. Crear Pull Request
4. Esperar revisión

## 📄 Licencia

Propiedad de Argenta - Todos los derechos reservados

---

**Desarrollado para Argenta Autopartes** 🚗💡