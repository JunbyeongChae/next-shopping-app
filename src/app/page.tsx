import { prisma } from '@/lib/db';
import { ProductGrid } from '@/components/products/ProductGrid';
import Link from 'next/link';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    where: { category: { not: null }, isActive: true },
  });

  const categoryList = categories
    .map((p) => p.category)
    .filter(Boolean) as string[];

  return (
    <div>
      {/* ── Hero Banner ─────────────────────────────────────── */}
      {/* -mx-4 -mt-8: layout의 px-4, py-8 상쇄 → 컨테이너 끝까지 채움 */}
      <div className="relative -mx-4 -mt-8 mb-12 bg-gray-950 overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />

        {/* 장식용 대형 텍스트 */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none">
          <span className="text-[110px] md:text-[160px] font-black text-white/[0.04] leading-none tracking-tighter">
            STYLE
          </span>
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 px-8 md:px-16 py-16 md:py-20">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-4">
            2026 S/S Collection
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
            지금 가장<br />필요한 스타일링
          </h2>
          <Link
            href="#products"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            쇼핑 시작하기
            <span className="text-base">→</span>
          </Link>
        </div>
      </div>

      {/* ── 상품 목록 섹션 ──────────────────────────────────── */}
      <div id="products">

        {/* 섹션 헤더 — 4XR 스타일 */}
        <div className="flex items-center gap-4 mb-7">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight">전체 상품</h2>
            <p className="text-xs text-gray-400 mt-0.5">{products.length}개의 상품</p>
          </div>
          {/* 구분선 */}
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Link
            href="/"
            className={`px-4 py-1.5 text-xs font-medium border transition-colors ${
              !category
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            전체
          </Link>
          {categoryList.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-1.5 text-xs font-medium border transition-colors ${
                category === cat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* 상품 그리드 */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
