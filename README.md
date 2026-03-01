# Team Conor

AI 코딩 어시스턴트(Claude)를 위한 팀 페르소나 시스템입니다.

## 왜 필요한가?

혼자 개발하면 코드 리뷰가 없습니다. AI에게 리뷰를 맡기면 "클린 코드를 작성하세요", "에러 핸들링을 추가하세요" 같은 추상적인 조언만 돌아옵니다.

실제 팀에서는 다릅니다. PM은 "이거 MVP에 필요해?"라고 묻고, 디자이너는 "로딩 상태 없는데?"라고 지적하고, 백엔드 개발자는 "N+1 쿼리 아니야?"라고 잡아줍니다. 각자의 전문 영역에서 **구체적인 문제**를 **구체적인 해결책**과 함께 제시합니다.

Team Conor는 이 경험을 AI 코딩 어시스턴트에 심어줍니다. 5명의 전문가 페르소나가 각자의 관점에서 코드를 검토하고, 문제 발견 시 해결 방향까지 제안합니다.

## 설치

```bash
npx team-conor
```

### CLI 옵션

```bash
# 대화형 설정 (기본)
npx team-conor init

# AI 도구 선택 (claude, codex, 또는 커스텀 파일명)
npx team-conor init --agent claude
npx team-conor init --agent codex
npx team-conor init --agent claude codex  # 동시에 여러 도구 지원

# 비대화형 모드 (CI/CD 등 인터렉션 불가 환경)
npx team-conor init --name "홍길동" --agent claude --no-interaction

# 기존 파일 강제 덮어쓰기
npx team-conor init --name "홍길동" -y

# 도움말 / 버전 확인
npx team-conor --help
npx team-conor --version
```

## 생성되는 파일

```
CLAUDE.md / AGENTS.md            # 에이전트 진입점 → .conor/CONOR.md 읽기 지시
.conor/
├── CONOR.md                     # 라우팅 테이블 (페르소나 목록 + 커맨드 매핑)
├── persona/                     # 팀원 페르소나
│   ├── user.md                  # 사용자 (프로젝트 오너)
│   ├── planner.md               # 스티브 (제품 전략)
│   ├── pm.md                    # 엘런 (실행 PM)
│   ├── designer.md              # 마르코 (UX)
│   ├── frontend.md              # 유나 (Frontend)
│   └── backend.md               # 빅토르 (Backend)
└── memory/                      # Zettelkasten 기반 메모리
    ├── summary.md               # 인덱스 (항상 AI 컨텍스트에 로드)
    ├── _schema/                 # chunk 형식 정의
    │   ├── learning.md
    │   ├── decision.md
    │   └── project.md
    └── chunks/                  # 원자적 메모 저장소

# Claude 선택 시
.claude/commands/
├── conor-work.md                # 작업 모드
├── conor-review.md              # 코드 리뷰
├── conor-meeting.md             # 팀 회의
├── conor-summary.md             # 메모리 요약
├── conor-deep-plan.md           # 딥 모드: 제품 전략 (스티브)
├── conor-deep-design.md         # 딥 모드: UX 설계 (마르코)
├── conor-deep-server.md         # 딥 모드: 백엔드 (빅토르)
└── conor-deep-client.md         # 딥 모드: 프론트엔드 (유나)

# Codex 선택 시
.agents/skills/
├── conor-work/SKILL.md
├── conor-review/SKILL.md
├── ...
```

## 팀 구성

| 이름 | 역할 | 배경 | 관점 |
|------|------|------|------|
| 스티브 | 제품 전략 | 잡스 밑에서 첫 아이폰을 만든 프로덕트 비저너리 | "왜 이게 필요해?" |
| 엘런 | 실행 PM | 스페이스X 초기 멤버 | "언제 끝나?" |
| 마르코 | UX | 도널드 노먼의 수제자, 애플 수석 디자이너 출신 | "사용자가 이해해?" |
| 유나 | Frontend | 크롬 브라우저 초기 개발팀 출신, TC39 참여자 | "리렌더링 몇 번?" |
| 빅토르 | Backend | 25년차 시스템 아키텍트, Rust 초기 기여자 | "100만 유저면?" |

## 사용법

### 팀원 호출

```
유나, 이 컴포넌트 리뷰해줘
빅토르, API 설계 검토 좀
마르코, 이 UI 접근성 괜찮아?
```

### 팀 토론

```
회의하자, 이 기능 어떻게 구현할지
```

### 코드 작업

```
이 버그 수정해줘  → 실제 작업 수행 후, 관련 페르소나 관점에서 자체 검증
```

### 커맨드 (v1.1.0+)

Claude Code에서는 슬래시 커맨드로, Codex에서는 스킬로 사용할 수 있습니다.

**기본 커맨드:**

| 커맨드 | 설명 |
|--------|------|
| `/conor-work` | 페르소나 기반 작업 수행 및 메모리 관리 |
| `/conor-review` | 팀 페르소나 기반 코드 리뷰 |
| `/conor-meeting` | 팀 회의 (다중 관점 토론) |
| `/conor-summary` | 메모리 chunks → summary.md 자동 생성 |

**딥 모드** — 특정 페르소나의 전문 영역을 깊이 있게 활용:

| 커맨드 | 페르소나 | 용도 |
|--------|----------|------|
| `/conor-deep-plan` | 스티브 | 제품 전략, 기능 기획 |
| `/conor-deep-design` | 마르코 | UX 설계, 사용자 경험 |
| `/conor-deep-server` | 빅토르 | 백엔드 아키텍처, 시스템 설계 |
| `/conor-deep-client` | 유나 | 프론트엔드 아키텍처, UI 구현 |

## 설계 철학

### 라우팅 아키텍처

에이전트 진입점(`CLAUDE.md` 등)은 `.conor/CONOR.md`를 읽도록 지시하는 역할만 합니다. `CONOR.md`는 페르소나 목록과 커맨드 라우팅 테이블을 담고 있어, 상황에 따라 적절한 커맨드 파일로 분기합니다.

```
CLAUDE.md / AGENTS.md
  → .conor/CONOR.md (페르소나 목록 + 커맨드 라우팅 테이블)
    → .claude/commands/conor-*.md 또는 .agents/skills/conor-*/SKILL.md
```

### 캐릭터 + 활성화 트리거

각 페르소나는 **캐릭터 성격**과 **반드시 잡아야 할 것**(활성화 트리거) 으로 구성됩니다. Claude가 이미 아는 교과서적 지식은 빼고, Claude가 **알면서도 안 하는 것**을 잡아주는 데 집중합니다.

```
유나: 이 컴포넌트 봤는데...
- `any` 타입 3군데 있어요. 타입 좁혀주세요.
- addEventListener 후 cleanup이 없어요. 메모리 누수 가능성.
→ [구체적 수정 코드 제시]
```

### 서브에이전트 워크플로우

리뷰 요청 시 각 페르소나를 **Task 서브에이전트로 병렬 실행**합니다:
- 각 페르소나가 격리된 컨텍스트에서 독립적으로 리뷰
- 메인 컨텍스트에는 요약된 결과만 수집
- 컨텍스트 오염 없이 여러 관점의 피드백을 동시에 확보

### Cross-domain 협업

관련 영역 발견 시 다른 페르소나를 자동으로 호출합니다:

```
스티브: 이 기능 범위가 커지고 있는데...
→ 엘런, 스코프 관리 좀 봐줄래?

엘런: MVP로 뭘 빼면 절반 시간에 되는지 볼게요.
```

### Memory 시스템

Zettelkasten 기반으로 프로젝트 컨텍스트를 `.conor/memory/`에 기록합니다:

- **summary.md**: 인덱스 (항상 AI 컨텍스트에 로드, 최대 30항목)
- **chunks/**: 원자적 메모 (필요할 때만 참조)
  - `L-*`: 학습 (버그 해결, 패턴 발견)
  - `D-*`: 결정 (기술 선택, 아키텍처)
  - `P-*`: 프로젝트 (구조, 빌드, 배포)

### 멀티 에이전트 지원

`--agent` 옵션으로 여러 AI 도구를 동시에 지원할 수 있습니다:
- **Claude Code**: `CLAUDE.md` + `.claude/commands/` 에 커맨드 파일 생성
- **Codex**: `AGENTS.md` + `.agents/skills/` 에 스킬 파일 생성
- 동일한 페르소나와 커맨드를 각 에이전트 형식에 맞게 자동 변환

### 업데이트 지원

이미 설정된 프로젝트에서 `npx team-conor`를 다시 실행하면:
- 기존 파일과 비교하여 diff 표시
- 덮어쓰기 / 건너뛰기 / 백업 선택 가능
- **memory 파일은 자동으로 보존** (사용자 데이터 보호)
- 이전 버전(루트 `CONOR.md`, `CLAUDE.md` 내 템플릿)에서 자동 마이그레이션

## 커스터마이징

각 페르소나 파일(`.conor/persona/*.md`)을 수정하여:
- "반드시 잡아야 할 것" 항목 추가/수정
- 프로젝트에 맞는 기술 스택 반영
- 팀 컨벤션 추가

## 라이선스

MIT
