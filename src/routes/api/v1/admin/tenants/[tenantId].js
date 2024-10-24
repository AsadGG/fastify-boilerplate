'use strict';

import { getTenantById } from '#repository/tenants.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getTenantByIdSchema = {
  description: 'this will fetch tenant by id',
  tags: ['v1|admin|tenant'],
  summary: 'fetch tenant',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'getTenantById',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getTenantByIdSchema,
    onRequest: [fastify.authenticateOfficeUserAccess],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
      };
      const promise = getTenantById(fastify.knex, data);
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
      return reply.send({
        statusCode: HTTP_STATUS.OK,
        message: 'tenant fetched successfully.',
        data: result,
      });
    },
  };
}
