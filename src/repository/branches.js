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
    'isActive',
    'createdAt',
  ];

  const filteredQuery = query
    .clone()
    .orderBy(`createdAt`, 'desc')
    .limit(limit)
    .offset(offset)
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

  const records = result;

  return records;
}
