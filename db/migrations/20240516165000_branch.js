import { createTriggerUpdateTimestampTrigger } from '../knex.utilities.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('branch', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('tenant_id').notNullable();
      table.foreign('tenant_id').references('tenant.id');
      table.text('name').notNullable();
      table.text('email').nullable();
      table.text('address').nullable();
      table.decimal('latitude', 15, 12).nullable().defaultTo(0);
      table.decimal('longitude', 15, 12).nullable().defaultTo(0);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
      table.unique(['tenant_id', 'email'], {
        predicate: knex.whereRaw('is_deleted = false'),
      });
    })
    .raw(createTriggerUpdateTimestampTrigger('branch'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('branch');
}
