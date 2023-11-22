'use strict';

import { adminLogger } from '../../../../config/logger.js';

export default async function (fastify) {
  fastify.addHook('onRequest', function (request, reply, done) {
    request.log = adminLogger;
    request.log.info({ request: request.raw, reply: reply.raw });
    done();
  });

  fastify.get('/', async function (request, reply) {
    request.log.info(`Handling GET ${request.url} request`);
    return reply.status(200).send('Hello Admin');
  });
}
