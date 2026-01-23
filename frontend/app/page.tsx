import Link from 'next/link';

/**
 * Home Page - Portal B2B Argenta
 *
 * Página de inicio del portal que muestra:
 * - Bienvenida
 * - Acceso rápido a búsqueda por vehículo
 * - Categorías destacadas
 * - Información de cuenta (para usuarios logueados)
 */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-argenta-primary">
                Argenta Autopartes
              </h1>
              <p className="text-gray-600 mt-1">Portal B2B para distribuidores</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/login" className="btn-primary">
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-argenta-primary to-argenta-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Bienvenido al Portal B2B de Argenta
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Encuentra las autopartes que necesitas para tu negocio
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-800 text-lg font-semibold mb-4">
                Buscar por vehículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="input text-gray-800">
                  <option>Marca</option>
                  <option>Ford</option>
                  <option>Chevrolet</option>
                  <option>Volkswagen</option>
                </select>
                <select className="input text-gray-800">
                  <option>Modelo</option>
                </select>
                <select className="input text-gray-800">
                  <option>Año</option>
                </select>
              </div>
              <button className="btn-primary w-full mt-4">
                Buscar Productos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">
            ¿Por qué elegir Argenta?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h4 className="text-xl font-semibold mb-2">Amplio Catálogo</h4>
              <p className="text-gray-600">
                Ópticas y faros para todas las marcas y modelos
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2">Precios B2B</h4>
              <p className="text-gray-600">
                Precios especiales para distribuidores según tu cluster
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-xl font-semibold mb-2">Cotizaciones Rápidas</h4>
              <p className="text-gray-600">
                Solicita y gestiona tus cotizaciones online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Argenta Autopartes. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
