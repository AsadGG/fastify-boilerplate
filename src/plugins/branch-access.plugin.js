'use strict';

import { getOfficeUserBranches } from '#repository/office-users.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { createRedisFunctions } from '#utilities/redis-helpers.js';
import { getOfficeUserBranchesKey } from '#utilities/redis-keys.js';
import fastifyPlugin from 'fastify-plugin';

async function branchAccess(fastify) {
  await fastify.decorate('checkBranchAccess', async function (request, reply) {
    try {
      const { get, set } = createRedisFunctions(fastify.redis);
      const { tenantId, officeUserId, exp } = request.user;
      const key = getOfficeUserBranchesKey(tenantId, officeUserId);
      let officeUserBranches = await get(key);
      if (!officeUserBranches) {
        const result = await getOfficeUserBranches(fastify.knex, {
          tenantId,
          officeUserId,
        });
        officeUserBranches = result.branches;
        const currentTimeInSeconds = Date.now() / 1000;
        const expiry = Math.floor(exp - currentTimeInSeconds);
        await set(key, officeUserBranches, expiry);
      }
      const hasBranchAccess = officeUserBranches.some(
        (branchId) => branchId === request.params.branchId
      );
      if (!hasBranchAccess) {
        return reply.send({
          statusCode: HTTP_STATUS.FORBIDDEN,
          message: 'Access denied. You do not have access to this branch.',
        });
      }
      return hasBranchAccess;
    } catch (error) {
      reply.send(error);
    }
  });
}

export default fastifyPlugin(branchAccess);
