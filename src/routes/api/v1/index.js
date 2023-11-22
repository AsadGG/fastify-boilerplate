'use strict';

import AutoLoad from '@fastify/autoload';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (fastify, opts) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'user'),
    maxDepth: 0,
    options: Object.assign({}, opts, { prefix: '/user' }),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'admin'),
    maxDepth: 0,
    options: Object.assign({}, opts, { prefix: '/admin' }),
  });
}
