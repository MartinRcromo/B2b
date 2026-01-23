import { VendureConfig, DefaultLogger, LogLevel } from '@vendure/core';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuración de Vendure para Portal B2B Argenta
 *
 * Esta configuración incluye:
 * - Conexión a PostgreSQL
 * - Plugins de Admin UI y Asset Server
 * - Plugin de Email con templates personalizados
 * - Configuración de autenticación y permisos
 * - Custom plugins para funcionalidad B2B
 */

const IS_DEV = process.env.NODE_ENV !== 'production';

export const config: VendureConfig = {
  apiOptions: {
    port: parseInt(process.env.PORT || '3000'),
    adminApiPath: process.env.ADMIN_API_PATH || 'admin-api',
    shopApiPath: process.env.SHOP_API_PATH || 'shop-api',
    adminApiPlayground: IS_DEV,
    adminApiDebug: IS_DEV,
    shopApiPlayground: IS_DEV,
    shopApiDebug: IS_DEV,
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    requireVerification: false, // En producción cambiar a true
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || 'change-me-in-production',
      httpOnly: true,
      sameSite: 'lax',
    },
    customPermissions: [
      // Permisos personalizados para roles B2B
      {
        name: 'ManageQuotes',
        description: 'Allows managing quotes/RFQ',
      },
      {
        name: 'ViewCustomerAccount',
        description: 'Allows viewing customer account statements',
      },
      {
        name: 'ManageCustomerPricing',
        description: 'Allows managing customer-specific pricing',
      },
      {
        name: 'ApproveSpecialPrices',
        description: 'Allows approving special negotiated prices',
      },
      {
        name: 'ViewSalesReports',
        description: 'Allows viewing sales reports and analytics',
      },
    ],
  },
  dbConnectionOptions: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'argenta_b2b',
    synchronize: IS_DEV, // En producción usar migraciones
    logging: IS_DEV,
    migrations: [path.join(__dirname, './migrations/*.ts')],
  },
  paymentOptions: {
    paymentMethodHandlers: [
      // Los pagos se manejan offline, pero mantenemos handlers básicos
    ],
  },
  customFields: {
    // Custom fields globales - cada plugin agregará los suyos
    Customer: [
      {
        name: 'priceCluster',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Cluster de Precios' }],
        options: [
          { value: 'VIP', label: [{ languageCode: 'es', value: 'VIP' }] },
          { value: 'Premium', label: [{ languageCode: 'es', value: 'Premium' }] },
          { value: 'Standard', label: [{ languageCode: 'es', value: 'Standard' }] },
          { value: 'Nuevo', label: [{ languageCode: 'es', value: 'Nuevo' }] },
        ],
        defaultValue: 'Standard',
        public: false,
      },
      {
        name: 'creditLimit',
        type: 'int',
        label: [{ languageCode: 'es', value: 'Límite de Crédito' }],
        defaultValue: 0,
        public: false,
      },
      {
        name: 'currentBalance',
        type: 'int',
        label: [{ languageCode: 'es', value: 'Saldo Actual' }],
        defaultValue: 0,
        public: false,
      },
      {
        name: 'flexusCustomerId',
        type: 'string',
        label: [{ languageCode: 'es', value: 'ID en Flexus ERP' }],
        nullable: true,
        public: false,
      },
      {
        name: 'assignedSalesperson',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Vendedor Asignado' }],
        nullable: true,
        public: false,
      },
    ],
    Product: [
      {
        name: 'vehicleMake',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Marca del Vehículo' }],
        nullable: true,
      },
      {
        name: 'vehicleModel',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Modelo del Vehículo' }],
        nullable: true,
      },
      {
        name: 'vehicleYearFrom',
        type: 'int',
        label: [{ languageCode: 'es', value: 'Año Desde' }],
        nullable: true,
      },
      {
        name: 'vehicleYearTo',
        type: 'int',
        label: [{ languageCode: 'es', value: 'Año Hasta' }],
        nullable: true,
      },
      {
        name: 'oemCode',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Código OEM' }],
        nullable: true,
      },
      {
        name: 'partType',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Tipo de Parte' }],
        options: [
          { value: 'optica_delantera', label: [{ languageCode: 'es', value: 'Óptica Delantera' }] },
          { value: 'faro_trasero', label: [{ languageCode: 'es', value: 'Faro Trasero' }] },
          { value: 'luz_lateral', label: [{ languageCode: 'es', value: 'Luz Lateral' }] },
          { value: 'luz_placa', label: [{ languageCode: 'es', value: 'Luz de Placa' }] },
        ],
        nullable: true,
      },
    ],
    ProductVariant: [
      {
        name: 'partSide',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Lado' }],
        options: [
          { value: 'left', label: [{ languageCode: 'es', value: 'Izquierdo' }] },
          { value: 'right', label: [{ languageCode: 'es', value: 'Derecho' }] },
          { value: 'both', label: [{ languageCode: 'es', value: 'Ambos' }] },
        ],
        nullable: true,
      },
      {
        name: 'partPosition',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Posición' }],
        options: [
          { value: 'front', label: [{ languageCode: 'es', value: 'Delantero' }] },
          { value: 'rear', label: [{ languageCode: 'es', value: 'Trasero' }] },
        ],
        nullable: true,
      },
      {
        name: 'finish',
        type: 'string',
        label: [{ languageCode: 'es', value: 'Acabado' }],
        options: [
          { value: 'chrome', label: [{ languageCode: 'es', value: 'Cromado' }] },
          { value: 'black', label: [{ languageCode: 'es', value: 'Negro' }] },
          { value: 'transparent', label: [{ languageCode: 'es', value: 'Transparente' }] },
        ],
        nullable: true,
      },
    ],
  },
  logger: new DefaultLogger({ level: IS_DEV ? LogLevel.Debug : LogLevel.Info }),
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      assetUrlPrefix: IS_DEV ? 'http://localhost:3000/assets/' : 'https://argenta.com/assets/',
    }),
    EmailPlugin.init({
      devMode: IS_DEV,
      outputPath: path.join(__dirname, '../email-output'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"Argenta Autopartes" <noreply@argenta.com>',
      },
    }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
      app: {
        path: path.join(__dirname, '../admin-ui/dist'),
      },
    }),
    // Los custom plugins se agregarán aquí
    // ArgentaAutopartsCatalogPlugin,
    // ArgentaCustomerPricingPlugin,
    // ArgentaRfqPlugin,
    // ArgentaFlexusIntegrationPlugin,
    // ArgentaAiSearchPlugin,
    // ArgentaCustomerAccountPlugin,
  ],
};
