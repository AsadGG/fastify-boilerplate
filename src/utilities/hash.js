import { createHash } from 'crypto';

export function getSha256Hash(data) {
  return createHash('sha256').update(data).digest('hex');
}
