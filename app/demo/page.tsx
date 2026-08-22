"use client";

import { DemoStage } from "@/components/DemoStage";

/**
 * The prototype with nothing around it — what to open during a live pitch,
 * when the case study at "/" would just be something to scroll past. Both
 * phones share one live state, so the handoff plays out across them with
 * nothing to reload in between.
 */
export default function DemoPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-bg-app px-6 py-8">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-foreground">Paytm Bharosa</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Both phones share the same live state — scan and add a Bharosa on the right,
          and the request lands on the left instantly.
        </p>
      </div>
      <DemoStage />
    </div>
  );
}
