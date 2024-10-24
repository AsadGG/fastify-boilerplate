import { HTTP_STATUS } from '#utilities/http-status.js';
import fastifyPlugin from 'fastify-plugin';

async function permissionChecker(fastify) {
  await fastify.decorate('checkPermission', function (permission) {
    return async function (request, reply) {
      try {
        const { permissions } = request.user;
        const hasResourceAccess = permissions.some(
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
