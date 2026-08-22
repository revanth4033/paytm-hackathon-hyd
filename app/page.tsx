"use client";

import { MerchantPanel } from "@/components/test/MerchantPanel";
import { ConsumerPanel } from "@/components/test/ConsumerPanel";
import { PhoneShell, PAYTM_STATUS_BAR } from "@/components/PhoneShell";

/**
 * The app opens on both sides of the Bharosa at once: the shop's book on the
 * left, the customer's Paytm on the right. They share one BharosaContext, so
 * the handoff the product is actually about — customer taps Add Bharosa, the
 * merchant gets the request, accepts, and the customer appears in the book —
 * plays out live across the two phones with nothing to reload in between.
 *
 * The standalone /consumer and /merchant routes still exist for looking at
 * either side full-screen on its own.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-bg-app px-6 py-8">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-foreground">Paytm Bharosa</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Both phones share the same live state — scan and add a Bharosa on the right,
          and the request lands on the left instantly.
        </p>
      </div>
      <div className="flex flex-wrap items-start justify-center gap-8">
        <PhoneShell
          tone="dark"
          screenClassName="bg-white"
          statusBarClassName={PAYTM_STATUS_BAR}
          indicatorTone="light"
        >
          <MerchantPanel />
        </PhoneShell>
        <PhoneShell tone="dark" screenClassName="bg-black">
          <ConsumerPanel />
        </PhoneShell>
      </div>
    </div>
  );
}
