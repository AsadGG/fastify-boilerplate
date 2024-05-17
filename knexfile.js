import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, `.env`),
});

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      timezone: 'UTC',
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function (connection, done) {
        connection.query(`SET TIME ZONE 'UTC'`, function (error) {
          if (error) {
            done(error, connection);
          }
          done(false, connection);
        });
      },
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  staging: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      timezone: 'UTC',
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function (connection, done) {
        connection.query(`SET TIME ZONE 'UTC'`, function (error) {
          if (error) {
            done(error, connection);
          }
          done(false, connection);
        });
      },
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      timezone: 'UTC',
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function (connection, done) {
        connection.query(`SET TIME ZONE 'UTC'`, function (error) {
          if (error) {
            done(error, connection);
          }
          done(false, connection);
        });
      },
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
