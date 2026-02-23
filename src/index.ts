#!/usr/bin/env node

import { createRequire } from 'module';
import { Command } from 'commander';
import { run as initRun } from './commands/init.js';
import { run as summaryRun } from './commands/summary.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('team-conor')
  .description(pkg.description)
  .version(pkg.version, '-v, --version')
  .option('--name <name>', '사용자 이름')
  .option('-y, --force', '묻지 않고 덮어쓰기', false)
  .option('--no-interaction', '비대화형 모드 (CI/CD 등)')
  .option('--agent <agents...>', 'AI 도구 선택 (claude, codex, 또는 파일명)')
  .action(async (options) => {
    await initRun({ ...options, version: pkg.version });
  });

program
  .command('summary')
  .description('chunks에서 summary.md 자동 생성')
  .action(async () => {
    await summaryRun();
  });

program.parse();
