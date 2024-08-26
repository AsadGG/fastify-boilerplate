export function createRedisFunctions(redis) {
  async function get(key) {
    try {
      const stringifiedJson = await redis.get(key);
      if (stringifiedJson) {
        return JSON.parse(stringifiedJson);
      }
      return null;
    } catch {
      await redis.del(key);
      return null;
    }
  }

  async function set(key, value, expiryInSeconds) {
    const stringifiedJson = JSON.stringify(value);
    if (expiryInSeconds) {
      return redis.set(key, stringifiedJson, 'EX', expiryInSeconds);
    }
    return redis.set(key, stringifiedJson);
  }

  async function keys(pattern) {
    return redis.keys(pattern);
  }

  async function del(keys) {
    return redis.del(keys);
  }

  return {
    get,
    set,
    keys,
    del,
  };
}
