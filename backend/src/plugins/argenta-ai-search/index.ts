import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';

/**
 * Plugin: Argenta AI Search
 *
 * Funcionalidades:
 * - Búsqueda predictiva con AI (Claude/OpenAI)
 * - Interpretación de sinónimos ("óptica" = "faro" = "luz")
 * - Búsqueda por código OEM
 * - Búsqueda por descripción natural
 * - Autocompletado inteligente
 * - Cache de búsquedas comunes
 * - Logging y analytics de búsquedas
 *
 * Este plugin implementa la búsqueda con AI para mejorar la experiencia
 * de búsqueda de productos con lenguaje natural.
 */

const shopApiExtensions = gql`
  extend type Query {
    """
    Búsqueda inteligente con AI
    """
    aiSearch(query: String!, limit: Int): AISearchResult!

    """
    Autocompletado inteligente
    """
    aiAutocomplete(query: String!, limit: Int): [AutocompleteSuggestion!]!

    """
    Búsqueda por código OEM con sugerencias
    """
    searchByOEM(code: String!): [Product!]!

    """
    Obtiene sugerencias basadas en historial del cliente
    """
    personalizedSuggestions(limit: Int): [Product!]!
  }

  type AISearchResult {
    products: [Product!]!
    totalItems: Int!
    interpretedQuery: String!
    suggestions: [String!]
    didYouMean: String
  }

  type AutocompleteSuggestion {
    text: String!
    type: String!
    metadata: SuggestionMetadata
  }

  type SuggestionMetadata {
    vehicleMake: String
    vehicleModel: String
    partType: String
  }
`;

const adminApiExtensions = gql`
  extend type Query {
    """
    Obtiene estadísticas de búsquedas
    """
    searchAnalytics(from: DateTime!, to: DateTime!): SearchAnalytics!

    """
    Obtiene las búsquedas más comunes
    """
    topSearchQueries(limit: Int): [SearchQueryStats!]!

    """
    Obtiene búsquedas sin resultados
    """
    searchesWithNoResults(limit: Int): [NoResultSearch!]!
  }

  extend type Mutation {
    """
    Configura sinónimos personalizados
    """
    configureSynonyms(input: SynonymConfigInput!): SynonymConfig!

    """
    Limpia el cache de búsquedas
    """
    clearSearchCache: Boolean!
  }

  type SearchAnalytics {
    totalSearches: Int!
    uniqueQueries: Int!
    averageResultsPerSearch: Float!
    searchesWithNoResults: Int!
    topQueries: [String!]!
  }

  type SearchQueryStats {
    query: String!
    count: Int!
    avgResultCount: Int!
  }

  type NoResultSearch {
    query: String!
    timestamp: DateTime!
    customer: Customer
  }

  type SynonymConfig {
    id: ID!
    word: String!
    synonyms: [String!]!
  }

  input SynonymConfigInput {
    word: String!
    synonyms: [String!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      // import { AISearchShopResolver } from './api/shop-resolvers';
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      // import { AISearchAdminResolver } from './api/admin-resolvers';
    ],
  },
  entities: [
    // import { SearchLog } from './entities/search-log.entity';
    // import { SynonymConfig } from './entities/synonym-config.entity';
  ],
  providers: [
    // import { AISearchService } from './services/ai-search.service';
    // import { OpenAIService } from './services/openai.service';
  ],
})
export class ArgentaAiSearchPlugin {
  static options = {
    provider: 'openai', // 'openai' | 'claude'
    apiKey: process.env.OPENAI_API_KEY || process.env.CLAUDE_API_KEY || '',
    model: 'gpt-4-turbo-preview',
    enableCache: true,
    cacheExpiration: 24 * 60 * 60 * 1000, // 24 horas
    logSearches: true,
    synonyms: {
      'óptica': ['faro', 'luz', 'farol', 'optica'],
      'delantera': ['frontal', 'adelante', 'front'],
      'trasera': ['posterior', 'atrás', 'rear'],
      'izquierda': ['izquierdo', 'left', 'lado del conductor'],
      'derecha': ['derecho', 'right', 'lado del acompañante'],
    },
  };

  static init(options: Partial<typeof ArgentaAiSearchPlugin.options>) {
    this.options = { ...this.options, ...options };
    return this;
  }
}
