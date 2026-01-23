import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

/**
 * Plugin: Argenta Flexus Integration
 *
 * Funcionalidades:
 * - Sincronización de productos (stock, precios base)
 * - Sincronización de clientes (datos, cluster, cuenta corriente)
 * - Envío de órdenes a Flexus
 * - Sincronización de facturas/pagos
 * - Jobs programados para sync periódico
 * - Webhooks para actualizaciones en tiempo real
 * - Manejo de errores y reintentos
 *
 * Este plugin maneja toda la integración bidireccional con Flexus ERP.
 */

const adminApiExtensions = gql`
  extend type Query {
    """
    Obtiene el estado de la última sincronización
    """
    flexusSyncStatus: FlexusSyncStatus!

    """
    Obtiene el historial de sincronizaciones
    """
    flexusSyncHistory(options: HistoryOptions): SyncHistoryList!

    """
    Verifica la conexión con Flexus
    """
    testFlexusConnection: ConnectionTestResult!
  }

  extend type Mutation {
    """
    Fuerza una sincronización manual de productos
    """
    syncFlexusProducts: SyncResult!

    """
    Fuerza una sincronización manual de clientes
    """
    syncFlexusCustomers: SyncResult!

    """
    Fuerza una sincronización manual de cuenta corriente
    """
    syncFlexusAccountStatements: SyncResult!

    """
    Envía una orden a Flexus
    """
    sendOrderToFlexus(orderId: ID!): FlexusOrderResult!

    """
    Reinicia un job de sincronización fallido
    """
    retryFailedSync(syncId: ID!): SyncResult!
  }

  type FlexusSyncStatus {
    lastProductSync: DateTime
    lastCustomerSync: DateTime
    lastAccountSync: DateTime
    lastOrderSync: DateTime
    isConnected: Boolean!
    pendingOrders: Int!
    failedSyncs: Int!
  }

  type SyncHistoryList {
    items: [SyncHistoryEntry!]!
    totalItems: Int!
  }

  type SyncHistoryEntry {
    id: ID!
    type: String!
    status: String!
    recordsProcessed: Int!
    recordsFailed: Int!
    startedAt: DateTime!
    completedAt: DateTime
    errorMessage: String
  }

  type SyncResult {
    success: Boolean!
    recordsProcessed: Int!
    recordsFailed: Int!
    errors: [String!]
    message: String!
  }

  type FlexusOrderResult {
    success: Boolean!
    flexusOrderId: String
    message: String!
    errors: [String!]
  }

  type ConnectionTestResult {
    connected: Boolean!
    message: String!
    apiVersion: String
  }

  input HistoryOptions {
    skip: Int
    take: Int
    type: String
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      // import { FlexusIntegrationResolver } from './api/admin-resolvers';
    ],
  },
  entities: [
    // import { FlexusSyncLog } from './entities/flexus-sync-log.entity';
  ],
  providers: [
    // import { FlexusApiService } from './services/flexus-api.service';
    // import { FlexusSyncService } from './services/flexus-sync.service';
  ],
})
export class ArgentaFlexusIntegrationPlugin {
  static options = {
    apiUrl: process.env.FLEXUS_API_URL || '',
    apiKey: process.env.FLEXUS_API_KEY || '',
    syncIntervals: {
      products: 15 * 60 * 1000, // 15 minutos
      customers: 24 * 60 * 60 * 1000, // 24 horas
      accountStatements: 5 * 60 * 1000, // 5 minutos
    },
    retryAttempts: 3,
    retryDelay: 5000, // 5 segundos
  };

  static init(options: Partial<typeof ArgentaFlexusIntegrationPlugin.options>) {
    this.options = { ...this.options, ...options };
    return this;
  }
}
