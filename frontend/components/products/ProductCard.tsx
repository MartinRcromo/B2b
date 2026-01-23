'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * ProductCard Component
 *
 * Card de producto para vista en grilla
 * Muestra imagen, nombre, compatibilidad, precio y stock
 */

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    stock: number;
    vehicleMake?: string;
    vehicleModel?: string;
    oemCode?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(product.price / 100); // Vendure guarda precios en centavos

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="product-card">
        {/* Imagen */}
        <div className="relative h-48 bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-4xl">🚗</span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Compatibilidad */}
          {(product.vehicleMake || product.vehicleModel) && (
            <div className="text-xs text-gray-500 mb-2">
              {product.vehicleMake} {product.vehicleModel}
            </div>
          )}

          {/* Nombre */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Código OEM */}
          {product.oemCode && (
            <div className="text-xs text-gray-500 mb-3">
              OEM: {product.oemCode}
            </div>
          )}

          {/* Precio y Stock */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-argenta-primary">
                {formattedPrice}
              </div>
              <div className="text-xs text-gray-500">+ IVA</div>
            </div>

            <div
              className={`text-sm ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.stock > 0 ? (
                <span>
                  Stock: <strong>{product.stock}</strong>
                </span>
              ) : (
                <span className="font-semibold">Sin stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
