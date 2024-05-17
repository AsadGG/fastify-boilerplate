'use strict';

import fastifyPlugin from 'fastify-plugin';

async function fastifyLogger(fastify, opts) {
  await fastify.addHook('onRequest', async function (request) {
    const rawURL = request.raw.url;
    for (const logger of opts.loggers) {
      if (rawURL) {
        if (rawURL.includes(logger.path)) {
          return (request.log = logger.logger);
        }
      }
    }
  });
}

export default fastifyPlugin(fastifyLogger);
