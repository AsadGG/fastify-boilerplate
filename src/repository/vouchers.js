import { MAX_INT_32 } from '#utilities/constants.js';
import {
  addTableNamePrefixOnProperties,
  textFilterHelper,
} from '#utilities/db-query-helpers.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import {
  getLimitAndOffset,
  getPaginationObject,
} from '#utilities/pagination-helpers.js';
import { POSTGRES_ERROR_CODES } from '#utilities/postgres_error_codes.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { TABLE_NAMES } from '#utilities/table-names.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getVouchers(knex, data) {
  const voucherColumns = [
    'id',
    'validFrom',
    'validUntil',
    'redeemCount',
    'maxRedeem',
    'code',
    'value',
    'type',
    'visibility',
    'isActive',
    'createdAt',
    'updatedAt',
  ];

  const query = knex
    .from(TABLE_NAMES.VOUCHER)
    .where({
      tenantId: data.tenantId,
      branchId: data.branchId,
      isDeleted: false,
    })
    .modify(textFilterHelper(data.search, `${TABLE_NAMES.VOUCHER}.code`));

  const [limit, offset] = getLimitAndOffset({
    size: data.size,
    page: data.page,
  });

  const totalQuery = query.clone().count();

  const filteredQuery = query
    .clone()
    .orderBy(`createdAt`, 'desc')
    .offset(offset)
    .limit(limit)
    .select(voucherColumns);

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
export async function getVoucherById(knex, data) {
  const voucherColumns = [
    'id',
    'validFrom',
    'validUntil',
    'redeemCount',
    'maxRedeem',
    'code',
    'value',
    'type',
    'visibility',
    'isActive',
    'isDeleted',
    'createdAt',
    'updatedAt',
  ];

  const promise = knex
    .from(TABLE_NAMES.VOUCHER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.voucherId,
          tenantId: data.tenantId,
          branchId: data.branchId,
          isDeleted: false,
        },
        TABLE_NAMES.VOUCHER
      )
    )
    .select(voucherColumns)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    const notFoundError = new Error(
      `voucher of id ${data.voucherId} does not exist`
    );
    notFoundError.statusCode = HTTP_STATUS.NOT_FOUND;
    throw notFoundError;
  }

  const record = result;

  return record;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createVoucher(knex, data) {
  const voucherData = {
    tenantId: data.tenantId,
    branchId: data.branchId,
    validFrom: data.validFrom,
    validUntil: data.validUntil,
    maxRedeem: data.isUnlimitedRedeem ? MAX_INT_32 : data.maxRedeem,
    code: data.code,
    value: data.value,
    type: data.type,
    visibility: data.visibility,
  };

  const voucherColumns = [
    'id',
    'validFrom',
    'validUntil',
    'redeemCount',
    'maxRedeem',
    'code',
    'value',
    'type',
    'visibility',
    'isActive',
    'isDeleted',
    'createdAt',
    'updatedAt',
  ];

  const insertVouchersPromise = knex
    .from(TABLE_NAMES.VOUCHER)
    .insert(voucherData)
    .returning(voucherColumns);

  const [insertVouchersResult, insertVouchersError, insertVouchersOk] =
    await promiseHandler(insertVouchersPromise);

  if (!insertVouchersOk) {
    if (insertVouchersError.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
      insertVouchersError.statusCode = HTTP_STATUS.CONFLICT;
    }
    throw insertVouchersError;
  }

  const [voucher] = insertVouchersResult;

  const record = voucher;

  return record;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function updateVoucherById(knex, data) {
  const voucherData = {
    validFrom: data.validFrom,
    validUntil: data.validUntil,
    maxRedeem: data.isUnlimitedRedeem ? MAX_INT_32 : data.maxRedeem,
    code: data.code,
    value: data.value,
    type: data.type,
    visibility: data.visibility,
  };

  const voucherColumns = [
    'id',
    'validFrom',
    'validUntil',
    'redeemCount',
    'maxRedeem',
    'code',
    'value',
    'type',
    'visibility',
    'isActive',
    'isDeleted',
    'createdAt',
    'updatedAt',
  ];

  const updateVoucherPromise = knex
    .from(TABLE_NAMES.VOUCHER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.voucherId,
          tenantId: data.tenantId,
          branchId: data.branchId,
          isDeleted: false,
        },
        TABLE_NAMES.VOUCHER
      )
    )
    .update(voucherData)
    .returning(voucherColumns);

  const [updateVoucherResult, updateVoucherError, updateVoucherOk] =
    await promiseHandler(updateVoucherPromise);

  if (!updateVoucherOk) {
    if (updateVoucherError.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
      updateVoucherError.statusCode = HTTP_STATUS.CONFLICT;
    }
    throw updateVoucherError;
  }

  const [record] = updateVoucherResult;

  if (!record) {
    const notFoundError = new Error(
      `voucher of id ${data.voucherId} does not exist`
    );
    notFoundError.statusCode = HTTP_STATUS.NOT_FOUND;
    throw notFoundError;
  }

  return record;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function deleteVoucherById(knex, data) {
  const promise = knex
    .from(TABLE_NAMES.VOUCHER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.voucherId,
          tenantId: data.tenantId,
          branchId: data.branchId,
          isDeleted: false,
        },
        TABLE_NAMES.VOUCHER
      )
    )
    .update({ isDeleted: true })
    .returning('id');

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  const [record] = result;

  if (!record) {
    const notFoundError = new Error(
      `voucher of id ${data.voucherId} does not exist`
    );
    notFoundError.statusCode = HTTP_STATUS.NOT_FOUND;
    throw notFoundError;
  }

  return record;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function incrementVoucherRedeemCount(knex, data) {
  const promise = knex
    .from(TABLE_NAMES.VOUCHER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.voucherId,
          tenantId: data.tenantId,
          branchId: data.branchId,
          isDeleted: false,
        },
        TABLE_NAMES.VOUCHER
      )
    )
    .increment('redeemCount', 1);

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  return result;
}
