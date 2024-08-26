import snakeCase from 'lodash/snakeCase.js';

export function jsonAggregate(tableName, columns = [], as = undefined) {
  const alias = as ? snakeCase(as) : undefined;
  if (columns.length) {
    const formattedColumns = columns
      .map(
        (columns) =>
          `'${snakeCase(columns)}', ${tableName}."${snakeCase(columns)}"`
      )
      .join(', ');
    return `
    CASE WHEN COUNT(${tableName}.*) = 0 THEN
      '[]'::json
    ELSE
      JSON_AGG(JSON_BUILD_OBJECT(${formattedColumns}))
    END AS ${alias ?? tableName + 's'}
    `;
  }
  return `
    CASE WHEN COUNT(${tableName}.*) = 0 THEN
      '[]'::json
    ELSE
      JSON_AGG(${tableName}.*)
    END AS ${alias ?? tableName + 's'}
  `;
}

export function jsonBuildObject(tableName, columns = [], as = undefined) {
  const alias = as ? snakeCase(as) : undefined;
  if (columns.length) {
    const formattedColumns = columns
      .map(
        (columns) =>
          `'${snakeCase(columns)}', ${tableName}."${snakeCase(columns)}"`
      )
      .join(', ');
    return `
    CASE WHEN ${tableName}.id IS NULL THEN
      NULL
    ELSE
      JSON_BUILD_OBJECT(${formattedColumns})
    END AS ${alias ?? tableName}
    `;
  }
  return `
  CASE WHEN ${tableName}.id IS NULL THEN
    NULL
  ELSE
    ROW_TO_JSON(${tableName}.*)
  END AS ${alias ?? tableName}
  `;
}

export function addTableNamePrefixOnProperties(object, tableName) {
  if (!tableName) {
    throw new Error('parameter table name is required');
  }
  const newObject = {};
  Object.entries(object).forEach(([key, value]) => {
    const newKey = `${tableName}.${key}`;
    newObject[newKey] = value;
  });
  return newObject;
}

/**
 * Creates a query builder filter for text-based columns.
 *
 * @param {string} text - The search text to filter by.
 * @param {string|string[]} columns - The column or array of columns to filter.
 * @returns {(qb: import("knex").Knex.QueryBuilder<{}, any>) => import("knex").Knex.QueryBuilder<any, any>} - A function that applies the filter to a query builder instance.
 *
 * @throws {Error} If no columns are provided.
 * @throws {Error} If an empty array of columns is provided.
 */
export function textFilterHelper(text, columns) {
  if (!columns) {
    throw new Error(`columns parameter is required`);
  }
  const isColumnsArray = Array.isArray(columns);
  if (isColumnsArray && columns.length === 0) {
    throw new Error(`columns length can not 0`);
  }
  return (qb) => {
    if (!text) {
      return qb;
    }
    const searchText = text.replaceAll('%', '\\%');
    if (isColumnsArray) {
      return qb.andWhere((qb2) => {
        columns.forEach((column) => {
          qb2.orWhereILike(column, `%${searchText}%`);
        });
      });
    }
    return qb.andWhereILike(columns, `%${searchText}%`);
  };
}
