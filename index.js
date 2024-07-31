import fastifyCORS from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import fastifyRedis from '@fastify/redis';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { fastifyBcrypt } from 'fastify-bcrypt';
import { bcryptConfig } from './src/config/bcrypt.config.js';
import envConfig from './src/config/env.config.js';
import { fileRoutesConfig } from './src/config/file-routes.config.js';
import { JWTConfig } from './src/config/jwt.config.js';
import { knexConfig } from './src/config/knex.config.js';
import { loggerConfig } from './src/config/logger.config.js';
import { mailerConfig } from './src/config/mailer.config.js';
import { multipartConfig } from './src/config/multipart.config.js';
import { redisConfig } from './src/config/redis.config.js';
import { s3Config } from './src/config/s3.config.js';
import { swaggerConfig, swaggerUIConfig } from './src/config/swagger.config.js';
import { createLogger } from './src/logger/logger.js';
import fileRoutes from './src/plugins/file-routes.plugin.js';
import fastifyJWT from './src/plugins/jwt.plugin.js';
import fastifyKnex from './src/plugins/knex.plugin.js';
import fastifyLogger from './src/plugins/logger.plugin.js';
import fastifyMailer from './src/plugins/mailer.plugin.js';
import fastifyS3 from './src/plugins/s3.plugin.js';

process.env.TZ = 'UTC';

function ajvFilePlugin(ajv) {
  return ajv.addKeyword({
    keyword: 'isFile',
    compile: (_schema, parent) => {
      parent.type = 'file';
      delete parent.isFile;
      return () => true;
    },
  });
}

const appLogger = createLogger('APP_LOGGER');
const server = fastify({
  logger: appLogger,
  ajv: {
    plugins: [ajvFilePlugin],
  },
});

await server.register(fastifyEnv, envConfig());

await server.register(fastifyKnex, knexConfig(server.config));

await server.register(fastifyJWT, JWTConfig(server.config));

await server.register(fastifyRedis, redisConfig(server.config));

await server.register(fastifyLogger, loggerConfig());

await server.register(fastifyBcrypt, bcryptConfig());

await server.register(fastifyFormbody);

await server.register(fastifyMultipart, multipartConfig());

await server.register(fastifyS3, s3Config(server.config));

await server.register(fastifySwagger, swaggerConfig());

await server.register(fastifySwaggerUi, swaggerUIConfig());

await server.register(fileRoutes, fileRoutesConfig());

await server.register(fastifyCORS, { origin: '*' });

await server.register(fastifyMailer, mailerConfig(server.config));

await server.ready();

await server.listen({
  host: server.config.WEB_SERVER_HOST,
  port: server.config.WEB_SERVER_PORT,
  listenTextResolver: () => {
    return `server is listening at http://localhost:3600`;
  },
});

function gracefulShutdown() {
  server.close(() => {
    server.log.info({ message: `Server is shutting down` });
    process.exit(0);
  });
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
