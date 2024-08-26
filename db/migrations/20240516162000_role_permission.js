/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('role_permission', function (table) {
    table.uuid('tenant_id').notNullable();
    table.foreign('tenant_id').references('tenant.id');
    table.uuid('role_id').notNullable();
    table.foreign('role_id').references('role.id');
    table.uuid('permission_id').notNullable();
    table.foreign('permission_id').references('permission.id');
    table.primary(['role_id', 'permission_id']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('role_permission');
}
