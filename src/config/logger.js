'use strict';

import { getStream } from 'file-stream-rotator';
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
  const logFolderPath = path.join(GLOBAL_CONSTANTS.ROOT_PATH, 'logs');
  const logFilePath = path.join(logFolderPath, `${kebabCase(moduleName)}`);

  const streams = [
    { stream: process.stdout },
    {
      stream: getStream({
        filename: `${logFilePath}-%DATE%`,
        date_format: 'YYYY-MM-DD',
        extension: '.log',
        frequency: 'daily',
      }),
    },
  ];

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

  const logger = pino(
    { level: 'info', redact, serializers },
    pino.multistream(streams)
  );

  return logger;
}

export const appLogger = createLogger('APP_LOGGER');
export const adminLogger = createLogger('ADMIN_LOGGER');
export const userLogger = createLogger('USER_LOGGER');
