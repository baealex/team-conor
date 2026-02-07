import type { Messages } from './types.js';

export const ko: Messages = {
  // init command
  initTitle: 'Team Conor - AI 팀 페르소나 설정',
  updateDetected: '기존 설정이 감지되었습니다. 업데이트 모드로 진행합니다.',
  nameRequired: '--no-interaction 모드에서는 --name 옵션이 필요합니다.',
  nameRequiredExample: '  예: team-conor init --name "홍길동" --no-interaction',
  enterName: '이름을 입력하세요',
  enterNameValidation: '이름을 입력해주세요',
  cancelled: '취소됨',
  personaFiles: '페르소나 파일:',
  memoryFiles: 'Memory 파일:',
  claudeMd: 'CLAUDE.md:',
  done: '완료!',
  teamIntro: (name: string) => `${name}님의 팀:`,
  teamMembers1: '  스티브 (제품 전략) | 엘런 (실행 PM) | 마르코 (UX)',
  teamMembers2: '  유나 (Frontend)   | 빅토르 (Backend)',
  usageHint: '사용법: "유나, 이 코드 리뷰해줘" 처럼 팀원을 호출하세요',

  // init command descriptions
  initDescription: 'AI 팀 페르소나를 프로젝트에 설정합니다',
  optionName: '사용자 이름 (비대화형 모드에서 필수)',
  optionForce: '기존 파일을 묻지 않고 덮어쓰기',
  optionNoInteraction: '비대화형 모드 (CI/CD 등)',

  // language selection
  selectLanguage: '언어를 선택하세요',

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

  // summary.md
  summaryComment1: '이 파일은 CLAUDE.md에서 참조됩니다.',
  summaryComment2: '프로젝트의 핵심 컨텍스트를 간결하게 유지하세요.',
  summaryComment3: '상세 내용은 다른 memory 파일에 기록하세요.',
  summaryProject: '<!-- 기술 스택, 아키텍처 요약 -->',
  summaryDecisions: '<!-- 최근 주요 결정 사항 -->',
  summaryActive: '<!-- 현재 작업 중인 내용 -->',
  summaryCreated: '+ summary.md',
  summaryKept: '- summary.md (기존 유지)',
};
