import type { Messages } from './types.js';
import { ko } from './ko.js';

export type { Messages };

export function t(): Messages {
  return ko;
}
