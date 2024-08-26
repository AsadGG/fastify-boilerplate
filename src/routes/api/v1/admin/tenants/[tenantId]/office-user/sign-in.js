'use strict';

import { getOfficeUserByEmail } from '#repository/office-users.js';
import { getSha256Hash } from '#utilities/hash.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { createRedisFunctions } from '#utilities/redis-helpers.js';
import {
  getAccessTokenKey,
  getRefreshTokenKey,
} from '#utilities/redis-keys.js';
import { parse } from '@lukeed/ms';
import { Type } from '@sinclair/typebox';

const officeUserSignInSchema = {
  description: 'this will sign in office user',
  tags: ['v1|admin|tenant|office user'],
  summary: 'sign in office user',
  operationId: 'officeUserSignIn',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
  body: Type.Object(
    {
      email: Type.String({ format: 'email' }),
      password: Type.String({ minLength: 8 }),
    },
    { additionalProperties: false }
  ),
};
export function POST(fastify) {
  return {
    schema: officeUserSignInSchema,
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
        ...request.body,
      };

      const promise = getOfficeUserByEmail(fastify.knex, data);
      const [result, error, ok] = await promiseHandler(promise);
      if (!ok) {
        const errorObject = {
          statusCode: error.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: error.detail ?? error.message,
        };
        request.log.error({
          ...errorObject,
          payload: data,
        });
        return reply.send(errorObject);
      }

      const isPasswordMatch = await fastify.bcrypt.compare(
        request.body.password,
        result.password
      );

      if (!isPasswordMatch) {
        const errorObject = {
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          message: `invalid credentials`,
        };
        request.log.error({
          ...errorObject,
          payload: data,
        });
        return reply.send(errorObject);
      }

      delete result.password;

      const accessToken = fastify.jwt.access.sign({
        tenantId: request.params.tenantId,
        officeUserId: result.id,
      });

      const refreshToken = fastify.jwt.refresh.sign({
        tenantId: request.params.tenantId,
        officeUserId: result.id,
      });

      const accessTokenHash = getSha256Hash(accessToken);
      const refreshTokenHash = getSha256Hash(refreshToken);

      const { set } = createRedisFunctions(fastify.redis);

      const accessTokenKey = getAccessTokenKey(
        request.params.tenantId,
        accessTokenHash
      );
      const refreshTokenKey = getRefreshTokenKey(
        request.params.tenantId,
        refreshTokenHash
      );

      const accessTokenExpiryInSeconds =
        parse(fastify.config.ACCESS_JWT_EXPIRES_IN) / 1000;
      const refreshTokenExpiryInSeconds =
        parse(fastify.config.REFRESH_JWT_EXPIRES_IN) / 1000;

      await set(accessTokenKey, accessToken, accessTokenExpiryInSeconds);
      await set(refreshTokenKey, refreshToken, refreshTokenExpiryInSeconds);

      return reply.send({
        statusCode: HTTP_STATUS.OK,
        message: 'signed in successfully.',
        data: {
          ...result,
          accessToken: accessTokenHash,
          refreshToken: refreshTokenHash,
        },
      });
    },
  };
}
