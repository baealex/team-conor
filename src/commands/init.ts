import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import * as logger from '../utils/logger.js';
import { writeFileWithConfirm, ensureDir } from '../utils/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', '..', 'templates');

interface InitOptions {
  name?: string;
  force: boolean;
  interaction: boolean;
}

export async function run(options: InitOptions): Promise<void> {
  logger.newline();
  logger.info('Team Conor - AI 팀 페르소나 설정');
  logger.newline();

  const cwd = process.cwd();
  const isUpdate = fs.existsSync(path.join(cwd, 'CLAUDE.md'));

  if (isUpdate) {
    logger.warn('기존 설정이 감지되었습니다. 업데이트 모드로 진행합니다.');
    logger.newline();
  }

  let userName = options.name;

  if (!userName) {
    if (!options.interaction) {
      logger.error('--no-interaction 모드에서는 --name 옵션이 필요합니다.');
      logger.dim('  예: team-conor init --name "홍길동" --no-interaction');
      process.exit(1);
    }

    const response = await prompts({
      type: 'text',
      name: 'userName',
      message: '이름을 입력하세요',
      validate: (value: string) => (value.length > 0 ? true : '이름을 입력해주세요'),
    });

    if (!response.userName) {
      logger.warn('취소됨');
      process.exit(0);
    }

    userName = response.userName as string;
  }

  // 디렉토리 생성
  ensureDir(path.join(cwd, '.conor', 'persona'));
  ensureDir(path.join(cwd, '.conor', 'memory'));

  const writeOpts = {
    alwaysAsk: isUpdate && options.interaction,
    force: options.force,
  };

  logger.newline();
  logger.info('페르소나 파일:');

  // 페르소나 파일 복사
  const personaFiles = ['backend.md', 'designer.md', 'frontend.md', 'planner.md', 'pm.md'];

  for (const file of personaFiles) {
    const src = path.join(templatesDir, 'persona', file);
    const dest = path.join(cwd, '.conor', 'persona', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, writeOpts);
  }

  // user.md 생성 (이름 치환)
  const userTemplate = fs.readFileSync(path.join(templatesDir, 'persona', 'user.md'), 'utf-8');
  const userContent = userTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(
    path.join(cwd, '.conor', 'persona', 'user.md'),
    userContent,
    writeOpts,
  );

  logger.newline();
  logger.info('Memory 파일:');

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
    logger.success('  + summary.md');
  } else {
    logger.warn('  - summary.md (기존 유지)');
  }

  logger.newline();
  logger.info('CLAUDE.md:');

  // CLAUDE.md 생성 (이름 치환)
  const claudeTemplate = fs.readFileSync(path.join(templatesDir, 'CLAUDE.md'), 'utf-8');
  const claudeContent = claudeTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(path.join(cwd, 'CLAUDE.md'), claudeContent, writeOpts);

  logger.newline();
  logger.success('완료!');
  logger.newline();
  logger.info(`${userName}님의 팀:`);
  logger.dim('  스티브 (제품 전략) | 엘런 (실행 PM) | 마르코 (UX)');
  logger.dim('  유나 (Frontend)   | 빅토르 (Backend)');
  logger.newline();
  logger.dim('사용법: "유나, 이 코드 리뷰해줘" 처럼 팀원을 호출하세요');
  logger.newline();
}
