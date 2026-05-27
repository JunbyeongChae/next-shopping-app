"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import {
  syncCartToDbAction,
  getCartFromDbAction,
} from "@/actions/cart.actions";

export function CartBadge({ userId }: { userId?: string }) {
  const items = useCartStore((state) => state.items);
  const totalCount = useCartStore((state) => state.totalCount());
  const setCart = useCartStore((state) => state.setCart);

  // Hydration 에러 방지용 상태
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 최초 복원 작업이 끝났는지 추적하는 변수 (무한 루프 방지)
  const isInitialized = useRef(false);

  useEffect(() => {
    // 1. 비회원이면 동기화 안 함
    if (!userId) return;

    // 2. 로그인 직후 딱 한 번만 실행되는 로직 (DB에서 복원하기)
    if (!isInitialized.current) {
      getCartFromDbAction(userId).then((dbItems) => {
        // 내 폰(로컬) 장바구니가 비어있고, DB에는 예전에 담아둔 게 있다면? -> DB 것을 로컬로 가져옴
        if (dbItems.length > 0 && items.length === 0) {
          setCart(dbItems);
        } else {
          // 비회원일 때 로컬에 담아둔 게 있다면? -> 그걸로 DB를 덮어씀 (백업)
          syncCartToDbAction(userId, items);
        }
        isInitialized.current = true;
      });
      return; // 첫 복원 시에는 여기서 종료
    }

    // 3. 복원이 끝난 후, 아이템이 변경될 때마다 발동되는 로직 (실시간 백업)
    // 수량 조절, 담기, 삭제 등 Zustand 데이터가 바뀔 때마다 즉시 DB로 백업 됨!
    syncCartToDbAction(userId, items);
  }, [userId, items, setCart]);

  return (
    <Link
      href="/cart"
      className="relative text-sm text-gray-600 hover:text-gray-900"
    >
      장바구니
      {mounted && totalCount > 0 && (
        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {totalCount > 9 ? "9+" : totalCount}
        </span>
      )}
    </Link>
  );
}
