import { createTriggerUpdateTimestampTrigger } from '../knex.utilities.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .createTable('office_user', function (table) {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('tenant_id').notNullable();
      table.foreign('tenant_id').references('tenant.id');
      table.text('first_name').notNullable();
      table.text('last_name').notNullable();
      table.text('image').notNullable();
      table.text('password').notNullable();
      table.text('email').notNullable();
      table.text('address').notNullable();
      table.text('phone').notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.boolean('is_deleted').notNullable().defaultTo(false);
      table.timestamps(true, true);
      table.unique(['tenant_id', 'email'], {
        predicate: knex.whereRaw('is_deleted = false'),
      });
      table.unique(['tenant_id', 'phone'], {
        predicate: knex.whereRaw('is_deleted = false'),
      });
    })
    .raw(createTriggerUpdateTimestampTrigger('office_user'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('office_user');
}
