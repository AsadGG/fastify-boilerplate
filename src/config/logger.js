'use strict';

import kebabCase from 'lodash/kebabCase.js';
import path from 'path';
import pino from 'pino';
import { GLOBAL_CONSTANTS } from '../../global-constants.js';

/**
 * @typedef {"USER_LOGGER" | "ADMIN_LOGGER"} LoggerType
 */

/**
 * @param {LoggerType} moduleName The type of logger to use.
 */
function createLogger(moduleName) {
  const dateString = new Date().toISOString().split('T')[0];
  const logFolderPath = path.join(GLOBAL_CONSTANTS.ROOT_PATH, 'logs');
  const logFilePath = path.join(
    logFolderPath,
    `${kebabCase(moduleName)}-${dateString}`
  );

  const serializers = {
    request(request) {
      return {
        method: request.method,
        url: request.url,
        path: request.path,
        parameters: request.parameters,
        headers: request.headers,
      };
    },
    reply(reply) {
      return {
        statusCode: reply.statusCode,
      };
    },
  };

  const redact = ['request.headers.authorization'];

  const targets = [
    {
      level: 'info',
      target: 'pino-roll',
      options: {
        file: `${logFilePath}`,
        frequency: 'daily',
        mkdir: true,
        extension: 'log',
      },
    },
    {
      level: 'info',
      target: 'pino/file',
      options: { destination: 1 },
    },
  ];

  const pinoOptions = {
    redact,
    serializers,
    transport: {
      targets,
    },
  };

  const logger = pino(pinoOptions);

  return logger;
}

export const appLogger = createLogger('APP_LOGGER');
export const adminLogger = createLogger('ADMIN_LOGGER');
export const userLogger = createLogger('USER_LOGGER');
