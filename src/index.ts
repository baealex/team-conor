#!/usr/bin/env node

import { createRequire } from 'module';
import { Command } from 'commander';
import { run as initRun } from './commands/init.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string; description: string };

const program = new Command();

program
  .name('team-conor')
  .description(pkg.description)
  .version(pkg.version, '-v, --version');

program
  .command('init', { isDefault: true })
  .description('Set up AI team personas / AI 팀 페르소나 설정')
  .option('--name <name>', 'User name / 사용자 이름')
  .option('-y, --force', 'Overwrite without asking / 묻지 않고 덮어쓰기', false)
  .option('--no-interaction', 'Non-interactive mode / 비대화형 모드')
  .option('--lang <locale>', 'Language: ko, en, ja / 언어 선택')
  .action(async (options) => {
    await initRun(options);
  });

program.parse();
