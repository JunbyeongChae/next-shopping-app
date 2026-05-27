import { prisma } from '@/lib/db';
import { ProductGrid } from '@/components/products/ProductGrid';
import HeroBanner from '@/components/HeroBanner';
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
      <HeroBanner />

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
