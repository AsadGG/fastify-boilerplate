/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('tenant').del();

  const [tenant] = await knex('tenant')
    .insert({
      id: '084249de-3835-4d44-8a32-dc7c77380254',
      name: 'owrners',
      description: 'Owrners Freelance',
      is_active: true,
    })
    .returning('*');

  await knex('tenant_config').del();

  await knex('tenant_config').insert({
    tenant_id: tenant.id,
    gst_percentage: 10,
    address: 'abc',
    email: 'owrners@gmail.com',
    is_active: true,
  });

  await knex('system_config').del();

  await knex('system_config').insert({
    tenant_id: tenant.id,
    domain: 'localhost',
    domain_type: 'OWNER',
    is_active: true,
  });
}
