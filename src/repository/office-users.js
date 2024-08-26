import {
  addTableNamePrefixOnProperties,
  jsonAggregate,
} from '#utilities/db-query-helpers.js';
import { HTTP_STATUS } from '#utilities/http-status.js';
import { promiseHandler } from '#utilities/promise-handler.js';
import { TABLE_NAMES } from '#utilities/table-names.js';
import { Boolean } from '@sinclair/typebox';
import uniqBy from 'lodash/uniqBy.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getOfficeUserById(knex, data) {
  const officeUserColumns = [
    `${TABLE_NAMES.OFFICE_USER}.id`,
    `${TABLE_NAMES.OFFICE_USER}.firstName`,
    `${TABLE_NAMES.OFFICE_USER}.lastName`,
    `${TABLE_NAMES.OFFICE_USER}.image`,
    `${TABLE_NAMES.OFFICE_USER}.email`,
    `${TABLE_NAMES.OFFICE_USER}.address`,
    `${TABLE_NAMES.OFFICE_USER}.phone`,
    `${TABLE_NAMES.OFFICE_USER}.isActive`,
    knex.raw(jsonAggregate(TABLE_NAMES.PERMISSION, ['id', 'name', 'path'])),
  ];

  const promise = knex
    .from(TABLE_NAMES.OFFICE_USER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.officeUserId,
          tenantId: data.tenantId,
          isDeleted: false,
        },
        TABLE_NAMES.OFFICE_USER
      )
    )
    .select(officeUserColumns)
    .leftJoin(
      `${TABLE_NAMES.OFFICE_USER_ROLE}`,
      `${TABLE_NAMES.OFFICE_USER}.id`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.officeUserId`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE}`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.roleId`,
      `${TABLE_NAMES.ROLE}.id`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE_PERMISSION}`,
      `${TABLE_NAMES.ROLE}.id`,
      `${TABLE_NAMES.ROLE_PERMISSION}.roleId`
    )
    .leftJoin(
      `${TABLE_NAMES.PERMISSION}`,
      `${TABLE_NAMES.ROLE_PERMISSION}.permissionId`,
      `${TABLE_NAMES.PERMISSION}.id`
    )
    .groupBy(`${TABLE_NAMES.OFFICE_USER}.id`)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    const notFoundError = new Error(
      `office user of ${data.officeUserId} does not exist`
    );
    notFoundError.statusCode = HTTP_STATUS.NOT_FOUND;
    throw notFoundError;
  }

  const tempObject = uniqBy(result.permissions, 'id').reduce(
    (previousValue, currentValue) => {
      const regex =
        /^BRANCH\(([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89AaBb][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12})\)$/;
      const regExpExecArray = regex.exec(currentValue.name);
      if (regExpExecArray) {
        previousValue.branches.push(regExpExecArray[1]);
        return previousValue;
      }
      previousValue.permissions.push(currentValue);
      return previousValue;
    },
    { permissions: [], branches: [] }
  );

  const records = { ...result, ...tempObject };

  return records;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getOfficeUserByEmail(knex, data) {
  const officeUserColumns = [
    `${TABLE_NAMES.OFFICE_USER}.id`,
    `${TABLE_NAMES.OFFICE_USER}.firstName`,
    `${TABLE_NAMES.OFFICE_USER}.lastName`,
    `${TABLE_NAMES.OFFICE_USER}.image`,
    `${TABLE_NAMES.OFFICE_USER}.password`,
    `${TABLE_NAMES.OFFICE_USER}.email`,
    `${TABLE_NAMES.OFFICE_USER}.address`,
    `${TABLE_NAMES.OFFICE_USER}.phone`,
    `${TABLE_NAMES.OFFICE_USER}.isActive`,
    knex.raw(jsonAggregate(TABLE_NAMES.PERMISSION, ['id', 'name', 'path'])),
  ];

  const promise = knex
    .from(TABLE_NAMES.OFFICE_USER)
    .where(
      addTableNamePrefixOnProperties(
        {
          tenantId: data.tenantId,
          email: data.email,
          isDeleted: false,
        },
        TABLE_NAMES.OFFICE_USER
      )
    )
    .select(officeUserColumns)
    .leftJoin(
      `${TABLE_NAMES.OFFICE_USER_ROLE}`,
      `${TABLE_NAMES.OFFICE_USER}.id`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.officeUserId`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE}`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.roleId`,
      `${TABLE_NAMES.ROLE}.id`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE_PERMISSION}`,
      `${TABLE_NAMES.ROLE}.id`,
      `${TABLE_NAMES.ROLE_PERMISSION}.roleId`
    )
    .leftJoin(
      `${TABLE_NAMES.PERMISSION}`,
      `${TABLE_NAMES.ROLE_PERMISSION}.permissionId`,
      `${TABLE_NAMES.PERMISSION}.id`
    )
    .groupBy(`${TABLE_NAMES.OFFICE_USER}.id`)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  if (!result) {
    const error = new Error(`invalid credentials`);
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  const tempObject = uniqBy(result.permissions, 'id').reduce(
    (previousValue, currentValue) => {
      const regex =
        /^BRANCH\(([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89AaBb][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12})\)$/;
      const regExpExecArray = regex.exec(currentValue.name);
      if (regExpExecArray) {
        previousValue.branches.push(regExpExecArray[1]);
        return previousValue;
      }
      previousValue.permissions.push(currentValue);
      return previousValue;
    },
    { permissions: [], branches: [] }
  );

  const records = { ...result, ...tempObject };

  return records;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getOfficeUserBranches(knex, data) {
  const officeUserColumns = [
    knex.raw(jsonAggregate(TABLE_NAMES.PERMISSION, ['id', 'name'])),
  ];

  const promise = knex
    .from(TABLE_NAMES.OFFICE_USER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.officeUserId,
          tenantId: data.tenantId,
          isDeleted: false,
        },
        TABLE_NAMES.OFFICE_USER
      )
    )
    .where(`${TABLE_NAMES.PERMISSION}.name`, 'ilike', 'BRANCH(%)')
    .select(officeUserColumns)
    .leftJoin(
      `${TABLE_NAMES.OFFICE_USER_ROLE}`,
      `${TABLE_NAMES.OFFICE_USER}.id`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.officeUserId`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE}`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.roleId`,
      `${TABLE_NAMES.ROLE}.id`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE_PERMISSION}`,
      `${TABLE_NAMES.ROLE}.id`,
      `${TABLE_NAMES.ROLE_PERMISSION}.roleId`
    )
    .leftJoin(
      `${TABLE_NAMES.PERMISSION}`,
      `${TABLE_NAMES.ROLE_PERMISSION}.permissionId`,
      `${TABLE_NAMES.PERMISSION}.id`
    )
    .groupBy(`${TABLE_NAMES.OFFICE_USER}.id`)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  const branches = uniqBy(result.permissions, 'id')
    .map((permissions) => {
      const regex =
        /^BRANCH\(([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89AaBb][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12})\)$/;
      const regExpExecArray = regex.exec(permissions.name);
      if (regExpExecArray) {
        return regExpExecArray[1];
      }
      return null;
    })
    .filter((permissions) => Boolean(permissions));

  const records = { branches };

  return records;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function getOfficeUserPermissions(knex, data) {
  const officeUserColumns = [
    knex.raw(jsonAggregate(TABLE_NAMES.PERMISSION, ['id', 'name'])),
  ];

  const promise = knex
    .from(TABLE_NAMES.OFFICE_USER)
    .where(
      addTableNamePrefixOnProperties(
        {
          id: data.officeUserId,
          tenantId: data.tenantId,
          isDeleted: false,
        },
        TABLE_NAMES.OFFICE_USER
      )
    )
    .whereNot(`${TABLE_NAMES.PERMISSION}.name`, 'ilike', 'BRANCH(%)')
    .select(officeUserColumns)
    .leftJoin(
      `${TABLE_NAMES.OFFICE_USER_ROLE}`,
      `${TABLE_NAMES.OFFICE_USER}.id`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.officeUserId`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE}`,
      `${TABLE_NAMES.OFFICE_USER_ROLE}.roleId`,
      `${TABLE_NAMES.ROLE}.id`
    )
    .leftJoin(
      `${TABLE_NAMES.ROLE_PERMISSION}`,
      `${TABLE_NAMES.ROLE}.id`,
      `${TABLE_NAMES.ROLE_PERMISSION}.roleId`
    )
    .leftJoin(
      `${TABLE_NAMES.PERMISSION}`,
      `${TABLE_NAMES.ROLE_PERMISSION}.permissionId`,
      `${TABLE_NAMES.PERMISSION}.id`
    )
    .groupBy(`${TABLE_NAMES.OFFICE_USER}.id`)
    .first();

  const [result, error, ok] = await promiseHandler(promise);

  if (!ok) {
    throw error;
  }

  const permissions = uniqBy(result.permissions, 'id');

  const records = { permissions };

  return records;
}
