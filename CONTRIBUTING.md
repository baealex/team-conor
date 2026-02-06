# Contributing

## 개발 환경

```bash
# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# 개발 모드 (watch)
npm run dev

# 빌드 산출물 삭제
npm run clean
```

## 배포

```bash
# npm 로그인
npm login

# 배포 전 확인
npm pack --dry-run

# 배포 (prepublishOnly에서 자동 빌드)
npm publish

# 버전 올리기 (patch/minor/major)
npm version patch
npm publish
```

## 프로젝트 구조

```
src/
├── index.ts              # CLI 진입점 (commander 기반)
├── commands/
│   └── init.ts           # init 커맨드
└── utils/
    ├── logger.ts         # 컬러 로깅
    ├── diff.ts           # 파일 diff 표시
    └── file.ts           # 파일 쓰기 + 충돌 처리
templates/                # 생성되는 템플릿 파일
```
