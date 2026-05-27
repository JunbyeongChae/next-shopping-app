import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { ChevronRight, Package, RotateCcw, Shield } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
  });

  if (!product) notFound();

  const originalPrice = Math.round(product.price * 1.2); // 원가 (20% 할인 가정)
  const discountRate = Math.round((1 - product.price / originalPrice) * 100);

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── 브레드크럼 ──────────────────────────────── */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-700 transition-colors">홈</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-gray-700 transition-colors">상품 목록</Link>
        <ChevronRight size={12} />
        {product.category && (
          <>
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="hover:text-gray-700 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* ── 메인 섹션: 이미지 + 정보 ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 mb-12">

        {/* ── 왼쪽: 썸네일 스트립 + 메인 이미지 ────── */}
        <div className="flex gap-3">
          {/* 썸네일 스트립 */}
          <div className="flex flex-col gap-2 w-[68px] shrink-0">
            {[product.imageUrl].map((src, i) => (
              <div
                key={i}
                className="relative w-[68px] h-[68px] border-2 border-gray-900 overflow-hidden bg-gray-100 cursor-pointer shrink-0"
              >
                {src ? (
                  <Image
                    src={src}
                    alt={`${product.name} 썸네일 ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="68px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* 메인 이미지 */}
          <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-gray-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                이미지 없음
              </div>
            )}
            {/* 할인율 뱃지 */}
            {discountRate > 0 && (
              <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2 py-1">
                {discountRate}%
              </div>
            )}
          </div>
        </div>

        {/* ── 오른쪽: 상품 정보 ─────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* 카테고리 + 상품명 */}
          <div>
            {product.category && (
              <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">
                {product.category}
              </p>
            )}
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* 가격 */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {product.price.toLocaleString("ko-KR")}원
            </span>
            <span className="text-base text-gray-400 line-through mb-0.5">
              {originalPrice.toLocaleString("ko-KR")}원
            </span>
            <span className="text-base font-bold text-red-500 mb-0.5">
              {discountRate}%
            </span>
          </div>

          {/* 상품 설명 */}
          {product.description && (
            <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
              {product.description}
            </p>
          )}

          {/* 클라이언트 컴포넌트: 혜택박스 + 수량 + 버튼 */}
          <ProductDetailClient product={product} />

          {/* 서비스 안내 */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Package size={18} className="text-gray-400" />
              <span className="text-[11px] text-gray-500">무료 반품</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Shield size={18} className="text-gray-400" />
              <span className="text-[11px] text-gray-500">정품 보증</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RotateCcw size={18} className="text-gray-400" />
              <span className="text-[11px] text-gray-500">30일 교환</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 상품 상세 정보 테이블 ────────────────────── */}
      <div className="border-t border-gray-200 pt-10">
        <h2 className="text-sm font-bold text-gray-900 mb-4 tracking-wide uppercase">
          상품 정보
        </h2>
        <table className="w-full text-sm border-t border-gray-200">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 w-32 text-gray-400 font-medium">배송정보</td>
              <td className="py-3 text-gray-700">국내배송 · CJ대한통운 · 3일 이내 출고</td>
            </tr>
            <tr>
              <td className="py-3 text-gray-400 font-medium">배송비</td>
              <td className="py-3 text-gray-700">
                {product.price >= 50000
                  ? "무료배송 (50,000원 이상)"
                  : "3,000원 (50,000원 이상 무료)"}
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-400 font-medium">교환/반품</td>
              <td className="py-3 text-gray-700">수령 후 30일 이내 교환/반품 가능</td>
            </tr>
            {product.category && (
              <tr>
                <td className="py-3 text-gray-400 font-medium">카테고리</td>
                <td className="py-3 text-gray-700">{product.category}</td>
              </tr>
            )}
            <tr>
              <td className="py-3 text-gray-400 font-medium">재고</td>
              <td className="py-3 text-gray-700">
                {product.stock > 0 ? `${product.stock}개` : "품절"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
