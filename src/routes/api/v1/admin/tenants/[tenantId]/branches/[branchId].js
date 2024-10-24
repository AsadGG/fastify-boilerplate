'use strict';

import { getBranchById } from '#repository/branches.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getBranchByIdSchema = {
  description: 'this will fetch branch by id',
  tags: ['v1|admin|tenant|branch'],
  summary: 'fetch branch',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'getBranchById',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
      branchId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getBranchByIdSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      fastify.checkBranchAccess,
      fastify.checkPermission('getBranchById'),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
      };
      const promise = getBranchById(fastify.knex, data);
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
        message: 'branch fetched successfully.',
        data: result,
      });
    },
  };
}
