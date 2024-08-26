'use strict';

import { getOfficeUserPermissions } from '#repository/office-users.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { createRedisFunctions } from '#utilities/redis-helpers.js';
import { getOfficeUserPermissionsKey } from '#utilities/redis-keys.js';
import fastifyPlugin from 'fastify-plugin';

async function permissionChecker(fastify) {
  await fastify.decorate('checkPermission', function (permission) {
    return async function (request, reply) {
      try {
        const { get, set } = createRedisFunctions(fastify.redis);
        const { tenantId, officeUserId, exp } = request.user;
        const key = getOfficeUserPermissionsKey(tenantId, officeUserId);
        let officeUserPermissions = await get(key);
        if (!officeUserPermissions) {
          const result = await getOfficeUserPermissions(fastify.knex, {
            tenantId,
            officeUserId,
          });
          officeUserPermissions = result.permissions;
          const currentTimeInSeconds = Date.now() / 1000;
          const expiry = Math.floor(exp - currentTimeInSeconds);
          await set(key, officeUserPermissions, expiry);
        }
        const hasResourceAccess = officeUserPermissions.some(
          (officeUserPermissions) => officeUserPermissions.name === permission
        );
        if (!hasResourceAccess) {
          return reply.send({
            statusCode: HTTP_STATUS.FORBIDDEN,
            message:
              'Access denied. You do not have permission to access this resource.',
          });
        }
        return hasResourceAccess;
      } catch (error) {
        reply.send(error);
      }
    };
  });
}

export default fastifyPlugin(permissionChecker);
