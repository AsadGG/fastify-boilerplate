'use strict';

import AutoLoad from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    request.log.info({ message: 'Server Is Running' });
    return reply.status(200).send({ health: 'Server Is Running' });
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'api'),
    maxDepth: 0,
    options: Object.assign({}, opts, { prefix: '/api' }),
  });
}
