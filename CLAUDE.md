# CLAUDE.md — 쇼핑몰 앱 (Shopping Mall)

이 파일은 이 프로젝트에 특화된 내용만 기술한다.
범용 원칙(워크플로우, 네이밍 컨벤션, 브랜치 전략 등)은 `~/.claude/CLAUDE.md`(전역)에 있으며
이 파일에 중복 기술하지 않는다.

---

## CLAUDE.md 계층 구조 원칙

```text
~/.claude/CLAUDE.md               ← 전역: 워크플로우, 코드 스타일, 브랜치 전략 등 모든 프로젝트 공통
└── next-shopping-app/CLAUDE.md   ← 프로젝트 특화: 기술 스택, 폴더 구조, 명령어, 개발 범위
```

---

# 쇼핑몰 앱 (Shopping Mall)

Next.js(App Router) 기반 풀스택 쇼핑몰 — NextAuth·Prisma·Zustand·TanStack Query 학습 프로젝트

## Project Overview

기존 영화 앱 구조를 탈피하여, Next.js와 Prisma 기반의 본격적인 커머스 플랫폼을 구축합니다. **서버 상태와 클라이언트 UI 상태를 명확히 분리**하고, 상품 탐색, 장바구니, 주문 결제, 백오피스까지 풀스택 쇼핑몰 사이클을 구현하는 것이 핵심 목표입니다.

| 기술 | 역할 |
| --- | --- |
| Next.js (App Router) | 풀스택 프레임워크 (서버 컴포넌트, API Route, Server Actions) |
| Prisma + PostgreSQL | DB 테이블 모델링 및 ORM 쿼리, 트랜잭션 처리 |
| NextAuth.js + bcryptjs | 이메일/비밀번호 기반 인증 및 보안 세션 관리 |
| TanStack Query | 서버 데이터(주문 내역, 통계 등) fetch, 캐싱, 로딩/에러 상태 처리 |
| Zustand | 클라이언트 UI 상태(장바구니 등) 전역 관리 |
| Zod + React Hook Form | 배송지 입력·회원가입·로그인·상품 등록 폼 유효성 검증 |
| TypeScript | 전체 코드베이스 타입 안전성 확보 |
| Shadcn UI | 컴포넌트 기반 UI 구성 (Button, Card, Skeleton 등) |

상세 요구사항은 `docs/PRD.md`를 참조하며, **프로젝트 폴더 구조, 새 파일 생성 위치, 상태 관리(서버/클라이언트) 원칙 등 아키텍처에 관한 결정은 반드시 `docs/ARCHITECTURE.md`를 우선적으로 참조하여 코드를 작성**해야 합니다.

---

## Tech Stack & Version Control (AI Strict Policy)

**🚨 [치명적 주의사항 - AI 버전 통제 정책]**
AI는 아래 명시된 기술 스택의 **정확한 버전**만을 사용하여 코드를 작성하고 패키지를 설치해야 합니다. 교육용 프로젝트의 안정성을 위해, 임의로 `latest` 태그를 사용하거나 상위 버전으로 업데이트하여 강의 환경의 일관성을 훼손하는 행위를 엄격히 금지합니다. 버전 변경이 불가피한 경우 반드시 사용자(강사)에게 먼저 사유를 설명하고 명시적인 승인을 받아야 합니다.

| 기술 | 고정 버전 (`package.json` 기준) | 역할 |
| --- | --- | --- |
| Next.js (App Router) | `16.2.6` | 풀스택 프레임워크 (서버 컴포넌트, API Route) |
| React | `19.2.4` | UI 라이브러리 |
| Prisma | `7.8.0` | 직관적인 ORM, SQL 스키마 자동 생성 및 타입 제공 |
| PostgreSQL (`pg`) | `^8.21.0` | 관계형 데이터베이스 드라이버 |
| NextAuth.js | `^5.0.0-beta.31` | 인증 및 보안 세션 관리 (Auth.js) |
| Zustand | `^5.0.13` | 장바구니 등 클라이언트 상태 전역 관리 |
| TailwindCSS | `^4.0.0` | 유틸리티 클래스 기반 스타일링 |
| Shadcn UI | `^4.7.0` | Tailwind 기반 컴포넌트 라이브러리 |
| React Hook Form | `^7.76.0` | 폼 상태 관리 및 유효성 검사 |
| Zod | `^4.4.3` | 스키마 검증 |
| TanStack Query | `^5.100.11` | 비동기 데이터 패칭 및 서버 상태 관리 |
| bcryptjs | `^3.0.3` | 비밀번호 단방향 암호화 (보안) |
| lucide-react | `^1.16.0` | UI 아이콘 라이브러리 |
| @hookform/resolvers | `^5.2.2` | React Hook Form과 Zod 스키마 연결 |

---

## Commands

```bash
# 개발 서버 실행
npm run dev

# Prisma 마이그레이션 적용 및 클라이언트 생성 (DB 스키마 동기화)
npx prisma migrate dev --name init

# 초기 데이터 삽입 (Seed)
npx prisma db seed

# Prisma GUI 스튜디오 열기 (DB 데이터 웹으로 관리)
npx prisma studio
```

---

## ERD 툴

| 환경 | 툴 | 용도 |
| --- | --- | --- |
| 온라인 | [DrawDB](https://www.drawdb.app/) | 브라우저에서 ERD 작성 & 시각화. 가입 불필요, 완전 무료 |
| 오프라인 | [DBeaver](https://dbeaver.io/) | 로컬 DB 연결 및 ERD 확인. Community Edition 무료 |

---

## Development Notes

프로젝트 작업 내역의 진척도는 `docs/work.md`에서 10일 커리큘럼 마일스톤에 맞추어 트래킹한다. 완료된 작업은 `docs/history.md`로 이동한다.


## WORK.md 관리 규칙

`docs/WORK.md`는 **현재 진행 중이거나 앞으로 할 작업만** 관리한다.

### Claude가 반드시 해야 하는 행동

1. **작업 시작 전**: `docs/WORK.md`의 `## 진행 예정`에 작업 항목을 추가한다.
2. **작업 완료 후**:
   - 완료 항목을 `docs/WORK.md`에서 **제거**한다.
   - 해당 항목을 `docs/HISTORY.md`로 **이동**한다 (날짜 포함).
3. **기술적 결정이 생겼을 때**: `docs/WORK.md`의 `## 결정 사항`에 항목과 이유를 기록한다.

### WORK.md에 두지 않는 것

- 완료된 작업 내역 → `docs/HISTORY.md`로 이동
- 기능 요구사항 → `docs/PRD.md` 참조

---

## HISTORY.md 관리 규칙

`docs/HISTORY.md`는 **완료된 작업의 전체 이력**을 담는다.

### Claude가 반드시 해야 하는 행동

- 작업 완료 시 즉시 `docs/HISTORY.md`에 기록한다.
- 기록 형식: **날짜 / 작업 제목 / 주요 변경 파일 및 내용**

---

## 작업 조회 규칙

- **"다음 작업은?"** → `docs/WORK.md`를 먼저 읽고 답한다.
- **"이전에 한 작업은?"** → `docs/HISTORY.md`를 참고하라고 안내한다.

---

## 문서 파일 역할

| 파일 | 역할 |
| --- | --- |
| `docs/PRD.md` | 제품 요구사항 정의서 — 목표, 유저 스토리, 기능 명세, Out of Scope |
| `docs/ARCHITECTURE.md` | **프로젝트 아키텍처 가이드** — 전체 폴더 구조, 상태 관리 원칙, 라우트 보호 규칙 (파일/폴더 생성 전 반드시 참조) |
| `docs/SHOPPING_PLAN.md` | 10일 전체 커리큘럼 목차 및 핵심 학습 포인트 요약 |
| `docs/WORK.md` | 현재 작업 현황 및 앞으로 할 일 |
| `docs/HISTORY.md` | 완료된 작업 기록 |

---

## 문서 작성 원칙

- 학습 문서(`docs/lectures/`, `docs/next_lectures/`)와 실습 문서(`docs/steps/`, `docs/new_steps/`)는 **한 번에 한 개씩** 작성한다.
- 여러 문서를 한 번에 생성하지 않는다.
- 실습 문서에서 코드 수정을 안내할 때는 반드시 **파일 경로와 위치(줄 번호 또는 주변 맥락)**를 명시한다. "수정 전/후"만 표기하고 어느 파일인지 빠뜨리지 않는다.

---
