import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const discountRate = (product.name.length % 30) + 10;
  const originalPrice = Math.floor(product.price / (1 - discountRate / 100));
  const isSoldOut = product.stock === 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">

      {/* ── 이미지 영역 ─────────────────────────────── */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            className={`object-cover transition-transform duration-500 ${
              isSoldOut ? 'opacity-60' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-xs">
            이미지 없음
          </div>
        )}

        {/* 품절 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs font-semibold tracking-widest uppercase bg-black/60 px-3 py-1">
              Sold Out
            </span>
          </div>
        )}

        {/* 할인율 배지 — 이미지 위 좌상단 */}
        {!isSoldOut && (
          <div className="absolute top-2 left-2 bg-gray-900 text-white text-[11px] font-bold px-1.5 py-0.5 leading-none">
            {discountRate}%
          </div>
        )}
      </div>

      {/* ── 텍스트 영역 ─────────────────────────────── */}
      <div className="space-y-1">
        {/* 카테고리 (브랜드 역할) */}
        {product.category && (
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
            {product.category}
          </p>
        )}

        {/* 상품명 */}
        <h3 className="text-sm text-gray-900 font-medium leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* 가격 */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-sm font-bold text-gray-900">
            {product.price.toLocaleString('ko-KR')}원
          </span>
          <span className="text-xs text-gray-400 line-through">
            {originalPrice.toLocaleString('ko-KR')}원
          </span>
          <span className="text-xs font-bold text-red-500">
            {discountRate}%
          </span>
        </div>

        {/* 무료배송 */}
        {product.price >= 50000 && !isSoldOut && (
          <p className="text-[11px] text-blue-500 font-medium">무료배송</p>
        )}
      </div>
    </Link>
  );
}
