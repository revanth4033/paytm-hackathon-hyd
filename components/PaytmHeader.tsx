"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface PaytmHeaderProps {
  title: string;
  showBack?: boolean;
  accent?: boolean;
  right?: ReactNode;
}

export function PaytmHeader({ title, showBack = false, accent = false, right }: PaytmHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="flex h-14 shrink-0 items-center gap-2 px-4"
      style={{
        background: "linear-gradient(135deg, #002970 0%, #00BAF2 100%)",
      }}
    >
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <h1 className="truncate text-lg font-semibold text-white">{title}</h1>
      {accent && (
        <span className="rounded-full bg-bharosa-amber/90 px-2.5 py-0.5 text-xs font-semibold text-white">
          Bharosa
        </span>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}
