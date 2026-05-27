"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";

interface Product {
  id: string;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

async function fetchAdminProducts(): Promise<Product[]> {
  const res = await fetch("/api/admin/products");
  if (!res.ok) throw new Error("상품 목록을 불러오는 데 실패했습니다");
  return res.json();
}

async function deleteProduct(id: string) {
  const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "삭제에 실패했습니다");
  }
  return res.json();
}

async function toggleActive(id: string, isActive: boolean) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "상태 변경에 실패했습니다");
  }
  return res.json();
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchAdminProducts,
  });

  // 삭제 (주문 있으면 서버에서 자동으로 비활성화)
  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      if (data.deactivated) {
        alert("주문 내역이 있어 삭제 대신 비활성화 처리되었습니다.");
      }
    },
    onError: (error: Error) => alert(error.message),
  });

  // 활성화 / 비활성화 토글
  const { mutate: handleToggle } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (error: Error) => alert(error.message),
  });

  const confirmDelete = (product: Product) => {
    const message = `"${product.name}" 상품을 삭제하시겠습니까?\n\n주문 내역이 있으면 삭제 대신 비활성화됩니다.`;
    if (confirm(message)) handleDelete(product.id);
  };

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Button onClick={() => setIsCreateOpen(true)}>+ 상품 등록</Button>
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-1">상품 목록을 불러오지 못했습니다</p>
          <p className="text-sm text-gray-400">{(error as Error).message}</p>
        </div>
      )}

      {/* 빈 상태 */}
      {products && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">등록된 상품이 없습니다</p>
          <p className="text-sm mt-1">상품 등록 버튼을 눌러 첫 상품을 추가해보세요</p>
        </div>
      )}

      {/* 상품 테이블 */}
      {products && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 font-medium">상품명</th>
                <th className="pb-3 font-medium">카테고리</th>
                <th className="pb-3 font-medium text-right">가격</th>
                <th className="pb-3 font-medium text-right">재고</th>
                <th className="pb-3 font-medium text-right">등록일</th>
                <th className="pb-3 font-medium text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`transition-colors ${
                    product.isActive
                      ? "hover:bg-gray-50"
                      : "bg-gray-50 opacity-60" // 비활성 상품은 흐리게
                  }`}
                >
                  <td className="py-3 font-medium text-gray-900 max-w-[180px]">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{product.name}</span>
                      {/* 비활성화 배지 */}
                      {!product.isActive && (
                        <span className="flex-shrink-0 text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                          비활성
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">
                    {product.category ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 text-right text-gray-900">
                    {product.price.toLocaleString("ko-KR")}원
                  </td>
                  <td className="py-3 text-right">
                    <span className={product.stock === 0 ? "text-red-500 font-medium" : "text-gray-700"}>
                      {product.stock === 0 ? "품절" : `${product.stock}개`}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {product.isActive ? (
                        <>
                          {/* 활성 상품: 수정 / 삭제 */}
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => confirmDelete(product)}
                            className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        /* 비활성 상품: 활성화 버튼만 */
                        <button
                          onClick={() => handleToggle({ id: product.id, isActive: true })}
                          className="text-xs px-2.5 py-1 rounded border border-blue-200 text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          활성화
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 등록 모달 */}
      <ProductForm open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* 수정 모달 */}
      <ProductForm
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct ?? undefined}
      />
    </div>
  );
}
