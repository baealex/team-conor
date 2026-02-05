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
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function main() {
  console.log();
  log('🎭 Team Conor - Claude Code 팀 페르소나 설정', 'cyan');
  console.log();

  // 사용자 이름 입력받기
  const response = await prompts({
    type: 'text',
    name: 'userName',
    message: '사용자 이름을 입력하세요 (예: 코너 (Conor))',
    validate: value => value.length > 0 ? true : '이름을 입력해주세요'
  });

  if (!response.userName) {
    log('설정이 취소되었습니다.', 'yellow');
    process.exit(0);
  }

  const userName = response.userName;
  const cwd = process.cwd();

  // 디렉토리 생성
  const dirs = [
    path.join(cwd, '.conor', 'persona'),
    path.join(cwd, '.conor', 'memory'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`  📁 ${path.relative(cwd, dir)}/`, 'dim');
    }
  }

  // 템플릿 파일 복사
  const personaFiles = [
    'backend.md',
    'designer.md',
    'frontend.md',
    'planner.md',
    'scrum-master.md',
  ];

  for (const file of personaFiles) {
    const src = path.join(templatesDir, 'persona', file);
    const dest = path.join(cwd, '.conor', 'persona', file);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      log(`  ✓ .conor/persona/${file}`, 'green');
    }
  }

  // user.md 생성 (사용자 이름 포함)
  const userTemplate = fs.readFileSync(
    path.join(templatesDir, 'persona', 'user.md'),
    'utf-8'
  );
  const userContent = userTemplate.replace(/\{\{userName\}\}/g, userName);
  fs.writeFileSync(path.join(cwd, '.conor', 'persona', 'user.md'), userContent);
  log(`  ✓ .conor/persona/user.md`, 'green');

  // CLAUDE.md 생성 (사용자 이름 포함)
  const claudeTemplate = fs.readFileSync(
    path.join(templatesDir, 'CLAUDE.md'),
    'utf-8'
  );
  const claudeContent = claudeTemplate.replace(/\{\{userName\}\}/g, userName);
  fs.writeFileSync(path.join(cwd, 'CLAUDE.md'), claudeContent);
  log(`  ✓ CLAUDE.md`, 'green');

  console.log();
  log('✨ 설정 완료!', 'green');
  log(`   ${userName}님의 팀이 준비되었습니다.`, 'dim');
  console.log();
  log('팀원들:', 'cyan');
  log('  스티브 - 잡스식 프로덕트 비저너리 (기획자)', 'dim');
  log('  엘런 - 머스크식 실행력 PM (스크럼 마스터)', 'dim');
  log('  마르코 - 노먼 제자, 애플 출신 (디자이너)', 'dim');
  log('  유나 - React 코어팀, Vercel 출신 (프론트엔드)', 'dim');
  log('  빅토르 - 25년차 아키텍트 (백엔드)', 'dim');
  console.log();
}

main().catch(console.error);
