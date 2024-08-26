'use strict';

import { createRedisFunctions } from '#utilities/redis-helpers.js';
import {
  getAccessTokenKey,
  getRefreshTokenKey,
} from '#utilities/redis-keys.js';
import fastifyJWT from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';

async function myFastifyJWT(fastify, opts) {
  await fastify.register(fastifyJWT, opts.access);
  await fastify.register(fastifyJWT, opts.refresh);
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const tenantId = request.params.tenantId;
      const tokenHash = request.headers.authorization.replace('Bearer ', '');
      const key = getAccessTokenKey(tenantId, tokenHash);
      const { get } = createRedisFunctions(fastify.redis);
      const token = await get(key);
      request.headers.authorization = token ? `Bearer ${token}` : '';
      await request.accessJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
  fastify.decorate('authenticateRefresh', async function (request, reply) {
    try {
      const tenantId = request.params.tenantId;
      const tokenHash = request.headers.authorization.replace('Bearer ', '');
      const key = getRefreshTokenKey(tenantId, tokenHash);
      const { get, del } = createRedisFunctions(fastify.redis);
      const token = await get(key);
      await del(key);
      request.headers.authorization = token ? `Bearer ${token}` : '';
      await request.refreshJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default fastifyPlugin(myFastifyJWT);
