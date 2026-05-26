import type { NextAuthConfig } from 'next-auth';

const protectedRoutes = ['/mypage'];
const adminRoutes = ['/admin'];

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const pathname = nextUrl.pathname;

      // 1. 관리자 경로 접근 시도
      const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== 'admin') return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      // 2. 일반 보호 경로 접근 시도
      const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
      if (isProtectedRoute && !isLoggedIn) return false;

      // 3. 그 외 경로는 통과
      return true;
    }
  },
  providers: []
};
