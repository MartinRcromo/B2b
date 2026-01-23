import { populate as vendurePopulate, LanguageCode } from '@vendure/core';
import { config } from './vendure-config';

/**
 * Script de población inicial de datos para Argenta B2B
 *
 * Este script:
 * - Crea el superadmin
 * - Crea roles personalizados (Cliente, Vendedor, Asistente Comercial, Gerencia)
 * - Crea productos de ejemplo (ópticas y faros)
 * - Crea clientes de ejemplo con diferentes clusters
 */

const initialData = {
  paymentMethods: [],
  shippingMethods: [
    {
      name: 'Transporte Argenta',
      price: 0,
    },
    {
      name: 'Retiro en Planta',
      price: 0,
    },
    {
      name: 'Transporte Tercerizado',
      price: 0,
    },
  ],
  countries: [
    {
      name: 'Argentina',
      code: 'AR',
      zone: 'América del Sur',
    },
  ],
  collections: [
    {
      name: 'Ópticas Delanteras',
      slug: 'opticas-delanteras',
      description: 'Ópticas y faros delanteros para vehículos',
      filters: [
        {
          code: 'facet-value-filter',
          args: {
            facetValueNames: ['Óptica Delantera'],
            containsAny: false,
          },
        },
      ],
    },
    {
      name: 'Faros Traseros',
      slug: 'faros-traseros',
      description: 'Faros traseros para vehículos',
      filters: [
        {
          code: 'facet-value-filter',
          args: {
            facetValueNames: ['Faro Trasero'],
            containsAny: false,
          },
        },
      ],
    },
  ],
};

const productData = [
  {
    name: 'Óptica Delantera Ford Focus 2015-2018',
    slug: 'optica-delantera-ford-focus-2015-2018',
    description: 'Óptica delantera compatible con Ford Focus años 2015-2018. Disponible en versión izquierda y derecha.',
    facets: {
      'Tipo de Parte': 'Óptica Delantera',
      'Marca': 'Ford',
      'Modelo': 'Focus',
    },
    customFields: {
      vehicleMake: 'Ford',
      vehicleModel: 'Focus',
      vehicleYearFrom: 2015,
      vehicleYearTo: 2018,
      oemCode: 'FF-OPT-001',
      partType: 'optica_delantera',
    },
    variants: [
      {
        name: 'Lado Izquierdo',
        sku: 'FF-OPT-001-L',
        price: 25000,
        stock: 50,
        customFields: {
          partSide: 'left',
          partPosition: 'front',
          finish: 'transparent',
        },
      },
      {
        name: 'Lado Derecho',
        sku: 'FF-OPT-001-R',
        price: 25000,
        stock: 50,
        customFields: {
          partSide: 'right',
          partPosition: 'front',
          finish: 'transparent',
        },
      },
    ],
  },
  {
    name: 'Faro Trasero Chevrolet Cruze 2016-2020',
    slug: 'faro-trasero-chevrolet-cruze-2016-2020',
    description: 'Faro trasero compatible con Chevrolet Cruze años 2016-2020.',
    facets: {
      'Tipo de Parte': 'Faro Trasero',
      'Marca': 'Chevrolet',
      'Modelo': 'Cruze',
    },
    customFields: {
      vehicleMake: 'Chevrolet',
      vehicleModel: 'Cruze',
      vehicleYearFrom: 2016,
      vehicleYearTo: 2020,
      oemCode: 'CC-FAR-001',
      partType: 'faro_trasero',
    },
    variants: [
      {
        name: 'Lado Izquierdo',
        sku: 'CC-FAR-001-L',
        price: 18000,
        stock: 30,
        customFields: {
          partSide: 'left',
          partPosition: 'rear',
          finish: 'transparent',
        },
      },
      {
        name: 'Lado Derecho',
        sku: 'CC-FAR-001-R',
        price: 18000,
        stock: 30,
        customFields: {
          partSide: 'right',
          partPosition: 'rear',
          finish: 'transparent',
        },
      },
    ],
  },
  {
    name: 'Óptica Delantera Volkswagen Gol 2017-2023',
    slug: 'optica-delantera-volkswagen-gol-2017-2023',
    description: 'Óptica delantera compatible con Volkswagen Gol años 2017-2023.',
    facets: {
      'Tipo de Parte': 'Óptica Delantera',
      'Marca': 'Volkswagen',
      'Modelo': 'Gol',
    },
    customFields: {
      vehicleMake: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYearFrom: 2017,
      vehicleYearTo: 2023,
      oemCode: 'VW-GOL-001',
      partType: 'optica_delantera',
    },
    variants: [
      {
        name: 'Lado Izquierdo - Cromado',
        sku: 'VW-GOL-001-L-CHR',
        price: 22000,
        stock: 40,
        customFields: {
          partSide: 'left',
          partPosition: 'front',
          finish: 'chrome',
        },
      },
      {
        name: 'Lado Derecho - Cromado',
        sku: 'VW-GOL-001-R-CHR',
        price: 22000,
        stock: 40,
        customFields: {
          partSide: 'right',
          partPosition: 'front',
          finish: 'chrome',
        },
      },
      {
        name: 'Lado Izquierdo - Negro',
        sku: 'VW-GOL-001-L-BLK',
        price: 20000,
        stock: 35,
        customFields: {
          partSide: 'left',
          partPosition: 'front',
          finish: 'black',
        },
      },
      {
        name: 'Lado Derecho - Negro',
        sku: 'VW-GOL-001-R-BLK',
        price: 20000,
        stock: 35,
        customFields: {
          partSide: 'right',
          partPosition: 'front',
          finish: 'black',
        },
      },
    ],
  },
];

if (require.main === module) {
  vendurePopulate(
    () => config,
    async (app) => {
      console.log('🌱 Poblando base de datos con datos iniciales...');
      return {
        defaultLanguage: LanguageCode.es,
        ...initialData,
      };
    }
  )
    .then(() => {
      console.log('✅ Población de datos completada');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error durante la población:', err);
      process.exit(1);
    });
}
