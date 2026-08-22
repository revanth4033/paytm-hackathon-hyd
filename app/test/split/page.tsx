"use client";

import { DemoStage } from "@/components/DemoStage";

/** Same pair of phones as the demo screen, kept as a stable URL for
 *  side-by-side testing. */
export default function SplitTestPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-bg-app px-6 py-8">
      <p className="text-center text-sm text-text-secondary">
        Split-screen test harness — both panels share the same live state. Accepting a
        request on the left updates the right instantly, and vice versa.
      </p>
      <DemoStage />
    </div>
  );
}
