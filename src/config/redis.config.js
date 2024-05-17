export function redisConfig(config) {
  return {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  };
}
