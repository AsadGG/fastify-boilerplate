import snakeCase from 'lodash/snakeCase.js';
import { camelCaseKeys } from '../utilities/case-converter.js';

function transformKnexResponse(result) {
  if (!result) {
    return result;
  }
  if (result.command === 'INSERT') {
    if (result.rows.length) {
      return camelCaseKeys(result.rows);
    }
    return result.rowCount;
  }
  if (result.command === 'SELECT') {
    return camelCaseKeys(result.rows);
  }
  if (result.command === 'DELETE') {
    return result.rowCount;
  }
  if (result.command === 'UPDATE') {
    if (result.rows.length) {
      return camelCaseKeys(result.rows);
    }
    return result.rowCount;
  }
  return camelCaseKeys(result);
}

/**
 * @return { import("knex").Knex.Config }
 */
export function knexConfig(config) {
  return {
    client: 'pg',
    version: '14.10',
    connection: {
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DATABASE,
      timezone: 'UTC',
    },
    pool: {
      min: 0,
      max: 7,
      afterCreate: function (connection, done) {
        connection.query(`SET TIME ZONE 'UTC'`, function (error) {
          if (error) {
            done(error, connection);
          }
          done(false, connection);
        });
      },
    },
    wrapIdentifier: (value, origImpl) => {
      if (value === '*') return value;
      return origImpl(snakeCase(value));
    },
    postProcessResponse: (result) => {
      if (Array.isArray(result)) {
        return result.map(transformKnexResponse);
      }
      return transformKnexResponse(result);
    },
  };
}
