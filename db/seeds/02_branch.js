/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('office_user').del();

  await knex('client_payment').del();
  await knex('client').del();

  await knex('staff_schedule').del();
  await knex('staff').del();

  await knex('package').del();

  await knex('diet_plan_item').del();
  await knex('diet_plan').del();

  await knex('banner').del();

  await knex('branch').del();

  await knex('branch').insert({
    id: 'b1b1b2b2-b3b3-b4b4-b5b5-b6b6b7b7b8b8',
    tenant_id: 'f1f1f2f2-f3f3-f4f4-f5f5-f6f6f7f7f8f8',
    name: 'Main Branch',
    address: 'abc location',
    email: 'fitandfight@gmail.com',
    is_active: true,
  });
}
