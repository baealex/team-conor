import { ko } from './ko.js';
import type { Messages } from './types.js';

export type { Messages };

export function t(): Messages {
  return ko;
}
