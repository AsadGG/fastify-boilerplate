import path from 'path';
import { GLOBAL_CONSTANTS } from '../../global-constants.js';

export function fileRoutesConfig() {
  return {
    routesFolder: path.join(GLOBAL_CONSTANTS.ROOT_PATH, 'src', 'routes'),
  };
}
