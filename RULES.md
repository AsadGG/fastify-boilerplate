#1 folder name should be in kebab-case.

#2 constant variable or constant objects that are used as enum should be in SCREAMING_SNAKE_CASE.

#3 normal variable should be in camelCase.

#4 all methods responsible for database access should be repository folder.

#5 database table creation and alteration should be done with migrations.

#6 database table primary key must be named id and foreign key must be table name followed by id. eg: user_id.

#7 database table data type values must be in SCREAMING_SNAKE_CASE.

#8 when adding environment add it in .env-sample and env.config.js also.

#9 environment variable should be access from fastify instance.

#10 logging should be done with request.log method on request object.

#11 if you have a new module create a different logger for it otherwise default AppLogger will be used.

#12 schemas should be made using TypeBox

#13 operationId should be added on all route schemas
