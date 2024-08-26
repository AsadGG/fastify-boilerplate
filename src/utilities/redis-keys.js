export function getAccessTokenKey(tenantId, token) {
  return `TENANT:${tenantId}:OFFICE_USER_ACCESS_TOKEN:${token}`;
}

export function getRefreshTokenKey(tenantId, token) {
  return `TENANT:${tenantId}:OFFICE_USER_REFRESH_TOKEN:${token}`;
}

export function getOfficeUserBranchesKey(tenantId, officeUserId) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:BRANCHES`;
}

export function getOfficeUserPermissionsKey(tenantId, officeUserId) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:PERMISSIONS`;
}
