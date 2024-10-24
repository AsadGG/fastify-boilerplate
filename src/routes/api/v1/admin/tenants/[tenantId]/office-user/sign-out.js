'use strict';

import { HTTP_STATUS } from '#utilities/http-status.js';
import { createRedisFunctions } from '#utilities/redis-helpers.js';
import { getOfficeUserKeysPattern } from '#utilities/redis-keys.js';
import { Type } from '@sinclair/typebox';

const officeUserSignOutSchema = {
  description: 'this will sign out office user',
  tags: ['v1|admin|tenant|office user'],
  summary: 'sign out office user',
  security: [{ AuthorizationOfficeUserRefresh: [] }],
  operationId: 'officeUserSignOut',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
};
export function POST(fastify) {
  return {
    schema: officeUserSignOutSchema,
    onRequest: [fastify.authenticateOfficeUserAccess],
    handler: async function (request, reply) {
      const { officeUserId } = request.user;

      const { keys, del } = createRedisFunctions(fastify.redis);

      const pattern = getOfficeUserKeysPattern(
        request.params.tenantId,
        officeUserId
      );

      const officeUserKeys = await keys(pattern);

      await del(officeUserKeys);

      return reply.send({
        statusCode: HTTP_STATUS.OK,
        message: 'signed out successfully.',
      });
    },
  };
}
