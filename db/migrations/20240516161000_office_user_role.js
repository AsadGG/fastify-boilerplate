/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('office_user_role', function (table) {
    table.uuid('tenant_id').notNullable();
    table.foreign('tenant_id').references('tenant.id');
    table.uuid('office_user_id').notNullable();
    table.foreign('office_user_id').references('office_user.id');
    table.uuid('role_id').notNullable();
    table.foreign('role_id').references('role.id');
    table.primary(['office_user_id', 'role_id']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('office_user_role');
}
