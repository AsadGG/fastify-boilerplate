/* eslint-disable no-console */
'use strict';

import select from '@inquirer/select';
import { glob } from 'glob';
import fs from 'node:fs';
import pretty from 'pino-pretty';
import prettyBytes from 'pretty-bytes';

const logFiles = await glob('logs/*');

if (!logFiles.length) {
  console.log('No Log Files In Logs Folder');
  process.exit(0);
}

const loggerTypes = [
  ...new Set(
    logFiles.map((logFiles) => {
      const logFilesSplit = logFiles.split('\\').pop().split('-');
      return [logFilesSplit[0], logFilesSplit[1]].join('-');
    })
  ),
];

const loggerType = await select({
  message: 'Select A Logger Type',
  choices: [
    { name: 'all', value: '' },
    ...loggerTypes.map((loggerType) => ({
      name: loggerType,
      value: loggerType,
    })),
  ],
});

const logFilesObjectPromise = logFiles
  .filter((logFilePath) => logFilePath.includes(loggerType))
  .map(async (logFilePath) => {
    const fileStats = await fs.promises.stat(logFilePath);
    const fileSize = fileStats.size;
    return {
      name: `name: ${logFilePath.split('\\').pop()} size: ${prettyBytes(
        fileSize
      )}`,
      path: logFilePath,
    };
  });

const logFilesObject = await Promise.all(logFilesObjectPromise);

const filePath = await select({
  message: 'Select A Log File',
  choices: logFilesObject.map((logFile) => ({
    name: logFile.name,
    value: logFile.path,
  })),
});

const readableStream = fs.createReadStream(filePath, {
  encoding: 'utf8',
});

const prettyStream = pretty({ colorize: true });

for await (const line of readableStream) {
  prettyStream.write(line);
}
