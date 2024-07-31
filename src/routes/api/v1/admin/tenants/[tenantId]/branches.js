'use strict';

import { getBranches } from '#repository/branches.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getBranchesSchema = {
  description: 'this will fetch branches',
  tags: ['v1|admin|tenant|branch'],
  summary: 'fetch branches',
  security: [{ Authorization: [] }],
  operationId: 'getBranches',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
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
    schema: getBranchesSchema,
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        size: request.query.size,
        page: request.query.page,
      };
      const promise = getBranches(fastify.knex, data);
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
        message: 'branches fetched successfully.',
        data: result.records,
        pagination: result.pagination,
      });
    },
  };
}
