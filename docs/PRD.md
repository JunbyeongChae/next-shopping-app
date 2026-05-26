# PRD — 쇼핑몰 앱 (Shopping Mall)

**문서 버전**: v2.0
**작성일**: 2026-05-24
**상태**: 초안

---

## 1. Overview

### 배경
대학생 실무 프로젝트로 10일간 진행되는 풀스택 쇼핑몰 서비스 구축 과정입니다. 기존 영화 앱 구조를 탈피하여, Next.js와 Prisma 기반의 본격적인 커머스 플랫폼을 구축합니다.

### 목표
Next.js(App Router), NextAuth, Prisma, PostgreSQL을 활용하여 상품 탐색, 장바구니, 주문 결제, 관리자 백오피스까지 풀스택 쇼핑몰 사이클을 10일 안에 완성한다.

---

### 페이지 라우트 맵 (Sitemap)

```text
/                        → 홈 (환영 메시지 및 진입점)
/products                → 상품 목록 (카테고리 필터링)
/products/[id]           → 상품 상세
/cart                    → 장바구니
/checkout                → 주문 / 모의 결제
/order-complete          → 주문 완료 안내
/mypage                  → 마이페이지 (로그인 필요)
/admin                   → 관리자 대시보드 (통계 조회, 관리자만)
/admin/products          → 상품 관리
/admin/orders            → 주문 관리
/login                   → 로그인
/register                → 회원가입
```

---

## 2. User Stories

| # | 스토리 | 우선순위 |
| --- | --- | --- |
| US-01 | 사용자로서 상품 목록을 카테고리별로 조회할 수 있다 | 높음 |
| US-02 | 사용자로서 상품의 상세 정보와 가격, 재고를 확인할 수 있다 | 높음 |
| US-03 | 사용자로서 원하는 상품을 장바구니에 담고 수량을 조절할 수 있다 | 높음 |
| US-04 | 사용자로서 장바구니의 상품들을 주문하고 (모의)결제할 수 있다 | 높음 |
| US-05 | 사용자로서 마이페이지에서 내 주문 내역과 배송 상태를 확인할 수 있다 | 중간 |
| US-06 | 관리자로서 백오피스에서 전체 주문 내역을 조회하고 배송 상태를 변경할 수 있다 | 높음 |
| US-07 | 공통 사용자로서 회원가입 및 로그인을 할 수 있다 | 높음 |

---

## 3. Functional Requirements

### 3-1. 공통 — Header & 레이아웃
| 기능 | 세부 요구사항 |
| --- | --- |
| 글로벌 네비게이션 | 로고(홈), 상품 목록, 장바구니, 관리자 메뉴(role이 admin일 때만 노출) |
| 장바구니 배지 | Zustand 상태를 읽어 담긴 상품 수량 표시, 로그인 시 백그라운드 DB 동기화(Sync) 연동 |
| 인증 UI | 비로그인 시 로그인/회원가입 버튼, 로그인 시 사용자 이름 및 로그아웃 버튼 노출 |
| 로딩/에러 처리 | 페이지 전환 시 `loading.tsx`(Skeleton), 에러 발생 시 `error.tsx`, `not-found.tsx` 표시 |

### 3-2. 인증 및 권한 (`/login`, `/register`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 회원가입 | Zod 검증, bcryptjs 비밀번호 단방향 암호화, Server Action으로 Prisma DB(`User`) 저장 |
| 로그인 | NextAuth.js (Credentials Provider) 적용, 이메일/비밀번호 매칭, JWT 세션 유지 |
| 라우트 보호 | Middleware(Edge) 기반 검증: `/mypage`, `/checkout`은 로그인 필요, `/admin`은 admin 권한 필요 |

### 3-3. 홈 & 상품 목록 페이지 (`/`, `/products`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 홈 화면 | 간단한 환영 메시지 및 '쇼핑 시작하기' 버튼 제공 |
| 상품 목록 | Server Component에서 Prisma로 DB 직접 조회, 그리드 레이아웃 (모바일 2열 → 데스크탑 4열) |
| 카테고리 필터 | URL `searchParams`를 활용한 카테고리(상의, 하의 등) 필터링, 선택 시 목록 즉시 갱신 |
| 상품 카드 | 썸네일 이미지(`next/image` 최적화), 상품명, 할인가, 배송비 무료 여부, 품절 표시 |

### 3-4. 상품 상세 페이지 (`/products/[id]`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 상세 정보 | 동적 라우트(`[id]`), 상품명, 설명, 가격, 재고 표시 |
| SSG 최적화 | `generateStaticParams`와 `revalidate`를 사용해 빌드 시 정적 페이지 생성 및 주기적 갱신 |
| 장바구니 담기 | 품절 시 버튼 비활성화, 클릭 시 Zustand `cartStore`에 상품 정보 및 수량 추가 |
| 없는 상품 처리 | 존재하지 않는 ID 접근 시 전용 `not-found.tsx` 표시 |

### 3-5. 장바구니 페이지 (`/cart`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 상태 관리 | Zustand `persist` 미들웨어로 로컬스토리지에 저장 (새로고침 유지) |
| 동기화 (Sync) | 로그인한 유저의 경우 로컬 상태와 DB(`Cart`, `CartItem`)를 백그라운드에서 실시간 트랜잭션 동기화 |
| 목록 및 제어 | 담긴 상품 목록 표시, 수량 증가/감소, 개별 삭제 기능 제공 |
| 결제 금액 계산 | 상품 총액 합산, 5만원 미만 시 배송비 3,000원 추가, '주문하기' 버튼 제공 |

### 3-6. 주문 및 모의 결제 (`/checkout`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 진입 방어 | 장바구니가 비어있으면 상품 목록으로 리다이렉트 |
| 배송지 폼 | React Hook Form + Zod 스키마로 받는 사람, 전화번호(정규식), 주소 유효성 검사 |
| 주문 트랜잭션 | POST `/api/orders` 호출, Prisma `$transaction`으로 `Order`와 `OrderItem` 동시 저장 |
| 주문 초기화 | 공통코드 테이블(`SystemCode`)을 참조해 초기 상태 '결제대기(PENDING)' 세팅 |
| 완료 처리 | 성공 시 장바구니 초기화(`clearCart`), `/order-complete` 페이지로 이동 |

### 3-7. 마이페이지 (`/mypage`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 주문 내역 패칭 | TanStack Query (`useQuery`)로 서버 데이터(`GET /api/orders`) 조회 및 캐싱 |
| 주문 카드 | 주문 일자, 주문 번호, 상품 썸네일, 수량, 결제 금액 표시 |
| 배송 상태 UI | PENDING(결제대기), PAID(결제완료) 등 상태값에 따라 색상이 다른 배지 UI 적용 |
| 로딩/에러 UI | TanStack Query 상태(`isLoading`, `isError`)에 따라 Skeleton 또는 에러 메시지 렌더링 |

### 3-8. 관리자 백오피스 (`/admin`)
| 기능 | 세부 요구사항 |
| --- | --- |
| 이중 권한 체크 | Middleware 통과 후 `admin/layout.tsx`에서 `role !== 'admin'` 시 추가 방어 |
| 대시보드 통계 | `Promise.all` 및 Prisma 집계(`aggregate`, `count`)로 총 주문, 총 매출, 상품/회원 수 표시 |
| 상품 등록 | React Hook Form + Zod 검증, `POST /api/admin/products` 호출하여 새 상품 저장 |
| 주문 관리 | 전체 주문 목록 테이블 조회, 상태 변경 Select 박스 제공 |
| 상태 변경 연동 | `PATCH /api/admin/orders/[id]` 호출, TanStack Query `useMutation` + `invalidateQueries`로 즉시 갱신 |

---

## 4. Non-Functional Requirements
- **성능**: DB 인덱싱을 활용한 조회 속도 최적화.
- **안정성**: Prisma 트랜잭션을 활용하여 주문-상세 간 데이터 정합성 보장.
- **타입 안전성**: Zod 및 Prisma 생성 타입을 활용한 100% Type-Safe 환경 구축.
