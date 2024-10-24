'use strict';

import { HTTP_STATUS } from '#utilities/http-status.js';
import fastifyPlugin from 'fastify-plugin';

async function branchAccess(fastify) {
  await fastify.decorate('checkBranchAccess', async function (request, reply) {
    try {
      const { branches } = request.user;
      const hasBranchAccess = branches.some(
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
