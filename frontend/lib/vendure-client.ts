import { GraphQLClient } from 'graphql-request';

/**
 * Vendure GraphQL Client
 *
 * Cliente configurado para conectarse con el backend de Vendure.
 * Maneja autenticación con tokens y cookies.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SHOP_API_PATH =
  process.env.NEXT_PUBLIC_SHOP_API_PATH || '/shop-api';

export const vendureClient = new GraphQLClient(
  `${API_URL}${SHOP_API_PATH}`,
  {
    credentials: 'include', // Importante para cookies de sesión
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

/**
 * Cliente para Admin API (usado por vendedores y gerencia)
 */
const ADMIN_API_PATH =
  process.env.NEXT_PUBLIC_ADMIN_API_PATH || '/admin-api';

export const vendureAdminClient = new GraphQLClient(
  `${API_URL}${ADMIN_API_PATH}`,
  {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

/**
 * Helper para establecer el token de autenticación
 */
export function setAuthToken(token: string) {
  vendureClient.setHeader('Authorization', `Bearer ${token}`);
  vendureAdminClient.setHeader('Authorization', `Bearer ${token}`);
}

/**
 * Helper para limpiar el token de autenticación
 */
export function clearAuthToken() {
  vendureClient.setHeader('Authorization', '');
  vendureAdminClient.setHeader('Authorization', '');
}

/**
 * Tipos TypeScript para las queries más comunes
 */

// Query: Obtener productos
export const GET_PRODUCTS_QUERY = `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          preview
        }
        variants {
          id
          name
          sku
          price
          priceWithTax
          stockLevel
        }
        customFields {
          vehicleMake
          vehicleModel
          vehicleYearFrom
          vehicleYearTo
          oemCode
          partType
        }
      }
      totalItems
    }
  }
`;

// Query: Obtener un producto por ID
export const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID, $slug: String) {
    product(id: $id, slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        preview
      }
      assets {
        preview
      }
      variants {
        id
        name
        sku
        price
        priceWithTax
        stockLevel
        customFields {
          partSide
          partPosition
          finish
        }
      }
      customFields {
        vehicleMake
        vehicleModel
        vehicleYearFrom
        vehicleYearTo
        oemCode
        partType
      }
    }
  }
`;

// Mutation: Login
export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

// Query: Usuario actual
export const GET_ACTIVE_CUSTOMER_QUERY = `
  query GetActiveCustomer {
    activeCustomer {
      id
      firstName
      lastName
      emailAddress
      customFields {
        priceCluster
        creditLimit
        currentBalance
        assignedSalesperson
      }
    }
  }
`;

// Query: Cuenta corriente
export const GET_ACCOUNT_STATEMENT_QUERY = `
  query GetAccountStatement {
    myAccountStatement {
      currentBalance
      creditLimit
      availableCredit
      overdueAmount
      currency
      lastUpdated
    }
  }
`;

// Query: Cotizaciones
export const GET_MY_QUOTES_QUERY = `
  query GetMyQuotes($options: QuoteListOptions) {
    myQuotes(options: $options) {
      items {
        id
        code
        status
        subtotal
        total
        createdAt
        validUntil
      }
      totalItems
    }
  }
`;

/**
 * Helper functions para queries comunes
 */

export async function getProducts(options?: any) {
  return vendureClient.request(GET_PRODUCTS_QUERY, { options });
}

export async function getProduct(idOrSlug: string) {
  const isId = /^[0-9]+$/.test(idOrSlug);
  const variables = isId
    ? { id: idOrSlug, slug: undefined }
    : { id: undefined, slug: idOrSlug };
  return vendureClient.request(GET_PRODUCT_QUERY, variables as any);
}

export async function login(username: string, password: string) {
  return vendureClient.request(LOGIN_MUTATION, { username, password });
}

export async function getActiveCustomer() {
  return vendureClient.request(GET_ACTIVE_CUSTOMER_QUERY);
}
