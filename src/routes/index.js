'use strict';

const healthCheckSchema = {
  summary: `This route checks the health of the server.`,
  description: `This route sends a response to the client with a status code of 200 and a message that the server is running.`,
  operationId: `healthCheck`,
};
export function GET(_fastify) {
  return {
    schema: healthCheckSchema,
    handler: async function (request, reply) {
      request.log.info({ message: `Server Is Running` });
      return reply.status(200).send({ health: `Server Is Running` });
    },
  };
}
