import { applyUpdateTimestampTrigger, dropType } from '../knex.utilities.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('system_config', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('tenant_id').notNullable();
      table.foreign('tenant_id').references('tenant.id');
      table.unique('tenant_id');
      table.jsonb('theme').nullable();
      table.text('domain').notNullable();
      table
        .enum('domain_type', ['OWNER', 'BRANCH'], {
          useNative: true,
          enumName: 'domain_type',
          schemaName: 'public',
        })
        .defaultTo('OWNER')
        .notNullable();
      table.boolean('is_active').notNullable().defaultTo(false);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
    .raw(applyUpdateTimestampTrigger('system_config'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('system_config').raw(dropType('domain_type'));
}
