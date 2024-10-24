'use strict';

import { getBranchesByIds } from '#repository/branches.js';
import { getOfficeUserBranches } from '#repository/office-users.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

function setBranchesForUser(fastify) {
  return async function (request, reply) {
    try {
      const { tenantId, officeUserId } = request.user;
      const result = await getOfficeUserBranches(fastify.knex, {
        tenantId,
        officeUserId,
      });
      request.user.branches = result.branches;
      return true;
    } catch (error) {
      reply.send(error);
    }
  };
}

const getBranchesSchema = {
  description: 'this will fetch office user branches',
  tags: ['v1|admin|tenant|office user|branch'],
  summary: 'fetch office user branches',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'getOfficeUserBranches',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getBranchesSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      setBranchesForUser(fastify),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchIds: request.user.branches,
      };
      const promise = getBranchesByIds(fastify.knex, data);
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
        message: 'branches fetched successfully.',
        data: result,
      });
    },
  };
}
