"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cartStore";
import { orderSchema, OrderFormData } from "@/schemas/order.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// 전화번호 자동 포맷
// 10자리: 010-123-4567  (가운데 3자리)
// 11자리: 010-1234-5678 (가운데 4자리)
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

interface CheckoutFormProps {
  userName: string; // 서버에서 받아온 로그인 유저 이름
}

export function CheckoutForm({ userName }: CheckoutFormProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      receiverName: userName, // 유저 이름을 기본값으로 채움
    },
  });

  useEffect(() => {
    if (items.length === 0) router.push("/products");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const onSubmit = async (data: OrderFormData) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "주문 처리 중 오류가 발생했습니다");
        return;
      }

      clearCart();
      router.push("/mypage");
    } catch {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">주문하기</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 주문 폼 */}
        <div>
          <h2 className="font-semibold text-lg mb-4">배송지 정보</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* 받는 분 이름 — 로그인 유저 이름 기본값 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                받는 분 이름
              </label>
              <Input {...register("receiverName")} placeholder="홍길동" />
              {errors.receiverName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.receiverName.message}
                </p>
              )}
            </div>

            {/* 전화번호 — 숫자 입력 시 자동 포맷 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                전화번호
              </label>
              <Controller
                name="receiverPhone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    placeholder="010-1234-5678"
                    maxLength={13}
                    inputMode="numeric"
                  />
                )}
              />
              {errors.receiverPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.receiverPhone.message}
                </p>
              )}
            </div>

            {/* 배송 주소 */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                배송 주소
              </label>
              <Input
                {...register("address")}
                placeholder="서울시 강남구 테헤란로 123"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "처리 중..." : "결제하기"}
            </Button>
          </form>
        </div>

        {/* 주문 요약 */}
        <div>
          <h2 className="font-semibold text-lg mb-4">주문 상품</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString("ko-KR")}원
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span>총 결제금액</span>
              <span>{totalPrice().toLocaleString("ko-KR")}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
