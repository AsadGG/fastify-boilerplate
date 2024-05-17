export function JWTConfig(config) {
  return { secret: config.JWT_SECRET };
}
