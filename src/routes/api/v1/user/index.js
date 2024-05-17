'use strict';

import { Type } from '@sinclair/typebox';

const userGetSchema = {
  description: 'this will get all users',
  tags: ['v1|user'],
  summary: 'get all users',
  operationId: 'getUsers',
  querystring: Type.Object(
    {
      search: Type.Optional(Type.String({ description: 'text to filter' })),
      page: Type.Integer({ minimum: 0, default: 0 }),
      size: Type.Integer({ minimum: 10, default: 10 }),
    },
    { additionalProperties: false }
  ),
};
export function GET(_fastify) {
  return {
    schema: userGetSchema,
    handler: async function (_request, reply) {
      reply.send('getUsers');
    },
  };
}

const userPostSchema = {
  description: 'this will create a new user',
  tags: ['v1|user'],
  summary: 'create new user',
  operationId: 'createUser',
  body: Type.Object(
    {
      firstName: Type.String(),
      lastName: Type.String(),
      email: Type.String({ format: 'email' }),
      password: Type.String(),
      amount: Type.Number(),
      phone: Type.String(),
      roleId: Type.Optional(Type.String({ format: 'uuid' })),
    },
    { additionalProperties: false }
  ),
};
export function POST(_fastify) {
  return {
    schema: userPostSchema,
    handler: async function (_request, reply) {
      reply.send('createUser');
    },
  };
}
