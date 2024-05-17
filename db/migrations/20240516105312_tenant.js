import { applyUpdateTimestampTrigger } from '../knex.utilities.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('tenant', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.text('name').notNullable();
      table.text('description').nullable();
      table.boolean('is_active').notNullable().defaultTo(false);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
    .raw(applyUpdateTimestampTrigger('tenant'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('tenant');
}
