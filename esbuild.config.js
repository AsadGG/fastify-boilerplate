/* eslint-disable */
import * as esbuild from 'esbuild';
import { globSync } from 'glob';
import fs from 'fs';

const entryPointsGlobPattern = './**/*.js';
const ignoreGlobPattern = ['node_modules/**', 'esbuild.config.js'];

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

esbuild
  .build({
    entryPoints: globSync(entryPointsGlobPattern, {
      ignore: ignoreGlobPattern,
    }),
    minify: true,
    bundle: false,
    platform: 'node',
    outdir: 'dist',
    format: 'esm',
  })
  .then(() => {
    const data = fs.readFileSync('package.json', 'utf8');
    const object = JSON.parse(data);
    object.scripts = {
      start: 'node server.js',
    };
    object.devDependencies = {};
    fs.writeFileSync('dist/package.json', JSON.stringify(object, null, 2));
    fs.copyFileSync('.env-sample', 'dist/.env');
  })
  .catch((error) => {
    console.log('error :>> ', error);
  });
