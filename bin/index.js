#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', 'templates');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function showDiff(oldContent, newContent, filePath) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  log(`\n--- ${filePath} (현재)`, 'red');
  log(`+++ ${filePath} (새 버전)`, 'green');

  // 간단한 diff 표시 (첫 10줄만)
  const maxLines = Math.min(10, Math.max(oldLines.length, newLines.length));
  let hasMore = false;

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

async function confirmOverwrite(filePath, oldContent, newContent) {
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

async function writeFileWithConfirm(filePath, content, options = {}) {
  const { alwaysAsk = true, isMemory = false } = options;

  if (fs.existsSync(filePath)) {
    const oldContent = fs.readFileSync(filePath, 'utf-8');

    if (oldContent === content) {
      log(`  - ${path.basename(filePath)} (변경 없음)`, 'dim');
      return;
    }

    if (isMemory) {
      // memory 파일은 기본적으로 건너뜀
      log(`  - ${path.basename(filePath)} (기존 유지 - memory)`, 'yellow');
      return;
    }

    if (alwaysAsk) {
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

async function main() {
  console.log();
  log('Team Conor - AI 팀 페르소나 설정', 'cyan');
  console.log();

  const cwd = process.cwd();
  const isUpdate = fs.existsSync(path.join(cwd, 'CLAUDE.md'));

  if (isUpdate) {
    log('기존 설정이 감지되었습니다. 업데이트 모드로 진행합니다.', 'yellow');
    console.log();
  }

  const response = await prompts({
    type: 'text',
    name: 'userName',
    message: '이름을 입력하세요',
    validate: value => value.length > 0 ? true : '이름을 입력해주세요'
  });

  if (!response.userName) {
    log('취소됨', 'yellow');
    process.exit(0);
  }

  const userName = response.userName;

  // 디렉토리 생성
  const dirs = [
    path.join(cwd, '.conor', 'persona'),
    path.join(cwd, '.conor', 'memory'),
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log();
  log('페르소나 파일:', 'cyan');

  // 페르소나 파일 복사 (확인 후)
  const personaFiles = ['backend.md', 'designer.md', 'frontend.md', 'planner.md', 'pm.md'];

  for (const file of personaFiles) {
    const src = path.join(templatesDir, 'persona', file);
    const dest = path.join(cwd, '.conor', 'persona', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, { alwaysAsk: isUpdate });
  }

  // user.md 생성 (이름 치환)
  const userTemplate = fs.readFileSync(path.join(templatesDir, 'persona', 'user.md'), 'utf-8');
  const userContent = userTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(
    path.join(cwd, '.conor', 'persona', 'user.md'),
    userContent,
    { alwaysAsk: isUpdate }
  );

  console.log();
  log('Memory 파일:', 'cyan');

  // memory 파일 - 기존 파일이 있으면 건너뜀
  const memoryFiles = ['project.md', 'decisions.md', 'learnings.md'];

  for (const file of memoryFiles) {
    const src = path.join(templatesDir, 'memory', file);
    const dest = path.join(cwd, '.conor', 'memory', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, { isMemory: true });
  }

  // summary.md - 없으면 생성
  const summaryPath = path.join(cwd, '.conor', 'memory', 'summary.md');
  if (!fs.existsSync(summaryPath)) {
    const summaryContent = `# Memory Summary

<!--
이 파일은 CLAUDE.md에서 참조됩니다.
프로젝트의 핵심 컨텍스트를 간결하게 유지하세요.
상세 내용은 다른 memory 파일에 기록하세요.
-->

## Project
<!-- 기술 스택, 아키텍처 요약 -->

## Recent Decisions
<!-- 최근 주요 결정 사항 -->

## Active Context
<!-- 현재 작업 중인 내용 -->
`;
    fs.writeFileSync(summaryPath, summaryContent);
    log(`  + summary.md`, 'green');
  } else {
    log(`  - summary.md (기존 유지)`, 'yellow');
  }

  console.log();
  log('CLAUDE.md:', 'cyan');

  // CLAUDE.md 생성 (이름 치환)
  const claudeTemplate = fs.readFileSync(path.join(templatesDir, 'CLAUDE.md'), 'utf-8');
  const claudeContent = claudeTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(
    path.join(cwd, 'CLAUDE.md'),
    claudeContent,
    { alwaysAsk: isUpdate }
  );

  console.log();
  log('완료!', 'green');
  console.log();
  log(`${userName}님의 팀:`, 'cyan');
  log('  스티브 (제품 전략) | 엘런 (실행 PM) | 마르코 (UX)', 'dim');
  log('  유나 (Frontend)   | 빅토르 (Backend)', 'dim');
  console.log();
  log('사용법: "유나, 이 코드 리뷰해줘" 처럼 팀원을 호출하세요', 'dim');
  console.log();
}

main().catch(console.error);
