# Team Conor

AI 코딩 어시스턴트를 위한 팀 페르소나 시스템입니다.

혼자 개발할 때도 다양한 관점의 피드백을 받을 수 있도록, 5명의 가상 팀원이 각자의 전문 영역에서 구체적인 체크리스트 기반 리뷰를 제공합니다.

## 설치

```bash
npx team-conor
```

### CLI 옵션

```bash
# 대화형 설정 (기본)
npx team-conor init

# 비대화형 모드 (CI/CD 등 인터렉션 불가 환경)
npx team-conor init --name "홍길동" --no-interaction

# 기존 파일 강제 덮어쓰기
npx team-conor init --name "홍길동" -y

# 도움말
npx team-conor --help
npx team-conor init --help

# 버전 확인
npx team-conor --version
```

## 생성되는 파일

```
CLAUDE.md                    # AI 설정 파일
.conor/
├── persona/                 # 팀원 페르소나
│   ├── user.md              # 사용자 (프로젝트 오너)
│   ├── planner.md           # 스티브 (제품 전략)
│   ├── pm.md                # 엘런 (실행 PM)
│   ├── designer.md          # 마르코 (UX)
│   ├── frontend.md          # 유나 (Frontend)
│   └── backend.md           # 빅토르 (Backend)
└── memory/                  # 프로젝트 컨텍스트
    ├── summary.md           # 핵심 요약 (CLAUDE.md에서 참조)
    ├── project.md           # 기술 스택, 아키텍처
    ├── decisions.md         # 주요 결정 기록
    └── learnings.md         # 학습한 패턴, 버그 해결
```

## 팀 구성

| 이름 | 역할 | 관점 |
|------|------|------|
| 스티브 | 제품 전략 | "왜 이게 필요해?" - 5 Whys, 사용자 가치 검증 |
| 엘런 | 실행 PM | "언제 끝나?" - 스코프 조정, 블로커 제거, MVP 집중 |
| 마르코 | UX | "사용자가 이해해?" - 접근성, 피드백 상태, 일관성 |
| 유나 | Frontend | "리렌더링 몇 번?" - 성능, 타입 안전성, React 패턴 |
| 빅토르 | Backend | "100만 유저면?" - 확장성, 데이터 정합성, 장애 대응 |

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
이 버그 수정해줘  → 페르소나 모드 해제, 실제 작업 수행
```

## 핵심 기능

### 체크리스트 기반 리뷰

각 페르소나는 추상적인 조언 대신 구체적인 체크리스트로 피드백합니다:

```
유나: 이 컴포넌트 봤는데...
- [ ] useEffect 의존성 배열에 `user` 빠져있어요
- [ ] 이 상태는 서버 컴포넌트로 올릴 수 있어요
- [x] 타입은 잘 되어있네요
```

### Memory 시스템

프로젝트 컨텍스트를 `.conor/memory/`에 기록하여 세션 간 연속성을 유지합니다:

- **summary.md**: 핵심 컨텍스트 요약 (항상 참조됨)
- **project.md**: 기술 스택, 아키텍처, 컨벤션
- **decisions.md**: 주요 기술 결정과 근거
- **learnings.md**: 발견한 패턴, 버그 해결책

### 업데이트 지원

이미 설정된 프로젝트에서 `npx team-conor`를 다시 실행하면:
- 기존 파일과 비교하여 diff 표시
- 덮어쓰기 / 건너뛰기 / 백업 선택 가능
- **memory 파일은 자동으로 보존** (사용자 데이터 보호)

## 커스터마이징

각 페르소나 파일(`.conor/persona/*.md`)을 수정하여:
- 체크리스트 항목 추가/수정
- 프로젝트에 맞는 기술 스택 반영
- 팀 컨벤션 추가

## 라이선스

MIT
