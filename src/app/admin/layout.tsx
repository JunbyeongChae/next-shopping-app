import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 미들웨어(1차) 다음 레이아웃(2차) 권한 이중 체크
  // 미들웨어는 Edge Runtime이라 DB 조회 없이 JWT만 확인 → 레이아웃에서 한 번 더 검증
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500">관리자 페이지</p>
      </div>
      {children}
    </div>
  );
}
