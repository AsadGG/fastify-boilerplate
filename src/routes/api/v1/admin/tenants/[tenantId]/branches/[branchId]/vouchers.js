import { createVoucher, getVouchers } from '#repository/vouchers.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { Type } from '@sinclair/typebox';

const getVouchersSchema = {
  description: 'this will fetch vouchers',
  tags: ['v1|admin|tenant|branch|voucher'],
  summary: 'fetch vouchers',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'getVouchers',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
      branchId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
  querystring: Type.Object(
    {
      page: Type.Integer({ minimum: 1, default: 1 }),
      size: Type.Integer({ minimum: 10, default: 10 }),
      search: Type.Optional(Type.String()),
    },
    { additionalProperties: false }
  ),
};
export function GET(fastify) {
  return {
    schema: getVouchersSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      fastify.checkBranchAccess,
      fastify.checkPermission('getVouchers'),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
        page: request.query.page,
        size: request.query.size,
        search: request.query.search,
      };
      const promise = getVouchers(fastify.knex, data);
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
        message: 'vouchers fetched successfully.',
        data: result.records,
        pagination: result.pagination,
      });
    },
  };
}

const createVoucherSchema = {
  description: 'this will create new voucher',
  tags: ['v1|admin|tenant|branch|voucher'],
  summary: 'create new voucher',
  security: [{ AuthorizationOfficeUserAccess: [] }],
  operationId: 'createVoucher',
  params: Type.Object(
    {
      tenantId: Type.String({ format: 'uuid' }),
      branchId: Type.String({ format: 'uuid' }),
    },
    { additionalProperties: false }
  ),
  body: Type.Object(
    {
      validFrom: Type.String({ format: 'date-time' }),
      validUntil: Type.String({ format: 'date-time' }),
      maxRedeem: Type.Integer({ minimum: 1 }),
      isUnlimitedRedeem: Type.Boolean({ default: false }),
      code: Type.String(),
      value: Type.Number(),
      type: Type.String({ enum: ['AMOUNT', 'PERCENTAGE'] }),
      visibility: Type.String({ enum: ['ALL', 'ADMIN', 'CLIENT'] }),
    },
    { additionalProperties: false }
  ),
};
export function POST(fastify) {
  return {
    schema: createVoucherSchema,
    onRequest: [
      fastify.authenticateOfficeUserAccess,
      fastify.checkBranchAccess,
      fastify.checkPermission('createVoucher'),
    ],
    handler: async function (request, reply) {
      const data = {
        tenantId: request.params.tenantId,
        branchId: request.params.branchId,
        ...request.body,
      };
      const promise = createVoucher(fastify.knex, data);
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
        statusCode: HTTP_STATUS.CREATED,
        message: 'voucher created successfully.',
        data: result,
      });
    },
  };
}
