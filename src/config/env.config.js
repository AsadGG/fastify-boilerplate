import { Type } from '@sinclair/typebox';

const ENV_SCHEMA = Type.Object({
  WEB_SERVER_PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  WEB_SERVER_PROTOCOL: Type.String(),
  WEB_SERVER_HOST: Type.String(),

  DATABASE_URL: Type.String(),

  JWT_SECRET: Type.String(),

  REDIS_PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  REDIS_HOST: Type.String(),
});

function envConfig() {
  return {
    confKey: 'config',
    dotenv: {
      path: `.env`,
    },
    ajv: {
      customOptions: (ajv) => ajv.addSchema({ coerceTypes: true }),
    },
    schema: ENV_SCHEMA,
  };
}

export default envConfig;
