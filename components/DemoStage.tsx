"use client";

import { MerchantPanel } from "@/components/test/MerchantPanel";
import { ConsumerPanel } from "@/components/test/ConsumerPanel";
import { PhoneShell, PAYTM_STATUS_BAR } from "@/components/PhoneShell";

/**
 * The pair of phones the whole demo happens on — the shop's Bharosa Book on
 * the left, the customer's Paytm on the right, both reading the same
 * BharosaContext. Rendered at full size on purpose: judges are meant to tap
 * it, and a scaled-down phone desyncs what they see from what they hit.
 *
 * Used by the case study at "/", the bare /demo route, and /test/split.
 */
export function DemoStage() {
  return (
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
  );
}
