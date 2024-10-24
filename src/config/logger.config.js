import { createLogger } from '../logger/logger.js';

const adminLogger = createLogger('ADMIN_LOGGER');
const appLogger = createLogger('App_LOGGER');

export function loggerConfig() {
  return {
    loggers: [
      { path: '/api/v1/admin', logger: adminLogger },
      { path: '/api/v1/app', logger: appLogger },
    ],
  };
}
