const createStaffAndClientEnrollmentNumberUniqueFunction = `
CREATE OR REPLACE FUNCTION staff_and_client_enrollment_number_unique()
  RETURNS TRIGGER
  AS $$
DECLARE
  existing_enrollment_number int;
  old_enrollment_number int;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.enrollment_number <> OLD.enrollment_number THEN
      SELECT
        COUNT(*) INTO existing_enrollment_number
      FROM (
        SELECT
          enrollment_number
        FROM
          staff
        WHERE
          enrollment_number = NEW.enrollment_number
          AND id != OLD.id
        UNION ALL
        SELECT
          enrollment_number
        FROM
          client
        WHERE
          enrollment_number = NEW.enrollment_number
          AND id != OLD.id) AS combined;
      IF existing_enrollment_number > 0 THEN
        RAISE EXCEPTION 'duplicate enrollment number found';
      END IF;
    END IF;
  ELSE
    SELECT
      COUNT(*) INTO existing_enrollment_number
    FROM (
      SELECT
        enrollment_number
      FROM
        staff
      WHERE
        enrollment_number = NEW.enrollment_number
      UNION ALL
      SELECT
        enrollment_number
      FROM
        client
      WHERE
        enrollment_number = NEW.enrollment_number) AS combined;
    IF existing_enrollment_number > 0 THEN
      RAISE EXCEPTION 'duplicate enrollment number found';
    END IF;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;
`;

const dropStaffAndClientEnrollmentNumberUniqueFunction = `DROP FUNCTION IF EXISTS staff_and_client_enrollment_number_unique() CASCADE;`;

function createTriggerCheckEnrollmentNumberUnique(tableName) {
  return `
 CREATE TRIGGER check_${tableName}_enrollment_number_unique
  BEFORE INSERT OR UPDATE ON ${tableName}
  FOR EACH ROW
  EXECUTE FUNCTION staff_and_client_enrollment_number_unique();
  `;
}

function dropTriggerCheckEnrollmentNumberUnique(tableName) {
  return `DROP TRIGGER IF EXISTS check_${tableName}_enrollment_number_unique ON ${tableName};
  `;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema
    .raw(createStaffAndClientEnrollmentNumberUniqueFunction)
    .raw(createTriggerCheckEnrollmentNumberUnique('staff'))
    .raw(createTriggerCheckEnrollmentNumberUnique('client'));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema
    .raw(dropTriggerCheckEnrollmentNumberUnique('client'))
    .raw(dropTriggerCheckEnrollmentNumberUnique('staff'))
    .raw(dropStaffAndClientEnrollmentNumberUniqueFunction);
}
