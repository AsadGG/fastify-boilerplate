/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('voucher').del();

  await knex('role_permission').del();
  await knex('office_user_role').del();
  await knex('permission').del();
  await knex('role').del();

  await knex('office_user').del();

  await knex('branch').del();

  await knex('tenant').del();

  await knex('tenant').insert({
    id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    name: 'fit-and-fight',
    description: 'Fit And Fight',
    domain: 'localhost',
    is_active: true,
  });
}
