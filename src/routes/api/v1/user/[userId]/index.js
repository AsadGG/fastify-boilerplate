'use strict';

import { Type } from '@sinclair/typebox';

const getUserSchema = {
  description: 'this will get a user',
  tags: ['v1|user'],
  summary: 'get a user',
  operationId: 'getUserById',
  params: Type.Object(
    { userId: Type.String({ format: 'uuid' }) },
    { additionalProperties: false }
  ),
};
export function GET(_fastify) {
  return {
    schema: getUserSchema,
    handler: async function (_request, reply) {
      reply.send('getUserById');
    },
  };
}

const userUpdateSchema = {
  description: 'this will update a user',
  tags: ['v1|user'],
  summary: 'update a user',
  operationId: 'updateUserById',
  params: Type.Object(
    { userId: Type.String({ format: 'uuid' }) },
    { additionalProperties: false }
  ),
  body: Type.Object(
    {
      firstName: Type.Optional(Type.String()),
      lastName: Type.Optional(Type.String()),
      email: Type.Optional(Type.String({ format: 'email' })),
      amount: Type.Optional(Type.Number()),
      phone: Type.Optional(Type.String()),
      roleId: Type.Optional(Type.String({ format: 'uuid' })),
    },
    { additionalProperties: false }
  ),
};
export function PATCH(_fastify) {
  return {
    schema: userUpdateSchema,
    handler: async function (_request, reply) {
      reply.send('updateUserById');
    },
  };
}

const userDeleteSchema = {
  description: 'this will a delete user',
  tags: ['v1|user'],
  summary: 'delete a user',
  operationId: 'deleteUserById',
  params: Type.Object(
    { userId: Type.String({ format: 'uuid' }) },
    { additionalProperties: false }
  ),
};
export function DELETE(_fastify) {
  return {
    schema: userDeleteSchema,
    handler: async function (_request, reply) {
      reply.send('deleteUserById');
    },
  };
}
