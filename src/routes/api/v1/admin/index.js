'use strict';

import { adminLogger } from '../../../../config/logger.js';
import { helloAdmin } from './controller.js';
import { helloAdminSchema } from './schema.js';

export default async function (fastify) {
  fastify.addHook('onRequest', function (request, reply, done) {
    request.log = adminLogger;
    request.log.info({ request: request.raw, reply: reply.raw });
    done();
  });

  fastify.get(
    '/',
    { schema: helloAdminSchema },
    async function (request, reply) {
      return helloAdmin(fastify, request, reply);
    }
  );
}
