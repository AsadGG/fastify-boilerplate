'use strict';

import { Type } from '@sinclair/typebox';

const backOfficeUserLoginSchema = {
  description: 'this will login',
  tags: ['v1|admin'],
  summary: 'Login',
  operationId: 'backOfficeUserLogin',
  body: Type.Object(
    {
      email: Type.String({ format: 'email' }),
      password: Type.String(),
    },
    { additionalProperties: false }
  ),
};
export function POST(_fastify) {
  return {
    schema: backOfficeUserLoginSchema,
    handler: async function (_request, reply) {
      reply.send('backOfficeUserLogin');
    },
  };
}
