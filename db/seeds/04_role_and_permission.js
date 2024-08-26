const permissions = [
  {
    path: 'v1/admin/tenant/branch',
    name: 'getBranchById',
  },
  {
    path: 'v1/admin/tenant/branch',
    name: 'getBranches',
  },
  {
    path: 'v1/admin/tenant/branch/voucher',
    name: 'deleteVoucherById',
  },
  {
    path: 'v1/admin/tenant/branch/voucher',
    name: 'getVoucherById',
  },
  {
    path: 'v1/admin/tenant/branch/voucher',
    name: 'updateVoucherById',
  },
  {
    path: 'v1/admin/tenant/branch/voucher',
    name: 'getVouchers',
  },
  {
    path: 'v1/admin/tenant/branch/voucher',
    name: 'createVoucher',
  },
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('office_user_role').del();
  await knex('role_permission').del();
  await knex('permission').del();
  await knex('role').del();

  const [role] = await knex('role')
    .insert({
      tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
      name: 'ADMIN',
    })
    .returning('id');

  await knex('office_user_role').insert({
    tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    office_user_id: '0f110f22-0f33-4f44-8f55-0f660f770f88',
    role_id: role.id,
  });

  const permissionsData = permissions.map((permission) => ({
    tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    name: permission.name,
    path: permission.path,
  }));
  permissionsData.push({
    tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    name: 'BRANCH(b1b1b2b2-b3b3-44b4-85b5-b6b6b7b7b8b8)',
    path: null,
  });

  const permissions2 = await knex('permission')
    .insert(permissionsData)
    .returning('id');

  const rolePermissionData = permissions2.map((permission) => ({
    tenant_id: 'f1f1f2f2-f3f3-44f4-85f5-f6f6f7f7f8f8',
    role_id: role.id,
    permission_id: permission.id,
  }));

  await knex('role_permission').insert(rolePermissionData);
}
