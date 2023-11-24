'use strict';

import AutoLoad from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';
import { healthCheck } from './controller.js';
import { healthCheckSchema } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (fastify, opts) {
  fastify.get(
    '/',
    { schema: healthCheckSchema },
    async function (request, reply) {
      return healthCheck(fastify, request, reply);
    }
  );

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'api'),
    maxDepth: 0,
    options: Object.assign({}, opts, { prefix: '/api' }),
  });
}
