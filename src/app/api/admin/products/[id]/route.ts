import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/schemas/product.schema";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: "로그인이 필요합니다", status: 401 };
  }
  if ((session.user as any).role !== "admin") {
    return { error: "관리자 권한이 필요합니다", status: 403 };
  }
  return { session };
}

// ── PATCH: 상품 수정 OR 활성화 상태 변경 ──────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await checkAdmin();
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다" }, { status: 404 });
  }

  const body = await request.json();

  // 활성화/비활성화 토글 — isActive 단독으로 전달된 경우
  if ("isActive" in body && Object.keys(body).length === 1) {
    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: body.isActive },
    });
    return NextResponse.json(updated);
  }

  // 상품 정보 전체 수정 — productSchema로 검증
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, price, stock, category, description, imageUrl } = parsed.data;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      stock,
      category: category || null,
      description: description || null,
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(updated);
}

// ── DELETE: 주문 이력 있으면 비활성화 / 없으면 완전 삭제 ──
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await checkAdmin();
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다" }, { status: 404 });
  }

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });

  if (orderItemCount > 0) {
    // 주문 이력 있음 → 완전 삭제 대신 비활성화로 전환
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ deactivated: true });
  }

  // 주문 이력 없음 → 장바구니 아이템 제거 후 완전 삭제
  await prisma.cartItem.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
