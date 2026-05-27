import Link from 'next/link';
import { auth } from '@/lib/auth';
import { SignOutButton } from './SignOutButton';
import { CartBadge } from './CartBadge';

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* 왼쪽: 로고 + 상품 목록 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-gray-900">
            🛍️ ShopApp
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              상품 목록
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                관리자
              </Link>
            )}
          </nav>
        </div>

        {/* 오른쪽: 장바구니 아이콘 + 인증 영역 */}
        <div className="flex items-center gap-4">
          <CartBadge userId={session?.user?.id} />

          {session ? (
            <>
              <span className="text-sm text-gray-600">{session.user?.name} 님</span>
              <Link href="/mypage" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                마이페이지
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                로그인
              </Link>
              <Link href="/register" className="text-sm bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 transition-colors">
                회원가입
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
