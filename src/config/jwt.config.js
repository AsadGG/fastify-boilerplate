export function JWTConfig(config) {
  return {
    access: {
      namespace: 'access',
      secret: config.ACCESS_JWT_SECRET,
      sign: { expiresIn: config.ACCESS_JWT_EXPIRES_IN },
    },
    refresh: {
      namespace: 'refresh',
      secret: config.REFRESH_JWT_SECRET,
      sign: { expiresIn: config.REFRESH_JWT_EXPIRES_IN },
    },
  };
}
