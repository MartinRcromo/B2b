import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

/**
 * Plugin: Argenta Autoparts Catalog
 *
 * Funcionalidades:
 * - Búsqueda avanzada por vehículo (marca/modelo/año)
 * - Custom fields para productos de autopartes
 * - Resolvers GraphQL para búsqueda optimizada
 * - Filtros especializados para el catálogo
 *
 * Este plugin extiende el catálogo estándar de Vendure para soportar
 * la búsqueda y filtrado específico de autopartes por compatibilidad vehicular.
 */

const shopApiExtensions = gql`
  extend type Query {
    """
    Busca productos por compatibilidad vehicular
    """
    searchByVehicle(
      make: String
      model: String
      yearFrom: Int
      yearTo: Int
      partType: String
    ): ProductList!

    """
    Obtiene todas las marcas de vehículos disponibles
    """
    vehicleMakes: [String!]!

    """
    Obtiene todos los modelos de una marca específica
    """
    vehicleModels(make: String!): [String!]!

    """
    Obtiene el rango de años disponibles para un modelo
    """
    vehicleYears(make: String!, model: String!): VehicleYearRange!
  }

  type VehicleYearRange {
    from: Int!
    to: Int!
  }

  type ProductList {
    items: [Product!]!
    totalItems: Int!
  }
`;

const adminApiExtensions = gql`
  extend type Query {
    """
    Estadísticas del catálogo de autopartes
    """
    autopartsCatalogStats: CatalogStats!
  }

  type CatalogStats {
    totalProducts: Int!
    productsByMake: [MakeCount!]!
    productsByType: [TypeCount!]!
  }

  type MakeCount {
    make: String!
    count: Int!
  }

  type TypeCount {
    type: String!
    count: Int!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      // Los resolvers se implementarán en archivos separados
      // import { AutopartsCatalogShopResolver } from './api/shop-resolvers';
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      // import { AutopartsCatalogAdminResolver } from './api/admin-resolvers';
    ],
  },
})
export class ArgentaAutopartsCatalogPlugin {
  static options = {
    // Configuración del plugin
    enableAdvancedSearch: true,
    cacheSearchResults: true,
  };
}
