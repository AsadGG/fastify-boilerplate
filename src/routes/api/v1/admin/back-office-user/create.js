'use strict';

import { Type } from '@sinclair/typebox';

const createBackOfficeUserSchema = {
  description: 'this will create',
  tags: ['v1|admin'],
  summary: 'create',
  consumes: ['multipart/form-data'],
  operationId: 'createBackOfficeUser',
  body: Type.Object(
    {
      email: Type.String({ format: 'email' }),
      password: Type.String(),
      avatar: Type.Any({ isFile: true }),
    },
    { additionalProperties: false }
  ),
  headers: Type.Object({
    Authorization: Type.String(),
  }),
  security: [
    {
      Authorization: [],
    },
  ],
};
export function POST(_fastify) {
  return {
    schema: createBackOfficeUserSchema,
    handler: async function (_request, reply) {
      reply.send('createBackOfficeUser');
    },
  };
}
