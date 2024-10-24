import camelCase from 'lodash/camelCase.js';
import kebabCase from 'lodash/kebabCase.js';
import upperFirst from 'lodash/upperFirst.js';
import path from 'path';
import { pino } from 'pino';
import { GLOBAL_CONSTANTS } from '../../global-constants.js';

export function createLogger(moduleName) {
  const logFolderPath = path.join(GLOBAL_CONSTANTS.ROOT_PATH, 'logs');
  const logFilePath = path.join(logFolderPath, `${kebabCase(moduleName)}`);

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

  const redact = {
    paths: ['request.headers.authorization', '*.password'],
    censor: '*** REDACTED ***',
  };

  const targets = [
    {
      level: 'info',
      target: 'pino-roll',
      options: {
        file: logFilePath,
        frequency: 'daily',
        mkdir: true,
        extension: '.log',
        size: '8m',
        dateFormat: 'yyyy-MM-dd',
      },
    },
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
        colorize: true,
        destination: 1,
      },
    },
  ];

  const pinoOptions = {
    name: upperFirst(camelCase(moduleName)),
    messageKey: 'message',
    errorKey: 'error',
    redact,
    serializers,
    transport: {
      targets,
    },
  };

  return pino(pinoOptions);
}
