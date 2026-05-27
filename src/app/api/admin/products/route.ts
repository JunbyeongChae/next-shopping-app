import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/schemas/product.schema";

// 관리자 권한 확인 공통 함수
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

// ── GET: 전체 상품 목록 조회 ──────────────────────────
export async function GET() {
  const result = await checkAdmin();
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true } } },
  });

  return NextResponse.json(products);
}

// ── POST: 상품 등록 ───────────────────────────────────
export async function POST(request: NextRequest) {
  const result = await checkAdmin();
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = await request.json();

  // Zod 유효성 검사
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, price, stock, category, description, imageUrl } = parsed.data;

  const product = await prisma.product.create({
    data: {
      name,
      price,
      stock,
      category: category || null,
      description: description || null,
      imageUrl: imageUrl || null,
      isActive: false, // 신규 등록 상품은 기본적으로 비활성화 → 관리자가 직접 활성화
    },
  });

  return NextResponse.json(product, { status: 201 });
}
