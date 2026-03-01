import { log } from './logger.js';
import { t } from '../locales/index.js';

export function showDiff(oldContent: string, newContent: string, filePath: string): void {
  const msg = t();
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  log(`\n--- ${filePath} (${msg.diffCurrent})`, 'red');
  log(`+++ ${filePath} (${msg.diffNew})`, 'green');

  const maxLines = Math.min(10, Math.max(oldLines.length, newLines.length));

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] || '';
    const newLine = newLines[i] || '';

    if (oldLine !== newLine) {
      if (oldLine) log(`- ${oldLine}`, 'red');
      if (newLine) log(`+ ${newLine}`, 'green');
    }
  }

  if (oldLines.length > 10 || newLines.length > 10) {
    log(`  ... (${msg.diffMoreLines(Math.max(oldLines.length, newLines.length) - 10)})`, 'dim');
  }
  console.log();
}
