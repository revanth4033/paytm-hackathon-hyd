"use client";

import type { ReactNode } from "react";

/**
 * iPhone mockup: titanium bezel, Dynamic Island, iOS status bar and home
 * indicator, wrapped around a 390×844 screen. The chrome is inert — it exists
 * so screenshots of the demo read as a phone rather than a browser window.
 *
 * `tone` follows the screen behind it: the consumer's Paytm is dark, the
 * merchant's Bharosa Book is light, and the status-bar glyphs have to invert
 * with it or they vanish into the background.
 */

interface PhoneShellProps {
  children: ReactNode;
  tone?: "light" | "dark";
  /** Fills the screen area behind the content — matters while a screen is
   *  shorter than the phone, so the gap doesn't flash the wrong colour. */
  screenClassName?: string;
  /** Painted behind the status bar. The merchant screens run a blue gradient
   *  header, and iOS draws that colour up under the clock rather than leaving
   *  a white band above it. */
  statusBarClassName?: string;
  /** The home indicator sits at the far end of the screen, which is often a
   *  different colour from the top — a merchant screen runs the blue gradient
   *  under the clock but ends on a white footer. Defaults to `tone`. */
  indicatorTone?: "light" | "dark";
  className?: string;
}

/** The Paytm header gradient, for screens whose chrome runs to the top. */
export const PAYTM_STATUS_BAR = "bg-[linear-gradient(135deg,#002970_0%,#0071b8_100%)]";

/** Frozen at the time in the reference screenshots. */
const STATUS_TIME = "15:08";

function StatusBar({ tone, className = "" }: { tone: "light" | "dark"; className?: string }) {
  const fg = tone === "dark" ? "text-white" : "text-black";

  return (
    <div
      className={`relative z-30 flex h-12 shrink-0 items-center justify-between px-7 pt-1 ${fg} ${className}`}
    >
      <span className="text-[15px] font-semibold tracking-tight tabular-nums">{STATUS_TIME}</span>
      <div className="flex items-center gap-1.5">
        {/* cellular */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" opacity="0.9" />
          <rect x="4.6" y="6" width="3" height="6" rx="1" opacity="0.9" />
          <rect x="9.2" y="3.5" width="3" height="8.5" rx="1" opacity="0.9" />
          <rect x="13.8" y="1" width="3" height="11" rx="1" opacity="0.4" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" aria-hidden>
          <path d="M1 4.2a10 10 0 0 1 14 0" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M3.7 7a6.2 6.2 0 0 1 8.6 0" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="8" cy="9.8" r="1.2" fill="currentColor" stroke="none" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden>
          <rect x="0.6" y="0.6" width="21" height="11.8" rx="3.4" stroke="currentColor" opacity="0.45" />
          <rect x="2.3" y="2.3" width="13" height="8.4" rx="2.1" fill="currentColor" />
          <path d="M23.4 4.6v3.8a2.3 2.3 0 0 0 0-3.8Z" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function PhoneShell({
  children,
  tone = "dark",
  screenClassName = "bg-black",
  statusBarClassName = "",
  indicatorTone,
  className = "",
}: PhoneShellProps) {
  const indicator = indicatorTone ?? tone;
  return (
    <div
      className={`relative rounded-[3.2rem] bg-gradient-to-b from-[#3a3d42] via-[#17181a] to-[#3a3d42] p-[3px] shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div className="rounded-[3.05rem] bg-black p-[9px]">
        <div
          className={`relative flex h-[844px] w-[390px] max-w-full flex-col overflow-hidden rounded-[2.6rem] ${screenClassName}`}
        >
          {/* Dynamic Island. The ring keeps it legible against a black app —
              a pure-black pill on a pure-black screen reads as nothing at all,
              and the point of the mockup is that it looks like a phone. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[9px] z-40 flex h-[31px] w-[116px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]"
          >
            <span className="h-[10px] w-[10px] rounded-full bg-[#0d1117] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]" />
          </div>

          <StatusBar tone={tone} className={statusBarClassName} />

          <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>

          {/* Home indicator */}
          <div
            aria-hidden
            className={`pointer-events-none absolute bottom-[7px] left-1/2 z-40 h-[5px] w-[134px] -translate-x-1/2 rounded-full ${
              indicator === "dark" ? "bg-white/85" : "bg-black/75"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
