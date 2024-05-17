import { applyUpdateTimestampTrigger } from '../knex.utilities.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('tenant_config', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('tenant_id').notNullable();
      table.foreign('tenant_id').references('tenant.id');
      table.unique('tenant_id');
      table.uuid('theme').nullable();
      table.integer('gst_percentage').nullable();
      table.text('address').nullable();
      table.text('logo').nullable();
      table.text('email').nullable();
      table.text('banner').nullable();
      table.decimal('latitude', 4, 12).nullable();
      table.decimal('longitude', 4, 12).nullable();
      table.boolean('is_active').notNullable().defaultTo(false);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
    .raw(applyUpdateTimestampTrigger('tenant_config'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('tenant_config');
}
