import type { NextAuthConfig } from "next-auth";

/**
 * [auth.config.ts] Edge Runtime(미들웨어)과 Node.js 서버 양쪽에서 공유하는 "가벼운" 인증 공통 설정.
 * DB 접근이 없어 어디서든 실행 가능 → middleware.ts가 이 파일만 import해서 라우트를 보호한다.
 */
const protectedRoutes = ["/mypage"];
const adminRoutes = ["/admin"];

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    // ── JWT: 로그인 시 role을 토큰에 저장 ─────────────────────────────
    // 미들웨어는 authConfig만 사용하기 때문에, 이 콜백이 없으면
    // 미들웨어 컨텍스트에서 token.role이 undefined가 되어 role 체크 불가
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },

    // ── Session: JWT 토큰의 role을 세션 user에 주입 ───────────────────
    // 이 콜백이 없으면 authorized 콜백에서 auth.user.role이 undefined
    session({ session, token }) {
      if (session.user && token.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },

    // ── Authorized: 라우트 접근 권한 체크 ────────────────────────────
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const pathname = nextUrl.pathname;

      // 1. 관리자 경로 접근 시도
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "admin")
          return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      // 2. 일반 보호 경로 접근 시도
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );
      if (isProtectedRoute && !isLoggedIn) return false;

      // 3. 그 외 경로는 통과
      return true;
    },
  },
  providers: [],
};
