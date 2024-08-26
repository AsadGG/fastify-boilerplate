/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('office_user').del();

  await knex('office_user').insert({
    id: '0f110f22-0f33-4f44-8f55-0f660f770f88',
    tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    first_name: 'jack',
    last_name: 'harlow',
    image:
      'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    password: '$2a$12$p0VKVGMzLR4MX51HMUuobOPtdUbB94o19tIRZdCfOFWaNa2cg0OR6',
    email: 'jack@faf.com',
    address: 'test road abc',
    phone: '090078601',
  });
}
