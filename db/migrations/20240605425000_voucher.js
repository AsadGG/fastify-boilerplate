import {
  createTriggerUpdateTimestampTrigger,
  dropType,
} from '../knex.utilities.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('voucher', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('tenant_id').notNullable();
      table.foreign('tenant_id').references('tenant.id');
      table.uuid('branch_id').notNullable();
      table.foreign('branch_id').references('branch.id');
      table.timestamp('valid_from').notNullable();
      table.timestamp('valid_until').notNullable();
      table.integer('redeem_count').notNullable().defaultTo(0);
      table.integer('max_redeem').notNullable();
      table.text('code').notNullable();
      table.decimal('value', 10, 2).notNullable();
      table
        .enum('type', ['AMOUNT', 'PERCENTAGE'], {
          useNative: true,
          enumName: 'faf_discount_type',
          schemaName: 'public',
        })
        .notNullable();
      table
        .enum('visibility', ['ALL', 'ADMIN', 'CLIENT'], {
          useNative: true,
          enumName: 'faf_visibility_type',
          schemaName: 'public',
        })
        .notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
      table.unique(['tenant_id', 'branch_id', 'code'], {
        predicate: knex.whereRaw('is_deleted = false'),
      });
    })
    .raw(createTriggerUpdateTimestampTrigger('voucher'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema
    .dropTable('voucher')
    .raw(dropType('faf_discount_type'))
    .raw(dropType('faf_visibility_type'));
}
