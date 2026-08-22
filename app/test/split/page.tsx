"use client";

import { MerchantPanel } from "@/components/test/MerchantPanel";
import { ConsumerPanel } from "@/components/test/ConsumerPanel";
import { PhoneShell, PAYTM_STATUS_BAR } from "@/components/PhoneShell";

/** Same pair of phones as the landing screen, kept as a stable URL for
 *  side-by-side testing. */
export default function SplitTestPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-bg-app px-6 py-8">
      <p className="text-center text-sm text-text-secondary">
        Split-screen test harness — both panels share the same live state. Accepting a
        request on the left updates the right instantly, and vice versa.
      </p>
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
