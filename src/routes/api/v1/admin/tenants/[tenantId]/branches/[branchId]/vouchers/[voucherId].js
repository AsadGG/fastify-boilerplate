import {
  deleteVoucherById,
  getVoucherById,
  updateVoucherById,
} from '#repository/vouchers.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getVoucherByIdSchema = {
  description: 'this will fetch voucher by id',
  tags: ['v1|admin|tenant|branch|voucher'],
  summary: 'fetch voucher',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'getVoucherById',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
      branchId: Type.String({ format: 'uuid' }),
      voucherId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getVoucherByIdSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      fastify.checkBranchAccess,
      fastify.checkPermission('getVoucherById'),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
        voucherId: request.params.voucherId,
      };
      const promise = getVoucherById(fastify.knex, data);
      const [result, error, ok] = await promiseHandler(promise);
      if (!ok) {
        const errorObject = {
          statusCode: error.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: error.detail ?? error.message,
        };
        request.log.error({
          ...errorObject,
          payload: data,
        });
        return reply.send(errorObject);
      }

      return reply.send({
        statusCode: HTTP_STATUS.OK,
        message: 'voucher fetched successfully.',
        data: result,
      });
    },
  };
}

const updateVoucherByIdSchema = {
  description: 'this will update voucher by id',
  tags: ['v1|admin|tenant|branch|voucher'],
  summary: 'update voucher',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'updateVoucherById',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
      branchId: Type.String({ format: 'uuid' }),
      voucherId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
  body: Type.Object(
    {
      validFrom: Type.Optional(Type.String({ format: 'date-time' })),
      validUntil: Type.Optional(Type.String({ format: 'date-time' })),
      maxRedeem: Type.Optional(Type.Integer({ minimum: 1 })),
      isUnlimitedRedeem: Type.Optional(Type.Boolean({ default: false })),
      code: Type.Optional(Type.String()),
      value: Type.Optional(Type.Number()),
      type: Type.Optional(Type.String({ enum: ['AMOUNT', 'PERCENTAGE'] })),
      visibility: Type.Optional(
        Type.String({ enum: ['ALL', 'ADMIN', 'CLIENT'] })
      ),
    },
    { additionalProperties: false }
  ),
};
export function PATCH(fastify) {
  return {
    schema: updateVoucherByIdSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      fastify.checkBranchAccess,
      fastify.checkPermission('updateVoucherById'),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
        voucherId: request.params.voucherId,
        ...request.body,
      };

      const promise = updateVoucherById(fastify.knex, data);
      const [result, error, ok] = await promiseHandler(promise);
      if (!ok) {
        request.log.error(error);
        const errorObject = {
          statusCode: error.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: error.detail ?? error.message,
        };
        request.log.error({
          ...errorObject,
          payload: data,
        });
        return reply.send(errorObject);
      }

      return reply.send({
        statusCode: HTTP_STATUS.OK,
        message: 'voucher updated successfully.',
        data: result,
      });
    },
  };
}

const deleteVoucherByIdSchema = {
  description: 'this will delete voucher by id',
  tags: ['v1|admin|tenant|branch|voucher'],
  summary: 'delete voucher',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'deleteVoucherById',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
      branchId: Type.String({ format: 'uuid' }),
      voucherId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
};
export function DELETE(fastify) {
  return {
    schema: deleteVoucherByIdSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      fastify.checkBranchAccess,
      fastify.checkPermission('deleteVoucherById'),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
        voucherId: request.params.voucherId,
      };

      const promise = deleteVoucherById(fastify.knex, data);
      const [result, error, ok] = await promiseHandler(promise);
      if (!ok) {
        const errorObject = {
          statusCode: error.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: error.detail ?? error.message,
        };
        request.log.error({
          ...errorObject,
          payload: data,
        });
        return reply.send(errorObject);
      }

      return reply.send({
        statusCode: HTTP_STATUS.OK,
        message: 'voucher deleted successfully.',
        data: result,
      });
    },
  };
}
