import { redirect } from 'next/navigation';

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

// /products 로 접근하면 메인 페이지(/)로 리다이렉트
// 카테고리 필터가 붙어있으면 그대로 유지
// 예: /products?category=전자기기 → /?category=전자기기
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  redirect(category ? `/?category=${encodeURIComponent(category)}` : '/');
}
