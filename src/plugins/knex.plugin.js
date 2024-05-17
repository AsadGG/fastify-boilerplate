'use strict';

import fastifyPlugin from 'fastify-plugin';
import knex from 'knex';

async function fastifyKnexJS(fastify, opts) {
  const handler = knex(opts);
  await fastify.decorate('knex', handler).addHook('onClose', (instance) => {
    /* istanbul ignore else */
    if (instance.knex === handler) {
      instance.knex.destroy();
      delete instance.knex;
    }
  });
}

export default fastifyPlugin(fastifyKnexJS, '>=0.30.0');
