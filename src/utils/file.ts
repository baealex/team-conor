import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { log } from './logger.js';
import { showDiff } from './diff.js';

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

  if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf-8');

    if (oldContent === content) {
      log(`  - ${path.basename(filePath)} (변경 없음)`, 'dim');
      return;
    }

    if (isMemory) {
      log(`  - ${path.basename(filePath)} (기존 유지 - memory)`, 'yellow');
      return;
    }

    if (force) {
      // Non-interactive: 강제 덮어쓰기
    } else if (alwaysAsk) {
      const action = await confirmOverwrite(path.basename(filePath), oldContent, content);

      if (action === 'skip') {
        log(`  - ${path.basename(filePath)} (건너뜀)`, 'yellow');
        return;
      }

      if (action === 'backup') {
        const backupPath = `${filePath}.backup`;
        fs.writeFileSync(backupPath, oldContent);
        log(`  - ${path.basename(filePath)}.backup (백업 생성)`, 'dim');
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
  showDiff(oldContent, newContent, filePath);

  const response = await prompts({
    type: 'select',
    name: 'action',
    message: `${filePath} 파일이 이미 존재합니다`,
    choices: [
      { title: '덮어쓰기', value: 'overwrite' },
      { title: '건너뛰기', value: 'skip' },
      { title: '백업 후 덮어쓰기', value: 'backup' },
    ],
  });

  return response.action || 'skip';
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}
