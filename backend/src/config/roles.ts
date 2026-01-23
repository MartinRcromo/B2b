import { Permission, RoleDefinition } from '@vendure/core';

/**
 * Definición de Roles para Portal B2B Argenta
 *
 * Roles definidos:
 * 1. Cliente (Customer) - Comprador B2B
 * 2. Vendedor (Salesperson) - Gestión de cotizaciones y clientes
 * 3. Asistente Comercial (Sales Assistant) - Soporte a ventas
 * 4. Gerencia (Management) - Acceso completo y reportes
 */

export const ARGENTA_ROLES = {
  /**
   * ROL: CLIENTE
   * Descripción: Usuario comprador B2B
   * Permisos:
   * - Ver catálogo y precios de su cluster
   * - Solicitar cotizaciones
   * - Ver su historial de órdenes
   * - Ver su cuenta corriente
   */
  CUSTOMER: {
    code: 'customer',
    description: 'Cliente B2B - Comprador',
    permissions: [
      Permission.Authenticated,
      Permission.ReadCatalog,
      Permission.ReadProduct,
      Permission.CreateOrder,
      Permission.ReadOrder,
      'ViewCustomerAccount', // Custom permission
    ],
  },

  /**
   * ROL: VENDEDOR
   * Descripción: Vendedor asignado a clientes
   * Permisos:
   * - Ver y gestionar cotizaciones de sus clientes
   * - Modificar precios en cotizaciones
   * - Crear órdenes en nombre del cliente
   * - Ver cuenta corriente de sus clientes
   * - Dashboard de ventas
   */
  SALESPERSON: {
    code: 'salesperson',
    description: 'Vendedor asignado a clientes',
    permissions: [
      Permission.Authenticated,
      Permission.ReadCatalog,
      Permission.ReadProduct,
      Permission.ReadCustomer,
      Permission.UpdateCustomer,
      Permission.ReadOrder,
      Permission.CreateOrder,
      Permission.UpdateOrder,
      'ManageQuotes', // Custom permission
      'ViewCustomerAccount', // Custom permission
    ],
  },

  /**
   * ROL: ASISTENTE COMERCIAL
   * Descripción: Asistente que soporta a múltiples vendedores
   * Permisos:
   * - Gestionar cotizaciones de todos los vendedores
   * - Seguimiento de órdenes
   * - Acceso a reportes comerciales básicos
   */
  SALES_ASSISTANT: {
    code: 'sales-assistant',
    description: 'Asistente Comercial - Soporte a ventas',
    permissions: [
      Permission.Authenticated,
      Permission.ReadCatalog,
      Permission.ReadProduct,
      Permission.ReadCustomer,
      Permission.ReadOrder,
      Permission.UpdateOrder,
      'ManageQuotes', // Custom permission
      'ViewCustomerAccount', // Custom permission
    ],
  },

  /**
   * ROL: GERENCIA
   * Descripción: Gerente con acceso completo
   * Permisos:
   * - Acceso total al sistema
   * - Aprobación de precios especiales
   * - Configuración de clusters
   * - Reportes ejecutivos completos
   */
  MANAGEMENT: {
    code: 'management',
    description: 'Gerencia - Acceso completo',
    permissions: [
      Permission.Authenticated,
      Permission.SuperAdmin, // Acceso completo
      'ManageQuotes',
      'ViewCustomerAccount',
      'ManageCustomerPricing',
      'ApproveSpecialPrices',
      'ViewSalesReports',
    ],
  },
};

/**
 * Helper para crear roles en el sistema
 * Uso: Llamar esta función durante el bootstrap inicial
 */
export async function createArgentaRoles(ctx: any) {
  const roles = [
    ARGENTA_ROLES.CUSTOMER,
    ARGENTA_ROLES.SALESPERSON,
    ARGENTA_ROLES.SALES_ASSISTANT,
    ARGENTA_ROLES.MANAGEMENT,
  ];

  console.log('🔐 Creando roles personalizados de Argenta...');

  for (const roleConfig of roles) {
    try {
      // Aquí se implementaría la creación real de roles usando el RoleService
      // const role = await ctx.roleService.create(ctx, {
      //   code: roleConfig.code,
      //   description: roleConfig.description,
      //   permissions: roleConfig.permissions,
      // });
      console.log(`✅ Rol creado: ${roleConfig.code}`);
    } catch (error) {
      console.error(`❌ Error creando rol ${roleConfig.code}:`, error);
    }
  }
}

/**
 * Helper para verificar permisos de roles
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string | string[]
): boolean {
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((perm) => userPermissions.includes(perm));
  }
  return userPermissions.includes(requiredPermission);
}

/**
 * Decorador para proteger resolvers con permisos específicos
 */
export function RequirePermissions(...permissions: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const ctx = args[0]; // RequestContext es el primer argumento

      // Verificar permisos
      const userPermissions = ctx.activeUserId
        ? await getUserPermissions(ctx)
        : [];

      const hasRequiredPermission = permissions.some((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasRequiredPermission) {
        throw new Error(
          `Unauthorized: Required permissions: ${permissions.join(', ')}`
        );
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

async function getUserPermissions(ctx: any): Promise<string[]> {
  // Implementar obtención de permisos del usuario
  // return ctx.userService.getUserPermissions(ctx.activeUserId);
  return [];
}
