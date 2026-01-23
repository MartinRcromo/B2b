import { VendureConfig, DefaultLogger, LogLevel, LanguageCode, PermissionDefinition } from '@vendure/core';
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
      new PermissionDefinition({
        name: 'ManageQuotes',
        description: 'Allows managing quotes/RFQ',
      }),
      new PermissionDefinition({
        name: 'ViewCustomerAccount',
        description: 'Allows viewing customer account statements',
      }),
      new PermissionDefinition({
        name: 'ManageCustomerPricing',
        description: 'Allows managing customer-specific pricing',
      }),
      new PermissionDefinition({
        name: 'ApproveSpecialPrices',
        description: 'Allows approving special negotiated prices',
      }),
      new PermissionDefinition({
        name: 'ViewSalesReports',
        description: 'Allows viewing sales reports and analytics',
      }),
    ],
  },
  dbConnectionOptions: process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: IS_DEV,
        logging: IS_DEV,
        migrations: [path.join(__dirname, './migrations/*.ts')],
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'argenta_b2b',
        synchronize: IS_DEV,
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
        label: [{ languageCode: LanguageCode.es, value: 'Cluster de Precios' }],
        options: [
          { value: 'VIP', label: [{ languageCode: LanguageCode.es, value: 'VIP' }] },
          { value: 'Premium', label: [{ languageCode: LanguageCode.es, value: 'Premium' }] },
          { value: 'Standard', label: [{ languageCode: LanguageCode.es, value: 'Standard' }] },
          { value: 'Nuevo', label: [{ languageCode: LanguageCode.es, value: 'Nuevo' }] },
        ],
        defaultValue: 'Standard',
        public: false,
      },
      {
        name: 'creditLimit',
        type: 'int',
        label: [{ languageCode: LanguageCode.es, value: 'Límite de Crédito' }],
        defaultValue: 0,
        public: false,
      },
      {
        name: 'currentBalance',
        type: 'int',
        label: [{ languageCode: LanguageCode.es, value: 'Saldo Actual' }],
        defaultValue: 0,
        public: false,
      },
      {
        name: 'flexusCustomerId',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'ID en Flexus ERP' }],
        nullable: true,
        public: false,
      },
      {
        name: 'assignedSalesperson',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Vendedor Asignado' }],
        nullable: true,
        public: false,
      },
    ],
    Product: [
      {
        name: 'vehicleMake',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Marca del Vehículo' }],
        nullable: true,
      },
      {
        name: 'vehicleModel',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Modelo del Vehículo' }],
        nullable: true,
      },
      {
        name: 'vehicleYearFrom',
        type: 'int',
        label: [{ languageCode: LanguageCode.es, value: 'Año Desde' }],
        nullable: true,
      },
      {
        name: 'vehicleYearTo',
        type: 'int',
        label: [{ languageCode: LanguageCode.es, value: 'Año Hasta' }],
        nullable: true,
      },
      {
        name: 'oemCode',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Código OEM' }],
        nullable: true,
      },
      {
        name: 'partType',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Tipo de Parte' }],
        options: [
          { value: 'optica_delantera', label: [{ languageCode: LanguageCode.es, value: 'Óptica Delantera' }] },
          { value: 'faro_trasero', label: [{ languageCode: LanguageCode.es, value: 'Faro Trasero' }] },
          { value: 'luz_lateral', label: [{ languageCode: LanguageCode.es, value: 'Luz Lateral' }] },
          { value: 'luz_placa', label: [{ languageCode: LanguageCode.es, value: 'Luz de Placa' }] },
        ],
        nullable: true,
      },
    ],
    ProductVariant: [
      {
        name: 'partSide',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Lado' }],
        options: [
          { value: 'left', label: [{ languageCode: LanguageCode.es, value: 'Izquierdo' }] },
          { value: 'right', label: [{ languageCode: LanguageCode.es, value: 'Derecho' }] },
          { value: 'both', label: [{ languageCode: LanguageCode.es, value: 'Ambos' }] },
        ],
        nullable: true,
      },
      {
        name: 'partPosition',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Posición' }],
        options: [
          { value: 'front', label: [{ languageCode: LanguageCode.es, value: 'Delantero' }] },
          { value: 'rear', label: [{ languageCode: LanguageCode.es, value: 'Trasero' }] },
        ],
        nullable: true,
      },
      {
        name: 'finish',
        type: 'string',
        label: [{ languageCode: LanguageCode.es, value: 'Acabado' }],
        options: [
          { value: 'chrome', label: [{ languageCode: LanguageCode.es, value: 'Cromado' }] },
          { value: 'black', label: [{ languageCode: LanguageCode.es, value: 'Negro' }] },
          { value: 'transparent', label: [{ languageCode: LanguageCode.es, value: 'Transparente' }] },
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
      assetUrlPrefix: IS_DEV
        ? 'http://localhost:3000/assets/'
        : `${process.env.APP_URL || 'https://argenta-b2b.up.railway.app'}/assets/`,
    }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../email-output'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"Argenta Autopartes" <noreply@argenta.com>',
      },
    } as const),
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
