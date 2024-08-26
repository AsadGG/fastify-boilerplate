/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('branch').del();

  await knex('branch').insert({
    id: 'b1b1b2b2-b3b3-44b4-85b5-b6b6b7b7b8b8',
    tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    name: 'MAIN',
    address: 'abc location',
    email: 'fitandfight@gmail.com',
    general_sales_tax: 10,
    cash_transaction_tax: 10,
    online_transaction_tax: 10,
    is_active: true,
  });
}
