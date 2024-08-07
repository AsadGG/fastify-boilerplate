import { Type } from '@sinclair/typebox';

const ENV_SCHEMA = Type.Object({
  WEB_SERVER_PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  WEB_SERVER_PROTOCOL: Type.String(),
  WEB_SERVER_HOST: Type.String(),
  WEB_SERVER_DOMAIN: Type.String(),

  DB_USER: Type.String(),
  DB_PASSWORD: Type.String(),
  DB_HOST: Type.String(),
  DB_PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  DATABASE: Type.String(),
  DATABASE_URL: Type.String(),

  JWT_SECRET: Type.String(),
  JWT_EXPIRES_IN: Type.String(),

  REDIS_PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  REDIS_HOST: Type.String(),

  S3_REGION: Type.String(),
  S3_ACCESS_KEY_ID: Type.String(),
  S3_SECRET_ACCESS_KEY: Type.String(),

  SENDGRID_API_KEY: Type.String(),
  SENDGRID_MAIL_FROM: Type.String(),

  PAYFAST_MERCHANT_ID: Type.String(),
  PAYFAST_SECURED_KEY: Type.String(),
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
