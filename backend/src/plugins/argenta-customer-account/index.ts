import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

/**
 * Plugin: Argenta Customer Account
 *
 * Funcionalidades:
 * - Visualización de cuenta corriente
 * - Saldo actual (debe/haber)
 * - Límite de crédito y crédito disponible
 * - Historial de movimientos (facturas, pagos, notas)
 * - Facturas pendientes y vencidas
 * - Integración con Flexus para datos en tiempo real
 * - Dashboard de métricas para clientes
 *
 * Este plugin gestiona toda la información financiera del cliente B2B.
 */

const shopApiExtensions = gql`
  extend type Query {
    """
    Obtiene el estado de cuenta del cliente actual
    """
    myAccountStatement: AccountStatement!

    """
    Obtiene el historial de movimientos
    """
    myAccountMovements(options: MovementOptions): AccountMovementList!

    """
    Obtiene facturas pendientes de pago
    """
    myPendingInvoices: [Invoice!]!

    """
    Obtiene facturas vencidas
    """
    myOverdueInvoices: [Invoice!]!
  }

  type AccountStatement {
    currentBalance: Int!
    creditLimit: Int!
    availableCredit: Int!
    overdueAmount: Int!
    currency: String!
    lastUpdated: DateTime!
  }

  type AccountMovementList {
    items: [AccountMovement!]!
    totalItems: Int!
  }

  type AccountMovement {
    id: ID!
    date: DateTime!
    type: MovementType!
    description: String!
    reference: String
    debit: Int
    credit: Int
    balance: Int!
    relatedInvoice: Invoice
  }

  enum MovementType {
    INVOICE
    PAYMENT
    CREDIT_NOTE
    DEBIT_NOTE
    ADJUSTMENT
  }

  type Invoice {
    id: ID!
    invoiceNumber: String!
    date: DateTime!
    dueDate: DateTime!
    amount: Int!
    paidAmount: Int!
    balance: Int!
    status: InvoiceStatus!
    isOverdue: Boolean!
    daysOverdue: Int
  }

  enum InvoiceStatus {
    PENDING
    PARTIALLY_PAID
    PAID
    OVERDUE
    CANCELLED
  }

  input MovementOptions {
    skip: Int
    take: Int
    from: DateTime
    to: DateTime
    type: MovementType
  }
`;

const adminApiExtensions = gql`
  extend type Query {
    """
    Obtiene el estado de cuenta de un cliente específico
    """
    customerAccountStatement(customerId: ID!): AccountStatement!

    """
    Obtiene movimientos de un cliente específico
    """
    customerAccountMovements(
      customerId: ID!
      options: MovementOptions
    ): AccountMovementList!

    """
    Obtiene reportes de cuenta corriente
    """
    accountStatementReports(options: ReportOptions): AccountReportList!
  }

  extend type Mutation {
    """
    Actualiza el límite de crédito de un cliente
    """
    updateCreditLimit(customerId: ID!, newLimit: Int!): Customer!

    """
    Registra un pago manual (para uso interno)
    """
    registerPayment(input: RegisterPaymentInput!): AccountMovement!

    """
    Registra una nota de crédito/débito
    """
    registerNote(input: RegisterNoteInput!): AccountMovement!
  }

  input RegisterPaymentInput {
    customerId: ID!
    amount: Int!
    reference: String!
    date: DateTime
    notes: String
  }

  input RegisterNoteInput {
    customerId: ID!
    type: MovementType!
    amount: Int!
    description: String!
    reference: String
  }

  type AccountReportList {
    items: [AccountReport!]!
    totalItems: Int!
  }

  type AccountReport {
    customer: Customer!
    balance: Int!
    creditLimit: Int!
    overdueAmount: Int!
    lastPaymentDate: DateTime
  }

  input ReportOptions {
    skip: Int
    take: Int
    minBalance: Int
    maxBalance: Int
    hasOverdue: Boolean
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      // import { CustomerAccountShopResolver } from './api/shop-resolvers';
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      // import { CustomerAccountAdminResolver } from './api/admin-resolvers';
    ],
  },
  entities: [
    // import { AccountMovement } from './entities/account-movement.entity';
    // import { Invoice } from './entities/invoice.entity';
  ],
  providers: [
    // import { AccountStatementService } from './services/account-statement.service';
  ],
})
export class ArgentaCustomerAccountPlugin {
  static options = {
    defaultCurrency: 'ARS',
    enableRealTimeSync: true,
    alertOnOverdue: true,
    overdueDaysThreshold: 30,
  };
}
