'use strict';

export async function helloAdmin(fastify, request, reply) {
  request.log.info(`Handling GET ${request.url} request`);
  return reply.status(200).send({ statusCode: 200, message: `Hello Admin` });
}
