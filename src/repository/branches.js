import { HTTP_STATUS } from '#utilities/http-status.js';
import {
  getLimitAndOffset,
  getPaginationObject,
} from '#utilities/pagination-helpers.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { TABLE_NAMES } from '#utilities/table-names.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getBranches(knex, data) {
  const query = knex
    .from(TABLE_NAMES.BRANCH)
    .where({ tenantId: data.tenantId, isDeleted: false });

  const [limit, offset] = getLimitAndOffset({
    size: data.size,
    page: data.page,
  });

  const totalQuery = query.clone().count();

  const branchColumns = [
    'id',
    'tenantId',
    'name',
    'email',
    'address',
    'latitude',
    'longitude',
    'generalSalesTax',
    'cashTransactionTax',
    'onlineTransactionTax',
    'isTaxInclusive',
    'isActive',
    'createdAt',
  ];

  const filteredQuery = query
    .clone()
    .orderBy(`createdAt`, 'desc')
    .offset(offset)
    .limit(limit)
    .select(branchColumns);

  const multiQuery = [totalQuery, filteredQuery].join(';');

  const promise = knex.raw(multiQuery);

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  const [[{ count: totalRecordCount }], records] = result;

  const total = Number(totalRecordCount) || 0;
  const pagination = getPaginationObject({
    page: data.page,
    size: data.size,
    total,
  });

  return {
    records,
    pagination,
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getBranchById(knex, data) {
  const branchColumns = [
    'id',
    'tenantId',
    'name',
    'email',
    'address',
    'latitude',
    'longitude',
    'generalSalesTax',
    'cashTransactionTax',
    'onlineTransactionTax',
    'isTaxInclusive',
    'isActive',
    'createdAt',
  ];

  const promise = knex
    .from(TABLE_NAMES.BRANCH)
    .where({
      id: data.branchId,
      tenantId: data.tenantId,
      isDeleted: false,
    })
    .select(branchColumns)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    const error = new Error(`branch of id ${data.branchId} does not exist`);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  const record = result;

  return record;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getBranchesByIds(knex, data) {
  const branchColumns = [
    'id',
    'tenantId',
    'name',
    'email',
    'address',
    'latitude',
    'longitude',
    'generalSalesTax',
    'cashTransactionTax',
    'onlineTransactionTax',
    'isTaxInclusive',
    'isActive',
    'createdAt',
  ];

  const promise = knex
    .from(TABLE_NAMES.BRANCH)
    .where({
      tenantId: data.tenantId,
      isDeleted: false,
    })
    .whereIn('id', data.branchIds)
    .select(branchColumns);

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  const records = result;

  return records;
}
