'use strict';

import { userLogger } from '../../../../config/logger.js';
import { getUser, setUser } from './controller.js';
import { getUserSchema, setUserSchema } from './schema.js';

export default async function (fastify) {
  fastify.addHook('onRequest', function (request, reply, done) {
    request.log = userLogger;
    request.log.info({ request: request.raw, reply: reply.raw });
    done();
  });

  fastify.get(
    '/',
    {
      schema: getUserSchema,
    },
    async function (request, reply) {
      return getUser(fastify, request, reply);
    }
  );

  fastify.post(
    '/',
    {
      schema: setUserSchema,
    },
    async function (request, reply) {
      return setUser(fastify, request, reply);
    }
  );
}
