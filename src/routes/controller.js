'use strict';

export async function healthCheck(fastify, request, reply) {
  request.log.info({ message: `Server Is Running` });
  return reply.status(200).send({ health: `Server Is Running` });
}
