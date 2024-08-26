'use strict';

import { getTenantByDomain } from '#repository/tenants.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getTenantByDomainSchema = {
  description: 'this will fetch tenant by domain',
  tags: ['v1|app|tenant'],
  summary: 'fetch tenant by domain',
  security: [{ AuthorizationAccess: [] }],
  operationId: 'getTenantByDomain',
  params: Type.Object(
    {
      domain: Type.String(),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getTenantByDomainSchema,
    handler: async function (request, reply) {
      const data = {
        domain: request.params.domain,
      };
      const promise = getTenantByDomain(fastify.knex, data);
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
