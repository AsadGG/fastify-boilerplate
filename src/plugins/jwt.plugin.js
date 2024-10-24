'use strict';

import { HTTP_STATUS } from '#utilities/http-status.js';
import { createRedisFunctions } from '#utilities/redis-helpers.js';
import {
  getOfficeUserAccessTokenKey,
  getOfficeUserRefreshTokenKey,
  getSuperAdminAccessTokenKey,
  getSuperAdminRefreshTokenKey,
  getTenantAdminAccessTokenKey,
  getTenantAdminRefreshTokenKey,
} from '#utilities/redis-keys.js';
import fastifyJWT from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';

function noTokenInHeaderError() {
  const error = new Error(`No Authorization was found in request.headers`);
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_NO_AUTHORIZATION_IN_HEADER`;
  error.error = `Unauthorized`;
  throw error;
}
function tokenExpiredError() {
  const error = new Error(`Authorization token expired`);
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`;
  error.error = `Unauthorized`;
  throw error;
}
function tokenInvalidError() {
  const error = new Error(
    `Authorization token is invalid. format is Bearer 01234567-89ab-4cde-8f01-23456789abcd:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`
  );
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_AUTHORIZATION_TOKEN_INVALID`;
  error.error = `Unauthorized`;
  throw error;
}

const TOKEN_PATTERN =
  /^([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89AaBb][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}):([A-Fa-f0-9]{64})$/;

async function myFastifyJWT(fastify, opts) {
  await fastify.register(fastifyJWT, opts.superAdminAccess);
  await fastify.register(fastifyJWT, opts.superAdminRefresh);
  await fastify.register(fastifyJWT, opts.tenantAdminAccess);
  await fastify.register(fastifyJWT, opts.tenantAdminRefresh);
  await fastify.register(fastifyJWT, opts.officeUserAccess);
  await fastify.register(fastifyJWT, opts.officeUserRefresh);

  const { get, del } = createRedisFunctions(fastify.redis);

  fastify.decorate(
    'authenticateSuperAdminAccess',
    async function (request, reply) {
      try {
        if (!request.headers.authorization) {
          noTokenInHeaderError();
        }
        const regExpExecArray = TOKEN_PATTERN.exec(
          request.headers.authorization.replace('Bearer ', '')
        );
        if (!regExpExecArray) {
          tokenInvalidError();
        }
        const [, superAdminId, tokenHash] = regExpExecArray;
        const key = getSuperAdminAccessTokenKey(superAdminId, tokenHash);
        const token = await get(key);
        if (!token) {
          tokenExpiredError();
        }
        request.headers.authorization = `Bearer ${token}`;
        await request.superAdminAccessJwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
  fastify.decorate(
    'authenticateSuperAdminRefresh',
    async function (request, reply) {
      try {
        if (!request.headers.authorization) {
          noTokenInHeaderError();
        }

        const regExpExecArray = TOKEN_PATTERN.exec(
          request.headers.authorization.replace('Bearer ', '')
        );
        if (!regExpExecArray) {
          tokenInvalidError();
        }
        const [, superAdminId, tokenHash] = regExpExecArray;
        const key = getSuperAdminRefreshTokenKey(superAdminId, tokenHash);
        const token = await get(key);
        if (!token) {
          tokenExpiredError();
        }
        await del(key);
        request.headers.authorization = `Bearer ${token}`;
        await request.superAdminRefreshJwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );

  fastify.decorate(
    'authenticateTenantAdminAccess',
    async function (request, reply) {
      try {
        if (!request.headers.authorization) {
          noTokenInHeaderError();
        }

        const regExpExecArray = TOKEN_PATTERN.exec(
          request.headers.authorization.replace('Bearer ', '')
        );
        if (!regExpExecArray) {
          tokenInvalidError();
        }
        const tenantId = request.params.tenantId;
        const [, tenantAdminId, tokenHash] = regExpExecArray;
        const key = getTenantAdminAccessTokenKey(
          tenantId,
          tenantAdminId,
          tokenHash
        );
        const token = await get(key);
        if (!token) {
          tokenExpiredError();
        }
        request.headers.authorization = `Bearer ${token}`;
        await request.tenantAdminAccessJwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
  fastify.decorate(
    'authenticateTenantAdminRefresh',
    async function (request, reply) {
      try {
        if (!request.headers.authorization) {
          noTokenInHeaderError();
        }

        const regExpExecArray = TOKEN_PATTERN.exec(
          request.headers.authorization.replace('Bearer ', '')
        );
        if (!regExpExecArray) {
          tokenInvalidError();
        }
        const tenantId = request.params.tenantId;
        const [, tenantAdminId, tokenHash] = regExpExecArray;
        const key = getTenantAdminRefreshTokenKey(
          tenantId,
          tenantAdminId,
          tokenHash
        );

        const token = await get(key);
        if (!token) {
          tokenExpiredError();
        }
        await del(key);
        request.headers.authorization = `Bearer ${token}`;
        await request.tenantAdminRefreshJwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );

  fastify.decorate(
    'authenticateOfficeUserAccess',
    async function (request, reply) {
      try {
        if (!request.headers.authorization) {
          noTokenInHeaderError();
        }

        const regExpExecArray = TOKEN_PATTERN.exec(
          request.headers.authorization.replace('Bearer ', '')
        );
        if (!regExpExecArray) {
          tokenInvalidError();
        }
        const tenantId = request.params.tenantId;
        const [, officeUserId, tokenHash] = regExpExecArray;
        const key = getOfficeUserAccessTokenKey(
          tenantId,
          officeUserId,
          tokenHash
        );
        const token = await get(key);
        if (!token) {
          tokenExpiredError();
        }
        request.headers.authorization = `Bearer ${token}`;
        await request.officeUserAccessJwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
  fastify.decorate(
    'authenticateOfficeUserRefresh',
    async function (request, reply) {
      try {
        if (!request.headers.authorization) {
          noTokenInHeaderError();
        }

        const regExpExecArray = TOKEN_PATTERN.exec(
          request.headers.authorization.replace('Bearer ', '')
        );
        if (!regExpExecArray) {
          tokenInvalidError();
        }
        const tenantId = request.params.tenantId;
        const [, officeUserId, tokenHash] = regExpExecArray;
        const key = getOfficeUserRefreshTokenKey(
          tenantId,
          officeUserId,
          tokenHash
        );
        const token = await get(key);
        if (!token) {
          tokenExpiredError();
        }
        await del(key);
        request.headers.authorization = `Bearer ${token}`;
        await request.officeUserRefreshJwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
}

export default fastifyPlugin(myFastifyJWT);
