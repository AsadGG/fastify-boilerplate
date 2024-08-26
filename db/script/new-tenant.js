import { input } from '@inquirer/prompts';
import bcrypt from 'bcryptjs';

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
export async function script(knex) {
  const transaction = await knex.transaction();

  const tenantName = await input({ message: 'enter tenant name:  ' });
  if (!tenantName) {
    throw new Error('tenant name is required');
  }
  const tenantDomain = await input({ message: 'enter tenant domain:  ' });
  if (!tenantDomain) {
    throw new Error('tenant domain is required');
  }
  const tenantDescription = await input({
    message: 'enter tenant description (optional):  ',
  });
  const userFirstName = await input({ message: 'enter user first name:  ' });
  if (!userFirstName) {
    throw new Error('first name is required');
  }
  const userLastName = await input({ message: 'enter user last name:  ' });
  if (!userLastName) {
    throw new Error('last name is required');
  }
  const userEmail = await input({ message: 'enter user email:  ' });
  if (!userEmail) {
    throw new Error('email is required');
  }
  const userPhone = await input({ message: 'enter user phone:  ' });
  if (!userPhone) {
    throw new Error('phone is required');
  }
  const branchEmail = await input({
    message: 'enter branch email (optional):  ',
  });
  try {
    const [tenant] = await transaction('tenant')
      .insert({
        name: tenantName,
        description: tenantDescription ?? null,
        domain: tenantDomain,
        is_active: true,
      })
      .returning('*');

    const [officeUser] = await transaction('office_user')
      .insert({
        tenant_id: tenant.id,
        first_name: userFirstName,
        last_name: userLastName,
        image:
          'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        password: bcrypt.hashSync('12345678', 12),
        email: userEmail,
        address: 'test road abc',
        phone: userPhone,
      })
      .returning('*');

    const [branch] = await transaction('branch')
      .insert({
        tenant_id: tenant.id,
        name: 'Main Branch',
        address: 'abc location',
        email: branchEmail ?? null,
        general_sales_tax: 10,
        cash_transaction_tax: 10,
        online_transaction_tax: 10,
        is_active: true,
      })
      .returning('*');

    const [role] = await transaction('role')
      .insert({
        tenant_id: tenant.id,
        name: 'ADMIN',
      })
      .returning('id');

    await transaction('office_user_role').insert({
      tenant_id: tenant.id,
      office_user_id: officeUser.id,
      role_id: role.id,
    });

    const permissionsData = permissions.map((permission) => ({
      tenant_id: tenant.id,
      name: permission.name,
      path: permission.path,
    }));
    permissionsData.push({
      tenant_id: tenant.id,
      name: `BRANCH(${branch.id})`,
      path: null,
    });

    const permissions2 = await transaction('permission')
      .insert(permissionsData)
      .returning('id');

    const rolePermissionData = permissions2.map((permission) => ({
      tenant_id: tenant.id,
      role_id: role.id,
      permission_id: permission.id,
    }));

    await transaction('role_permission').insert(rolePermissionData);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
