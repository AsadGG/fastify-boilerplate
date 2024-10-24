export function getSuperAdminKeysPattern(superAdminId) {
  return `SUPER_ADMIN:${superAdminId}*`;
}

export function getSuperAdminAccessTokenKey(superAdminId, token) {
  return `SUPER_ADMIN:${superAdminId}:ACCESS_TOKEN:${token}`;
}

export function getSuperAdminRefreshTokenKey(superAdminId, token) {
  return `SUPER_ADMIN:${superAdminId}:REFRESH_TOKEN:${token}`;
}

export function getTenantAdminKeysPattern(tenantId, tenantAdminId) {
  return `TENANT:${tenantId}:TENANT_ADMIN:${tenantAdminId}*`;
}

export function getTenantAdminAccessTokenKey(tenantId, tenantAdminId, token) {
  return `TENANT:${tenantId}:TENANT_ADMIN:${tenantAdminId}:ACCESS_TOKEN:${token}`;
}

export function getTenantAdminRefreshTokenKey(tenantId, tenantAdminId, token) {
  return `TENANT:${tenantId}:TENANT_ADMIN:${tenantAdminId}:REFRESH_TOKEN:${token}`;
}

export function getOfficeUserKeysPattern(tenantId, officeUserId) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}*`;
}

export function getOfficeUserAccessTokenKey(tenantId, officeUserId, token) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:ACCESS_TOKEN:${token}`;
}

export function getOfficeUserRefreshTokenKey(tenantId, officeUserId, token) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:REFRESH_TOKEN:${token}`;
}
