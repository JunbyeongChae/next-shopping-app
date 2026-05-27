import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // 모든 https 도메인 허용
        // 관리자가 어떤 외부 URL이든 이미지로 등록할 수 있도록 허용
        // 실제 서비스라면 허용 도메인을 명시적으로 제한하는 것이 보안상 안전
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
