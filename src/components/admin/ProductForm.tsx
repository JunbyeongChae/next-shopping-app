"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productSchema, ProductFormData } from "@/schemas/product.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product; // 있으면 수정 모드, 없으면 등록 모드
}

// 등록: POST /api/admin/products
async function createProduct(data: ProductFormData) {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "상품 등록에 실패했습니다");
  }
  return res.json();
}

// 수정: PATCH /api/admin/products/[id]
async function updateProduct(id: string, data: ProductFormData) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "상품 수정에 실패했습니다");
  }
  return res.json();
}

export function ProductForm({ open, onClose, product }: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!product; // product가 있으면 수정 모드

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // 수정 모드: 모달이 열릴 때마다 기존 데이터로 폼 채우기
  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category ?? "",
        description: product.description ?? "",
        imageUrl: product.imageUrl ?? "",
      });
    }
    // 등록 모드: 모달이 열릴 때 폼 초기화
    if (open && !product) {
      reset({
        name: "",
        price: undefined,
        stock: undefined,
        category: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [open, product, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEditMode ? updateProduct(product!.id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      reset();
      onClose();
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {isEditMode ? "상품 수정" : "상품 등록"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-4">
          {/* 상품명 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              상품명 <span className="text-red-500">*</span>
            </label>
            <Input {...register("name")} placeholder="무선 블루투스 이어폰" />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 가격 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              가격 (원) <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="29000"
              min={1}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* 재고 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              재고 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              placeholder="10"
              min={0}
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              카테고리
            </label>
            <Input {...register("category")} placeholder="전자기기, 의류, 식품 등" />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* 설명 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              상품 설명
            </label>
            <textarea
              {...register("description")}
              placeholder="상품에 대한 상세 설명을 입력해주세요"
              rows={3}
              className="w-full border border-input rounded-lg px-2.5 py-2 text-sm resize-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* 이미지 URL */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              이미지 URL
            </label>
            <Input
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg 또는 /images/products/product1.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending
                ? isEditMode ? "수정 중..." : "등록 중..."
                : isEditMode ? "수정하기" : "등록하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
