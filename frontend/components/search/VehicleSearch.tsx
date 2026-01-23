'use client';

import { useState } from 'react';

/**
 * VehicleSearch Component
 *
 * Componente de búsqueda por vehículo (marca, modelo, año)
 * Permite al usuario filtrar productos por compatibilidad vehicular
 */

interface VehicleSearchProps {
  onSearch?: (filters: VehicleFilters) => void;
  className?: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: number;
}

export function VehicleSearch({ onSearch, className = '' }: VehicleSearchProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  // Datos de ejemplo - en producción vendrán de la API
  const makes = ['Ford', 'Chevrolet', 'Volkswagen', 'Toyota', 'Renault', 'Fiat'];
  const models = make ? ['Focus', 'Fiesta', 'Ranger', 'Ka'] : [];
  const years = model ? Array.from({ length: 10 }, (_, i) => 2024 - i) : [];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        make: make || undefined,
        model: model || undefined,
        year: year ? parseInt(year) : undefined,
      });
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Buscar por vehículo
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            className="input"
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel('');
              setYear('');
            }}
          >
            <option value="">Seleccionar marca</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo
          </label>
          <select
            className="input"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setYear('');
            }}
            disabled={!make}
          >
            <option value="">Seleccionar modelo</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año
          </label>
          <select
            className="input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={!model}
          >
            <option value="">Seleccionar año</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="btn-primary w-full mt-6"
        onClick={handleSearch}
        disabled={!make}
      >
        Buscar Productos
      </button>

      {/* Resumen de búsqueda */}
      {(make || model || year) && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
          <strong>Buscando:</strong>{' '}
          {[make, model, year].filter(Boolean).join(' - ')}
        </div>
      )}
    </div>
  );
}
