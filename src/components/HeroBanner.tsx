"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    src: "/images/banner/banner1.png",
    alt: "배너 이미지 1",
    label: "2026 S/S Collection",
    heading: "지금 가장\n필요한 스타일링",
  },
  {
    src: "/images/banner/banner2.png",
    alt: "배너 이미지 2",
    label: "New Arrivals",
    heading: "새로운 시즌\n새로운 감각",
  },
  {
    src: "/images/banner/banner3.png",
    alt: "배너 이미지 3",
    label: "Best Items",
    heading: "베스트셀러\n지금 만나보세요",
  },
];

const INTERVAL = 5000; // 5초 자동 슬라이드

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <div
      className="relative -mx-4 -mt-8 mb-12 overflow-hidden h-[340px] md:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── 슬라이드 이미지 ──────────────────────────── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* ── 텍스트 콘텐츠 ────────────────────────────── */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
        <p className="text-xs tracking-[0.3em] text-gray-300 uppercase mb-4 transition-all duration-500">
          {SLIDES[current].label}
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8 whitespace-pre-line">
          {SLIDES[current].heading}
        </h2>
        <Link
          href="#products"
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors w-fit"
        >
          쇼핑 시작하기
          <span className="text-base">→</span>
        </Link>
      </div>

      {/* ── 이전 / 다음 버튼 ─────────────────────────── */}
      <button
        onClick={prev}
        aria-label="이전 배너"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white transition-colors rounded-full"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="다음 배너"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 text-white transition-colors rounded-full"
      >
        ›
      </button>

      {/* ── 네비게이션 도트 ───────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`${i + 1}번 배너로 이동`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
