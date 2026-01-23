import { bootstrap, JobQueueService } from '@vendure/core';
import { config } from './vendure-config';

/**
 * Bootstrap del servidor Vendure para Portal B2B Argenta
 *
 * Este archivo inicializa el servidor de Vendure con la configuración
 * definida en vendure-config.ts
 */

async function runServer() {
  try {
    console.log('🚀 Iniciando servidor Vendure para Argenta B2B...');

    const app = await bootstrap(config);

    // Configuración adicional después del bootstrap
    if (app) {
      const jobQueueService = app.get(JobQueueService);
      await jobQueueService.start();

      console.log('✅ Servidor Vendure iniciado correctamente');
      console.log(`📍 Admin API: http://localhost:${config.apiOptions.port}/${config.apiOptions.adminApiPath}`);
      console.log(`📍 Shop API: http://localhost:${config.apiOptions.port}/${config.apiOptions.shopApiPath}`);
      console.log(`📍 Admin UI: http://localhost:3002/admin`);
    }
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

runServer();
