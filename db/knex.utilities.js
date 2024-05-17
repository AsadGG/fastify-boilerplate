export const createUpdateTimestampFunction = `
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `;

export const dropUpdateTimestampFunction = `DROP FUNCTION IF EXISTS update_timestamp() CASCADE;`;

export function applyUpdateTimestampTrigger(tableName) {
  return `CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp()`;
}

export function dropType(typeName) {
  return `DROP TYPE ${typeName}`;
}
