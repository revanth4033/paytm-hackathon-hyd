"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaytmHeader } from "@/components/PaytmHeader";
import { QRMock } from "@/components/QRMock";
import { useBharosa } from "@/context/BharosaContext";
import { MERCHANT_NAME } from "@/lib/seed";

type Stage = "scan" | "confirm" | "waiting" | "success";

export default function SetupPage() {
  const router = useRouter();
  const { openBharosa, activateCustomerPersona } = useBharosa();
  const [stage, setStage] = useState<Stage>("scan");

  function handleAccept() {
    const customerId = `c-${Date.now()}`;
    openBharosa({
      customerId,
      customerName: "You",
      customerLang: "en",
    });
    activateCustomerPersona(customerId);
    setStage("success");
  }

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title="Open Bharosa" showBack />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        {stage === "scan" && (
          <>
            <QRMock seed={MERCHANT_NAME} caption={`Scan to Pay / Bharosa — ${MERCHANT_NAME}`} />
            <button
              type="button"
              onClick={() => setStage("confirm")}
              className="w-full rounded-xl bg-paytm-navy px-4 py-3 text-sm font-semibold text-white"
            >
              Simulate scan
            </button>
          </>
        )}

        {stage === "confirm" && (
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-border-gray bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-base font-semibold text-foreground">
              Open Bharosa with {MERCHANT_NAME}?
            </p>
            <p className="text-sm text-text-secondary">
              You&apos;ll be able to add purchases to a shared ledger and settle up anytime.
            </p>
            <button
              type="button"
              onClick={() => setStage("waiting")}
              className="w-full rounded-xl bg-paytm-navy px-4 py-3 text-sm font-semibold text-white"
            >
              Open Bharosa
            </button>
          </div>
        )}

        {stage === "waiting" && (
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-border-gray bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-paytm-blue border-t-transparent" />
            <p className="text-sm text-text-secondary">
              Waiting for {MERCHANT_NAME} to accept…
            </p>
            <button
              type="button"
              onClick={handleAccept}
              className="w-full rounded-xl border border-paytm-blue bg-white px-4 py-3 text-sm font-semibold text-paytm-blue-dark"
            >
              Simulate merchant accept
            </button>
          </div>
        )}

        {stage === "success" && (
          <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-success">
              Bharosa opened ✓ — you can now add to your bharosa when you shop here.
            </p>
            <button
              type="button"
              onClick={() => router.push("/customer")}
              className="w-full rounded-xl bg-paytm-navy px-4 py-3 text-sm font-semibold text-white"
            >
              Go to My Bharosas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
