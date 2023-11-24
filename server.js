'use strict';

import fastifyEnv from '@fastify/env';
import fastifyRedis from '@fastify/redis';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastify from 'fastify';
import app from './src/app.js';
import { SIGNAL } from './src/config/constants.js';
import { appLogger } from './src/config/logger.js';

const server = fastify({ logger: appLogger });

await server.register(fastifyEnv, {
  confKey: 'config',
  dotenv: true,
  schema: {
    type: 'object',
    properties: {
      APP_PORT: {
        type: 'string',
        default: 3000,
        maxLength: 5,
        minLength: 1,
      },
      REDIS_CLIENT_HOST: {
        type: 'string',
        default: 'localhost',
      },
      REDIS_CLIENT_PORT: {
        type: 'string',
        default: 6379,
        maxLength: 5,
        minLength: 1,
      },
    },
    required: ['REDIS_CLIENT_HOST', 'REDIS_CLIENT_PORT', 'APP_PORT'],
  },
});

await server.register(fastifyRedis, {
  host: server.config.REDIS_CLIENT_HOST,
  port: server.config.REDIS_CLIENT_PORT,
});

await server.register(fastifySwagger, {});
await server.register(fastifySwaggerUI, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'My Fastify App Documentation Title',
      description: 'My FirstApp Backend Documentation Description',
      version: '1.0.0',
    },
  },
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
});

await server.register(app);

await server.ready();

await server.listen({
  port: server.config.APP_PORT,
});

function gracefulShutdown() {
  server.close(() => {
    server.log.info({ message: `Server is shutting down` });
    process.exit(0);
  });
}

process.on(SIGNAL.SIGNIFICANT_TERMINATION, gracefulShutdown);
process.on(SIGNAL.SIGNIFICANT_INTERRUPT, gracefulShutdown);
