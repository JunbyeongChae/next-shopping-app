"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Heart, Minus, Plus, ShoppingBag, Zap } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const totalPrice = product.price * qty;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── 혜택 정보 박스 ──────────────────────────── */}
      <div className="border border-gray-200 divide-y divide-gray-100 text-sm">
        <div className="flex items-start gap-3 px-4 py-3">
          <span className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">배송</span>
          <div>
            <span className="font-medium text-gray-800">
              {product.price >= 50000 ? "무료배송" : "3,000원"}
            </span>
            {product.price >= 50000 && (
              <span className="ml-2 text-xs text-blue-500">50,000원 이상 무료</span>
            )}
            <p className="text-xs text-gray-400 mt-0.5">3일 이내 출고 · CJ대한통운</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-4 py-3">
          <span className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">적립</span>
          <span className="text-gray-800">
            구매 시 <strong>{Math.floor(product.price * 0.01).toLocaleString("ko-KR")}P</strong> 적립
          </span>
        </div>
        <div className="flex items-start gap-3 px-4 py-3">
          <span className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">재고</span>
          <span className={product.stock > 10 ? "text-gray-800" : "text-red-500 font-medium"}>
            {product.stock > 0
              ? product.stock > 10
                ? `${product.stock}개 이상`
                : `잔여 ${product.stock}개`
              : "품절"}
          </span>
        </div>
      </div>

      {/* ── 수량 선택 ───────────────────────────────── */}
      {product.stock > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">수량</span>
          <div className="flex items-center border border-gray-300">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── 총 상품금액 ─────────────────────────────── */}
      {product.stock > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">총 상품금액</span>
          <span className="text-xl font-bold text-gray-900">
            {totalPrice.toLocaleString("ko-KR")}원
          </span>
        </div>
      )}

      {/* ── 액션 버튼 ───────────────────────────────── */}
      {product.stock > 0 ? (
        <div className="flex gap-2">
          {/* 위시리스트 */}
          <button
            onClick={() => setWished((w) => !w)}
            className={`w-12 h-12 flex items-center justify-center border transition-colors shrink-0 ${
              wished
                ? "border-red-400 text-red-500 bg-red-50"
                : "border-gray-300 text-gray-500 hover:border-gray-500"
            }`}
          >
            <Heart size={18} fill={wished ? "currentColor" : "none"} />
          </button>

          {/* 장바구니 */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 h-12 flex items-center justify-center gap-2 border text-sm font-semibold transition-colors ${
              added
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-900 text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ShoppingBag size={16} />
            {added ? "담았습니다!" : "장바구니"}
          </button>

          {/* 바로구매 */}
          <button
            className="flex-1 h-12 flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            <Zap size={16} />
            바로구매
          </button>
        </div>
      ) : (
        <button
          disabled
          className="w-full h-12 bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
        >
          품절된 상품입니다
        </button>
      )}
    </div>
  );
}
