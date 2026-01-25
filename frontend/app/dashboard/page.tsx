'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { getActiveCustomer } from '@/lib/vendure-client';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  customFields?: {
    priceCluster?: string;
    creditLimit?: number;
    currentBalance?: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('vendure-auth-token') : null;

      if (!token) {
        router.push('/login');
        return;
      }

      const result: any = await getActiveCustomer();
      console.log('Dashboard - Active customer:', result);

      if (result?.activeCustomer) {
        setCustomer(result.activeCustomer);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Bienvenido, {customer.firstName}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Mi Información</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Nombre:</strong> {customer.firstName} {customer.lastName}</p>
              <p><strong>Email:</strong> {customer.emailAddress}</p>
              {customer.phoneNumber && (
                <p><strong>Teléfono:</strong> {customer.phoneNumber}</p>
              )}
              {customer.customFields?.priceCluster && (
                <p>
                  <strong>Cluster:</strong>{' '}
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {customer.customFields.priceCluster}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Credit Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Estado de Cuenta</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Límite de Crédito</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(customer.customFields?.creditLimit || 0).toLocaleString('es-AR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Saldo Actual</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${(customer.customFields?.currentBalance || 0).toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <a
                href="/productos"
                className="block w-full bg-argenta-primary text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Catálogo
              </a>
              <a
                href="/pedidos"
                className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Mis Pedidos
              </a>
              <a
                href="/cotizaciones"
                className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Nueva Cotización
              </a>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pedidos Recientes</h2>
          <div className="text-center text-gray-500 py-8">
            <p>No tienes pedidos recientes.</p>
            <a href="/productos" className="text-argenta-primary hover:underline mt-2 inline-block">
              Explorar catálogo
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
