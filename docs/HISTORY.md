# HISTORY.md — 완료된 작업 이력

---

## Day 1 — 2026-05-26

### 🏗️ 프로젝트 생성 및 초기 설정
- Next.js 16.2.6 (App Router) + React 19 프로젝트 생성
- 초기 문서 파일 작성 (`docs/PRD.md`, `docs/ARCHECTURE.md` 등)

### 📦 라이브러리 설치 및 환경 구성
- TailwindCSS v4, Shadcn UI 컴포넌트 초기화 (`components.json`)
- Shadcn UI 컴포넌트 추가: `badge`, `button`, `card`, `input`, `skeleton`
- Prisma 7.8.0 설치 및 `prisma.config.ts` 설정
- NextAuth.js, bcryptjs, Zod, React Hook Form, TanStack Query, Zustand 설치
- `src/lib/utils.ts` (cn 유틸 함수)

### 🗄️ DB 스키마 설계 및 Prisma 연동
- `prisma/schema.prisma`에 7개 모델 정의
  - `User`, `Product`, `SystemCode`, `Order`, `OrderItem`, `Cart`, `CartItem`
- `docs/erd.png` ERD 이미지, `docs/ddl.sql` DDL 문서 작성
- 마이그레이션 생성 및 적용 (`20260526053525_init`)
- `prisma/seed.ts` 초기 시드 데이터 작성 (관리자 계정, 상품 샘플 등)
- `.env.example` 환경변수 예시 파일 추가

### 🔐 인증 구현 (NextAuth.js)
- `src/lib/auth.ts` — NextAuth 메인 설정 (Credentials Provider, bcrypt 검증)
- `src/lib/auth.config.ts` — 미들웨어와 공유하는 인가 설정 (protectedRoutes, adminRoutes)
- `src/lib/db.ts` — Prisma 클라이언트 싱글톤
- `src/middleware.ts` — 라우트별 접근 권한 제어 (Edge Runtime)
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth 핸들러
- `src/actions/auth.actions.ts` — 회원가입 Server Action
- `src/schemas/auth.schema.ts` — 로그인/회원가입 Zod 스키마
- `src/types/next-auth.d.ts` — NextAuth 세션 타입 확장 (id, role 필드)
- `src/app/(auth)/login/page.tsx` — 로그인 페이지
- `src/app/(auth)/register/page.tsx` — 회원가입 페이지

---

## Day 2 — 2026-05-27

### 🔐 인증 개선
- `src/lib/auth.config.ts` — JWT/Session 콜백 추가, role 기반 접근 제어 강화
- `src/lib/auth.ts` — TypeScript 타입 캐스팅 수정, 콜백 정리
- `src/middleware.ts` — 주석 보강, 매처 패턴 명세 추가

### 🗄️ DB 스키마 변경
- `Product` 모델에 `isActive Boolean @default(true)` 필드 추가
  - 상품 삭제 대신 비활성화 처리로 기존 주문 이력 보호
- 마이그레이션 추가 (`20260527083323_add_product_is_active`)

### 🧩 공통 레이아웃 컴포넌트
- `src/components/Header.tsx` — 네비게이션 바 (로그인 상태, 장바구니 뱃지)
- `src/components/Footer.tsx` — 푸터
- `src/components/CartBadge.tsx` — 장바구니 아이템 수 표시 뱃지
- `src/components/SignOutButton.tsx` — 로그아웃 버튼
- `src/app/layout.tsx` — Provider, Header, Footer 적용
- `src/providers/` — TanStack Query Provider 등 앱 전역 Provider 설정

### 🛍️ 상품 기능
- `src/app/products/page.tsx` — 상품 목록 페이지 (`/products`)
- `src/app/products/[id]/page.tsx` — 상품 상세 페이지 (`/products/[id]`)
- `src/app/products/loading.tsx` — 상품 목록 Skeleton 로딩 UI
- `src/components/products/ProductGrid.tsx` — 상품 그리드 레이아웃
- `src/components/products/ProductCard.tsx` — 개별 상품 카드
- `src/components/products/AddToCartButton.tsx` — 장바구니 담기 버튼
- `src/schemas/product.schema.ts` — 상품 등록 Zod 스키마

### 🛒 장바구니
- `src/app/cart/page.tsx` — 장바구니 페이지 (`/cart`)
- `src/components/cart/CartItem.tsx` — 장바구니 개별 아이템 (수량 변경, 삭제)
- `src/components/cart/CartSummary.tsx` — 주문 금액 요약
- `src/store/cartStore.ts` — Zustand 장바구니 전역 상태 (`persist`로 localStorage 유지)
- `src/actions/cart.actions.ts` — 장바구니 Server Action

### 📦 주문 / 결제
- `src/app/checkout/page.tsx` — 주문/결제 페이지 (`/checkout`)
- `src/app/order-complete/page.tsx` — 주문 완료 페이지 (`/order-complete`)
- `src/schemas/order.schema.ts` — 배송지 정보 Zod 스키마
- `src/app/api/orders/route.ts` — 주문 생성 API (`POST /api/orders`)

### 👤 마이페이지
- `src/app/mypage/page.tsx` — 마이페이지 (`/mypage`, 로그인 필요)
- `src/components/mypage/OrderCard.tsx` — 주문 내역 카드 컴포넌트

### 🔧 관리자 백오피스
- `src/app/admin/page.tsx` — 관리자 대시보드 (`/admin`)
- `src/app/admin/layout.tsx` — 관리자 레이아웃 (권한 체크)
- `src/app/admin/products/page.tsx` — 상품 관리 페이지 (`/admin/products`)
- `src/components/admin/ProductForm.tsx` — 상품 등록/수정 폼
- `src/app/api/admin/products/route.ts` — 관리자 상품 등록 API (`POST`)
- `src/app/api/admin/orders/[id]/route.ts` — 관리자 주문 상태 변경 API (`PATCH`)
