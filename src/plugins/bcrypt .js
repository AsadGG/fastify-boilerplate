'use strict';

import bcrypt from 'bcrypt';
import fp from 'fastify-plugin';

async function fastifyBcrypt(fastify, options) {
  const saltRounds = options.saltRounds || 10;

  /**
   * @param {string} password The data to be encrypted.
   * @returns {Promise<string>} A promise to be either resolved with the encrypted data salt or rejected with an Error
   */
  async function hash(password) {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * @param {string} password plain text password
   * @param {string} hash The data to be compared against.
   * @returns {Promise<boolean>} A promise to be either resolved with the comparison result salt or rejected with an Error
   */
  async function compare(password, hash) {
    return bcrypt.compare(password, hash);
  }

  fastify.decorate('bcrypt', { hash, compare });
}

const fastifyBcryptPlugin = fp(fastifyBcrypt);

export default fp(async function (fastify) {
  fastify.register(fastifyBcryptPlugin, {
    saltRounds: 12,
  });
});
