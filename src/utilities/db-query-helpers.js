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
