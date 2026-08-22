"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BackArrowIcon,
  DialpadIcon,
  GalleryIcon,
  HelpIcon,
  QRIcon,
  TorchIcon,
} from "@/components/consumer/icons";
import { QRMock } from "@/components/QRMock";

/**
 * Paytm's scanner, shared by the standalone /consumer/scan route and the
 * consumer half of the split screen. Purely presentational: it owns the
 * lock-on animation and calls `onScanned` when the QR "locks", leaving the
 * caller to decide whether that means a router.push or a local screen change.
 *
 * There is no camera in the demo, so the viewfinder is a mocked shop counter
 * with the store's QR standee sitting in it. Tapping the standee stands in for
 * holding the phone still until the QR locks on.
 */

interface ScannerScreenProps {
  merchantName: string;
  onBack: () => void;
  onScanned: () => void;
  /** Optional pill rendered in the top bar — the split screen uses it to keep
   *  the "Consumer" label visible on this screen too. */
  badge?: ReactNode;
}

const SHEET_ACTIONS = [
  { label: "Upload from Gallery", icon: <GalleryIcon /> },
  { label: "Enter Mobile Number", icon: <DialpadIcon /> },
  { label: "My QR Code", icon: <QRIcon /> },
];

const CORNERS = [
  "left-0 top-0 rounded-tl-2xl border-l-4 border-t-4",
  "right-0 top-0 rounded-tr-2xl border-r-4 border-t-4",
  "bottom-0 left-0 rounded-bl-2xl border-b-4 border-l-4",
  "bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4",
];

/** Long enough for the lock-on state to register as feedback, short enough
 *  that it still feels like a scan rather than a loading screen. */
const LOCK_DELAY_MS = 700;

export function ScannerScreen({ merchantName, onBack, onScanned, badge }: ScannerScreenProps) {
  const [torchOn, setTorchOn] = useState(false);
  const [locked, setLocked] = useState(false);

  // Held in a ref so a re-render mid-lock (the split screen re-renders on every
  // context change) can't restart the timer and strand the scan.
  const onScannedRef = useRef(onScanned);
  useEffect(() => {
    onScannedRef.current = onScanned;
  });

  useEffect(() => {
    if (!locked) return;
    const timer = setTimeout(() => onScannedRef.current(), LOCK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [locked]);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-black text-white">
      {/* Mocked camera feed — a dim shop counter, brightened by the torch. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_35%,#3b3327_0%,#191512_50%,#070707_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgba(0,0,0,0.85),transparent)]" />
        <div
          className={`absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_42%,rgba(255,246,220,0.22)_0%,transparent_70%)] transition-opacity duration-300 ${
            torchOn ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="relative flex items-center justify-between px-4 pt-4">
        <button type="button" onClick={onBack} className="p-1 text-white" aria-label="Back">
          <BackArrowIcon />
        </button>
        <p className="text-[15px] font-semibold text-white">Scan any QR code</p>
        <div className="flex items-center gap-2">
          {badge}
          <button
            type="button"
            onClick={() => setTorchOn((on) => !on)}
            aria-pressed={torchOn}
            aria-label="Toggle flash"
            className={`rounded-full p-2 transition-colors ${
              torchOn ? "bg-white text-black" : "bg-white/10 text-white"
            }`}
          >
            <TorchIcon className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="rounded-full bg-white/10 p-2 text-white"
          >
            <HelpIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="relative h-[248px] w-[248px]">
          {/* Everything outside the frame dims down, the way a real scanner
              punches a bright cutout through the viewfinder. The spread on the
              shadow does the darkening; the phone frame clips it. */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
          />

          {CORNERS.map((corner) => (
            <span
              key={corner}
              aria-hidden
              className={`absolute h-9 w-9 transition-colors ${corner} ${
                locked ? "border-success" : "border-[#00BAF2]"
              }`}
            />
          ))}

          {!locked && (
            <span
              aria-hidden
              className="scan-sweep absolute inset-x-5 top-1/2 h-0.5 rounded-full bg-[#00BAF2] shadow-[0_0_14px_3px_rgba(0,186,242,0.65)]"
            />
          )}

          <button
            type="button"
            onClick={() => setLocked(true)}
            disabled={locked}
            aria-label={`Scan the QR code at ${merchantName}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className={`block origin-center transition-transform duration-300 ${
                locked ? "scale-[0.72]" : "scale-[0.78]"
              }`}
            >
              <QRMock seed={merchantName} caption={merchantName} />
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-white/70">
          {locked ? "QR code detected…" : "Place the QR code inside the frame"}
        </p>
      </div>

      {/* Paytm's scanner sheet — decorative, the QR above is the live path. */}
      <div className="relative rounded-t-3xl bg-[#141414]/95 px-4 pb-6 pt-3 backdrop-blur">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="flex justify-around">
          {SHEET_ACTIONS.map((action) => (
            <div key={action.label} className="flex w-20 flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                {action.icon}
              </div>
              <span className="text-center text-[11px] leading-tight text-white/70">
                {action.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
