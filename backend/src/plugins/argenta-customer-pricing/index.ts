import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

/**
 * Plugin: Argenta Customer Pricing
 *
 * Funcionalidades:
 * - Precios diferenciados por cluster de cliente (VIP, Premium, Standard, Nuevo)
 * - Precios negociados específicos por cliente
 * - Descuentos por volumen
 * - Custom price calculation strategy
 * - Admin UI para gestión de precios
 *
 * Este plugin implementa la lógica de pricing B2B con clusters de clientes
 * y precios especiales negociados.
 */

const shopApiExtensions = gql`
  extend type Query {
    """
    Obtiene el precio efectivo para el cliente actual
    """
    effectivePrice(productVariantId: ID!): EffectivePrice!

    """
    Obtiene los precios de múltiples variantes para el cliente actual
    """
    effectivePrices(productVariantIds: [ID!]!): [EffectivePrice!]!

    """
    Obtiene información del cluster del cliente
    """
    myPriceCluster: CustomerPriceCluster!
  }

  type EffectivePrice {
    productVariantId: ID!
    basePrice: Int!
    clusterDiscount: Int!
    volumeDiscount: Int!
    negotiatedPrice: Int
    finalPrice: Int!
    currency: String!
  }

  type CustomerPriceCluster {
    cluster: String!
    discountPercentage: Int!
    hasNegotiatedPrices: Boolean!
  }
`;

const adminApiExtensions = gql`
  extend type Mutation {
    """
    Establece un precio negociado para un cliente específico
    """
    setNegotiatedPrice(
      customerId: ID!
      productVariantId: ID!
      price: Int!
      validUntil: DateTime
    ): NegotiatedPrice!

    """
    Actualiza el cluster de precios de un cliente
    """
    updateCustomerPriceCluster(
      customerId: ID!
      cluster: String!
    ): Customer!

    """
    Configura descuentos por volumen para un producto
    """
    setVolumeDiscounts(
      productVariantId: ID!
      discounts: [VolumeDiscountInput!]!
    ): ProductVariant!
  }

  input VolumeDiscountInput {
    quantity: Int!
    discountPercentage: Int!
  }

  type NegotiatedPrice {
    id: ID!
    customer: Customer!
    productVariant: ProductVariant!
    price: Int!
    validUntil: DateTime
    createdAt: DateTime!
    createdBy: Administrator!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      // import { CustomerPricingShopResolver } from './api/shop-resolvers';
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      // import { CustomerPricingAdminResolver } from './api/admin-resolvers';
    ],
  },
  entities: [
    // import { NegotiatedPrice } from './entities/negotiated-price.entity';
    // import { VolumeDiscount } from './entities/volume-discount.entity';
  ],
})
export class ArgentaCustomerPricingPlugin {
  static options = {
    // Configuración de clusters
    clusters: {
      VIP: { discountPercentage: 25 },
      Premium: { discountPercentage: 15 },
      Standard: { discountPercentage: 5 },
      Nuevo: { discountPercentage: 0 },
    },
  };
}
