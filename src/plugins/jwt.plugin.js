'use strict';

import fastifyJWT from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';

async function myFastifyJWT(fastify, opts) {
  await fastify.register(fastifyJWT, opts);
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default fastifyPlugin(myFastifyJWT);
