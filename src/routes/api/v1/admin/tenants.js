'use strict';

import { getTenants } from '#repository/tenants.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getTenantsSchema = {
  description: 'this will fetch tenants',
  tags: ['v1|admin|tenant'],
  summary: 'fetch tenants',
  security: [{ Authorization: [] }],
  operationId: 'getTenants',
  querystring: Type.Object(
    {
      page: Type.Integer({ minimum: 1, default: 1 }),
      size: Type.Integer({ minimum: 10, default: 10 }),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getTenantsSchema,
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const data = {
        size: request.query.size,
        page: request.query.page,
      };
      const promise = getTenants(fastify.knex, data);
      const [result, error, ok] = await promiseHandler(promise);
      if (!ok) {
        const errorObject = {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
        message: 'tenants fetched successfully.',
        data: result.records,
        pagination: result.pagination,
      });
    },
  };
}
