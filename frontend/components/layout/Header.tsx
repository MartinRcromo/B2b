'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getActiveCustomer } from '@/lib/vendure-client';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export default function Header() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we have a token stored
      const token = typeof window !== 'undefined' ? localStorage.getItem('vendure-auth-token') : null;

      if (token) {
        const result: any = await getActiveCustomer();
        console.log('Active customer:', result);

        if (result?.activeCustomer) {
          setCustomer(result.activeCustomer);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vendure-auth-token');
    }
    setCustomer(null);
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div>
              <h1 className="text-3xl font-bold text-argenta-primary">
                Argenta Autopartes
              </h1>
              <p className="text-gray-600 mt-1">Portal B2B para distribuidores</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            {loading ? (
              <span className="text-gray-400">Cargando...</span>
            ) : customer ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-argenta-primary">
                  Mi Cuenta
                </Link>
                <Link href="/pedidos" className="text-gray-700 hover:text-argenta-primary">
                  Pedidos
                </Link>
                <Link href="/carrito" className="text-gray-700 hover:text-argenta-primary">
                  Carrito
                </Link>
                <span className="text-gray-600">
                  Hola, <strong>{customer.firstName}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary">
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
