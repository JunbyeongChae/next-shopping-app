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

---

## Day 2 — 2026-05-27 (2)

### 🖼️ 홈 Hero 배너 캐러셀
- `src/components/HeroBanner.tsx` — 신규 클라이언트 컴포넌트
  - `public/images/banner/` 이미지 3장 슬라이드
  - 5초 자동 재생 / 호버 시 일시정지
  - 이전·다음 화살표 버튼, 네비게이션 도트
  - 슬라이드별 개별 텍스트(라벨·제목) 설정
- `src/app/page.tsx` — 기존 정적 배너 제거 후 `<HeroBanner />` 교체

### 🛍️ 상품 상세 페이지 리디자인 (4XR 스타일)
- `src/app/products/[id]/page.tsx` — 전면 재작성
  - 브레드크럼 네비게이션 추가
  - 썸네일 스트립 + 대형 메인 이미지 레이아웃
  - 원가/할인율 표시, 서비스 안내 아이콘(무료반품·정품보증·30일교환)
  - 상품 정보 테이블 (배송·교환반품·카테고리·재고)
- `src/components/products/ProductDetailClient.tsx` — 신규 클라이언트 컴포넌트
  - 혜택 정보 박스 (배송비·적립포인트·재고 상태)
  - 수량 선택 (−/+), 총 상품금액 실시간 계산
  - 위시리스트(♡) + 장바구니 + 바로구매 버튼 분리

### 🧩 공통 레이아웃 수정
- `src/app/layout.tsx` — `<Footer />` 적용 (누락 수정)
- `src/components/Header.tsx` — 레이아웃 재배치
  - 상품 목록 링크 → 로고 오른쪽(왼쪽 영역)으로 이동
  - 장바구니 텍스트 → `ShoppingCart` 아이콘으로 교체, 오른쪽 인증 영역 왼쪽으로 이동
- `src/components/CartBadge.tsx` — 텍스트 제거, lucide `ShoppingCart` 아이콘 적용

### 🔧 관리자 상품 관리 개선
- `src/app/api/admin/products/route.ts` — GET 응답에 `_count.orderItems` 포함
- `src/app/admin/products/page.tsx`
  - 주문 이력 없음 → 🔴 **삭제** 버튼 (실제 DELETE)
  - 주문 이력 있음 → 🟠 **비활성화** 버튼 (isActive=false, 주문 건수 툴팁)
  - `confirm()` 제거 → Shadcn **AlertDialog** 로 교체 (삭제/비활성화 각각 별도 다이얼로그)
- `src/components/ui/alert-dialog.tsx` — Shadcn AlertDialog 컴포넌트 추가

### 📦 주문/결제 UX 개선
- `src/app/checkout/page.tsx` — 서버 컴포넌트로 전환, `auth()`로 세션 읽어 이름 전달
- `src/components/CheckoutForm.tsx` — 신규 클라이언트 컴포넌트로 분리
  - 받는 분 이름: 로그인 유저 이름 기본값 자동 입력 (수정 가능)
  - 전화번호: 숫자만 입력해도 자동 포맷 (`010-1234-5678` / `010-123-4567` 10·11자리 모두 지원)
  - 주문 완료 후 리다이렉트: `/order-complete` → `/mypage` 로 변경
