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
export async function getTenants(knex, data) {
  const query = knex.from(TABLE_NAMES.TENANT).where({ isDeleted: false });

  const [limit, offset] = getLimitAndOffset({
    size: data.size,
    page: data.page,
  });

  const totalQuery = query.clone().count();

  const tenantColumns = [
    'id',
    'name',
    'description',
    'logo',
    'domain',
    'gstPercentage',
    'isActive',
    'createdAt',
  ];

  const filteredQuery = query
    .clone()
    .orderBy(`createdAt`, 'desc')
    .limit(limit)
    .offset(offset)
    .select(tenantColumns);

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
export async function getTenantById(knex, data) {
  const tenantColumns = [
    'id',
    'name',
    'description',
    'logo',
    'domain',
    'gstPercentage',
    'isActive',
    'createdAt',
  ];

  const promise = knex
    .from(TABLE_NAMES.TENANT)
    .where({ id: data.tenantId, isDeleted: false })
    .select(tenantColumns)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  const records = result;

  return records;
}
