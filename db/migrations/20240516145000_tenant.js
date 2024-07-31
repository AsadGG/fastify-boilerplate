import { createTriggerUpdateTimestampTrigger } from '../knex.utilities.js';

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
      table.text('logo').nullable();
      table.text('domain').notNullable();
      table.integer('gst_percentage').nullable().defaultTo(0);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
      table.unique('domain', {
        predicate: knex.whereRaw('is_deleted = false'),
      });
    })
    .raw(createTriggerUpdateTimestampTrigger('tenant'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('tenant');
}
