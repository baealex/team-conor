import type { Messages, Locale } from './types.js';
import { ko } from './ko.js';
import { en } from './en.js';
import { ja } from './ja.js';

export type { Messages, Locale };

const locales: Record<Locale, Messages> = { ko, en, ja };

let currentLocale: Locale = 'ko';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(): Messages {
  return locales[currentLocale];
}

export const localeChoices: { title: string; value: Locale }[] = [
  { title: '한국어', value: 'ko' },
  { title: 'English', value: 'en' },
  { title: '日本語', value: 'ja' },
];
