import { log } from './logger.js';

export function showDiff(oldContent: string, newContent: string, filePath: string): void {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  log(`\n--- ${filePath} (현재)`, 'red');
  log(`+++ ${filePath} (새 버전)`, 'green');

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
    log(`  ... (${Math.max(oldLines.length, newLines.length) - 10}줄 더 있음)`, 'dim');
  }
  console.log();
}
