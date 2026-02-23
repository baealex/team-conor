import type { Messages } from './types.js';

export const ko: Messages = {
  // init command
  initTitle: 'Team Conor - AI 팀 페르소나 설정',
  updateDetected: '기존 설정이 감지되었습니다. 업데이트 모드로 진행합니다.',
  nameRequired: '--no-interaction 모드에서는 --name 옵션이 필요합니다.',
  nameRequiredExample: '  예: team-conor --name "홍길동" --no-interaction --agent claude',
  enterName: '이름을 입력하세요',
  enterNameValidation: '이름을 입력해주세요',
  cancelled: '취소됨',
  personaFiles: '페르소나 파일:',
  memoryFiles: 'Memory 파일:',
  conorMd: 'CONOR.md:',
  agentFiles: '에이전트 파일:',
  done: '완료!',
  teamIntro: (name: string) => `${name}님의 팀:`,
  teamMembers1: '  스티브 (제품 전략) | 엘런 (실행 PM) | 마르코 (UX)',
  teamMembers2: '  유나 (Frontend)   | 빅토르 (Backend)',
  usageHint: '사용법: "유나, 이 코드 리뷰해줘" 처럼 팀원을 호출하세요',

  // agent selection
  selectAgent: 'AI 도구를 선택하세요 (스페이스바로 복수 선택)',
  agentClaude: 'Claude (CLAUDE.md)',
  agentCodex: 'Codex (AGENTS.md)',
  agentCustom: '직접 입력',
  enterAgentFilename: '파일명을 입력하세요 (예: CURSOR.md)',
  agentRequired: '--no-interaction 모드에서는 --agent 옵션이 필요합니다.',

  // migration
  migrationDetected: '기존 CLAUDE.md에서 CONOR.md 마이그레이션을 진행합니다.',

  // init command descriptions
  initDescription: 'AI 팀 페르소나를 프로젝트에 설정합니다',
  optionName: '사용자 이름 (비대화형 모드에서 필수)',
  optionForce: '기존 파일을 묻지 않고 덮어쓰기',
  optionNoInteraction: '비대화형 모드 (CI/CD 등)',
  agentOption: 'AI 도구 선택 (claude, codex, 또는 파일명)',

  // file utils
  noChange: '변경 없음',
  keepMemory: '기존 유지 - memory',
  skipped: '건너뜀',
  backupCreated: '백업 생성',
  fileExists: '파일이 이미 존재합니다',
  overwrite: '덮어쓰기',
  skip: '건너뛰기',
  backupAndOverwrite: '백업 후 덮어쓰기',

  // diff
  diffCurrent: '현재',
  diffNew: '새 버전',
  diffMoreLines: (count: number) => `${count}줄 더 있음`,

  // summary.md (Zettelkasten index)
  summaryComment1: 'Zettelkasten 기반 메모리 인덱스',
  summaryComment2: '이 파일은 항상 AI 컨텍스트에 로드됩니다. 최소한으로 유지하세요.',
  summaryComment3: '각 항목은 한 줄로, chunks/ 디렉토리의 상세 파일을 참조합니다.',
  summaryComment4: '형식: - [ID](chunks/ID.md) 요약 | #태그',
  summaryProject: '<!-- [P-ID](chunks/P-ID.md) 형식으로 프로젝트 정보 참조 추가 -->',
  summaryDecisions: '<!-- [D-ID](chunks/D-ID.md) 형식으로 결정 사항 참조 추가 -->',
  summaryLearnings: '<!-- [L-ID](chunks/L-ID.md) 형식으로 학습 내용 참조 추가 -->',
  summaryCreated: '+ summary.md (Zettelkasten index)',
  summaryKept: '- summary.md (기존 유지)',

  // chunks
  chunksReady: '+ chunks/ (atomic notes directory)',

  // CONOR.md template markers
  templateRegionUpdated: '템플릿 영역 업데이트',
  templateRegionNoChange: '템플릿 영역 변경 없음',

  // Agent file markers
  agentRegionUpdated: '에이전트 영역 업데이트',
  agentRegionNoChange: '에이전트 영역 변경 없음',

  // summary command
  summaryDescription: 'chunks에서 summary.md를 자동 생성합니다',
  summaryNoChunksDir: '.conor/memory/chunks/ 디렉토리가 없습니다. 먼저 team-conor init을 실행하세요.',
  summaryNoChunks: 'chunks 디렉토리에 .md 파일이 없습니다.',
  summaryNoValidChunks: '유효한 chunk 파일이 없습니다. frontmatter(type, date)를 확인하세요.',
  summaryGenerated: (count: number) => `summary.md 생성 완료 (${count}개 chunk)`,
};
