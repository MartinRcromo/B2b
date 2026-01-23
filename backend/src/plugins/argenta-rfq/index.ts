import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

/**
 * Plugin: Argenta RFQ (Request for Quote)
 *
 * Funcionalidades:
 * - Sistema de cotizaciones B2B
 * - Flujo de estados: Pendiente → En Revisión → Enviada → Aceptada/Rechazada
 * - Negociación de precios entre vendedor y cliente
 * - Conversión de cotización a orden
 * - Notificaciones por email
 * - Historial de cambios en cotizaciones
 *
 * Este plugin implementa el sistema completo de cotizaciones para el portal B2B.
 */

const commonSchema = gql`
  enum QuoteStatus {
    PENDING
    IN_REVIEW
    SENT_TO_CUSTOMER
    ACCEPTED
    REJECTED
    CONVERTED_TO_ORDER
    EXPIRED
  }

  type Quote {
    id: ID!
    code: String!
    customer: Customer!
    assignedSalesperson: User
    status: QuoteStatus!
    items: [QuoteItem!]!
    subtotal: Int!
    shipping: Int!
    total: Int!
    notes: String
    internalNotes: String
    validUntil: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    history: [QuoteHistoryEntry!]!
  }

  type QuoteItem {
    id: ID!
    productVariant: ProductVariant!
    quantity: Int!
    unitPrice: Int!
    discount: Int!
    total: Int!
  }

  type QuoteHistoryEntry {
    id: ID!
    type: String!
    message: String!
    createdBy: User
    createdAt: DateTime!
  }
`;

const shopApiExtensions = gql`
  ${commonSchema}

  extend type Query {
    """
    Obtiene todas las cotizaciones del cliente actual
    """
    myQuotes(options: QuoteListOptions): QuoteList!

    """
    Obtiene una cotización específica
    """
    quote(id: ID!): Quote
  }

  extend type Mutation {
    """
    Crea una nueva solicitud de cotización
    """
    requestQuote(input: RequestQuoteInput!): Quote!

    """
    Acepta una cotización y la convierte en orden
    """
    acceptQuote(quoteId: ID!): Order!

    """
    Rechaza una cotización con comentarios
    """
    rejectQuote(quoteId: ID!, reason: String!): Quote!

    """
    Agrega un comentario/mensaje a una cotización
    """
    addQuoteComment(quoteId: ID!, comment: String!): Quote!
  }

  input RequestQuoteInput {
    items: [QuoteItemInput!]!
    notes: String
    shippingAddress: CreateAddressInput!
  }

  input QuoteItemInput {
    productVariantId: ID!
    quantity: Int!
  }

  type QuoteList {
    items: [Quote!]!
    totalItems: Int!
  }

  input QuoteListOptions {
    skip: Int
    take: Int
    status: QuoteStatus
  }
`;

const adminApiExtensions = gql`
  ${commonSchema}

  extend type Query {
    """
    Obtiene todas las cotizaciones (con filtros)
    """
    quotes(options: QuoteListOptions): QuoteList!

    """
    Obtiene cotizaciones asignadas al vendedor actual
    """
    myAssignedQuotes(options: QuoteListOptions): QuoteList!
  }

  extend type Mutation {
    """
    Actualiza una cotización (vendedor)
    """
    updateQuote(id: ID!, input: UpdateQuoteInput!): Quote!

    """
    Modifica el precio de un item en la cotización
    """
    updateQuoteItemPrice(
      quoteId: ID!
      itemId: ID!
      newPrice: Int!
    ): Quote!

    """
    Envía la cotización al cliente
    """
    sendQuoteToCustomer(quoteId: ID!): Quote!

    """
    Asigna una cotización a un vendedor
    """
    assignQuoteToSalesperson(
      quoteId: ID!
      salespersonId: ID!
    ): Quote!

    """
    Marca una cotización como expirada
    """
    expireQuote(quoteId: ID!): Quote!
  }

  input UpdateQuoteInput {
    items: [UpdateQuoteItemInput!]
    notes: String
    internalNotes: String
    validUntil: DateTime
    shipping: Int
  }

  input UpdateQuoteItemInput {
    id: ID!
    quantity: Int
    unitPrice: Int
    discount: Int
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      // import { RfqShopResolver } from './api/shop-resolvers';
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      // import { RfqAdminResolver } from './api/admin-resolvers';
    ],
  },
  entities: [
    // import { Quote } from './entities/quote.entity';
    // import { QuoteItem } from './entities/quote-item.entity';
    // import { QuoteHistoryEntry } from './entities/quote-history-entry.entity';
  ],
})
export class ArgentaRfqPlugin {
  static options = {
    defaultQuoteValidityDays: 30,
    enableAutoExpiration: true,
    notifyOnNewQuote: true,
    notifyOnQuoteUpdate: true,
  };
}
