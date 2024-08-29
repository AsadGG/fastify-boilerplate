export function getOfficeUserKeysPattern(tenantId, officeUserId) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}*`;
}

export function getAccessTokenKey(tenantId, officeUserId, token) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:ACCESS_TOKEN:${token}`;
}

export function getRefreshTokenKey(tenantId, officeUserId, token) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:REFRESH_TOKEN:${token}`;
}

export function getOfficeUserBranchesKey(tenantId, officeUserId) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:BRANCHES`;
}

export function getOfficeUserPermissionsKey(tenantId, officeUserId) {
  return `TENANT:${tenantId}:OFFICE_USER:${officeUserId}:PERMISSIONS`;
}
