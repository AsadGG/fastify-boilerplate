'use strict';

import { HTTP_STATUS } from '#utilities/http-status.js';
import { createRedisFunctions } from '#utilities/redis-helpers.js';
import {
  getAccessTokenKey,
  getRefreshTokenKey,
} from '#utilities/redis-keys.js';
import fastifyJWT from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';

function tokenExpiredError() {
  const error = new Error(`Authorization token expired`);
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`;
  error.error = `Unauthorized`;
}
function tokenInvalidError() {
  const error = new Error(
    `Authorization token is invalid. format is Bearer 01234567-89ab-4cde-8f01-23456789abcd:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`
  );
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_AUTHORIZATION_TOKEN_INVALID`;
  error.error = `Unauthorized`;
}

const TOKEN_PATTERN =
  /^([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89AaBb][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}):([A-Fa-f0-9]{64})$/;

async function myFastifyJWT(fastify, opts) {
  await fastify.register(fastifyJWT, opts.access);
  await fastify.register(fastifyJWT, opts.refresh);
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      const regExpExecArray = TOKEN_PATTERN.exec(
        request.headers.authorization.replace('Bearer ', '')
      );
      if (!regExpExecArray) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send(tokenInvalidError());
      }
      const tenantId = request.params.tenantId;
      const [, officeUserId, tokenHash] = regExpExecArray;
      const key = getAccessTokenKey(tenantId, officeUserId, tokenHash);
      const { get } = createRedisFunctions(fastify.redis);
      const token = await get(key);
      if (!token) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send(tokenExpiredError());
      }
      request.headers.authorization = `Bearer ${token}`;
      await request.accessJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
  fastify.decorate('authenticateRefresh', async function (request, reply) {
    try {
      const regExpExecArray = TOKEN_PATTERN.exec(
        request.headers.authorization.replace('Bearer ', '')
      );
      if (!regExpExecArray) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send(tokenInvalidError());
      }
      const tenantId = request.params.tenantId;
      const [, officeUserId, tokenHash] = regExpExecArray;
      const key = getRefreshTokenKey(tenantId, officeUserId, tokenHash);
      const { get, del } = createRedisFunctions(fastify.redis);
      const token = await get(key);
      if (!token) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send(tokenExpiredError());
      }
      await del(key);
      request.headers.authorization = `Bearer ${token}`;
      await request.refreshJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default fastifyPlugin(myFastifyJWT);
