import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { log } from './logger.js';
import { showDiff } from './diff.js';
import { t } from '../locales/index.js';

export interface WriteOptions {
  alwaysAsk?: boolean;
  isMemory?: boolean;
  force?: boolean;
}

export async function writeFileWithConfirm(
  filePath: string,
  content: string,
  options: WriteOptions = {},
): Promise<void> {
  const { alwaysAsk = true, isMemory = false, force = false } = options;
  const msg = t();

  if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf-8');

    if (oldContent === content) {
      log(`  - ${path.basename(filePath)} (${msg.noChange})`, 'dim');
      return;
    }

    if (isMemory) {
      log(`  - ${path.basename(filePath)} (${msg.keepMemory})`, 'yellow');
      return;
    }

    if (force) {
      // Non-interactive: force overwrite
    } else if (alwaysAsk) {
      const action = await confirmOverwrite(path.basename(filePath), oldContent, content);

      if (action === 'skip') {
        log(`  - ${path.basename(filePath)} (${msg.skipped})`, 'yellow');
        return;
      }

      if (action === 'backup') {
        const backupPath = `${filePath}.backup`;
        fs.writeFileSync(backupPath, oldContent);
        log(`  - ${path.basename(filePath)}.backup (${msg.backupCreated})`, 'dim');
      }
    }
  }

  fs.writeFileSync(filePath, content);
  log(`  + ${path.basename(filePath)}`, 'green');
}

async function confirmOverwrite(
  filePath: string,
  oldContent: string,
  newContent: string,
): Promise<string> {
  const msg = t();
  showDiff(oldContent, newContent, filePath);

  const response = await prompts({
    type: 'select',
    name: 'action',
    message: `${filePath} ${msg.fileExists}`,
    choices: [
      { title: msg.overwrite, value: 'overwrite' },
      { title: msg.skip, value: 'skip' },
      { title: msg.backupAndOverwrite, value: 'backup' },
    ],
  });

  return response.action || 'skip';
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}
