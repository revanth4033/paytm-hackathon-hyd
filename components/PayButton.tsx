"use client";

import { useState } from "react";
import { useBharosa } from "@/context/BharosaContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatAmount } from "@/lib/format";

interface PayButtonProps {
  bharosaId: string;
  balance: number;
  merchantName: string;
  customerName: string;
  /** The customer's khata appears on a light screen in /customer/* and a dark
   *  one in /consumer/*. Only the palette differs — the settlement rules that
   *  actually matter (clamping, partial, paying the remainder) stay in one
   *  place rather than being reimplemented per theme. */
  variant?: "light" | "dark";
}

type Mode = "idle" | "partial" | "success";

const THEME = {
  light: {
    card: "border-border-gray bg-white",
    input: "border-border-gray bg-white text-foreground",
    primary: "rounded-xl bg-paytm-navy text-white",
    link: "text-paytm-blue-dark",
    cancel: "border-border-gray text-text-secondary",
    muted: "text-text-secondary",
  },
  dark: {
    card: "border-white/10 bg-[#1a1a1a]",
    input: "border-white/15 bg-[#111111] text-white placeholder:text-white/40",
    primary: "rounded-full bg-[#00BAF2] text-white",
    link: "text-[#00BAF2]",
    cancel: "border-white/20 text-white/70",
    muted: "text-white/50",
  },
} as const;

export function PayButton({
  bharosaId,
  balance,
  merchantName,
  customerName,
  variant = "light",
}: PayButtonProps) {
  const theme = THEME[variant];
  const { addPayment } = useBharosa();
  const { notify } = useNotifications();
  const [mode, setMode] = useState<Mode>("idle");
  const [partialAmount, setPartialAmount] = useState("");
  const [lastPaid, setLastPaid] = useState(0);
  const [upiRef, setUpiRef] = useState("");

  function pay(amount: number) {
    const payment = addPayment(bharosaId, amount);
    setLastPaid(payment.amount);
    setUpiRef(payment.upiReference);
    setPartialAmount("");
    setMode("success");
    notify({
      audience: "consumer",
      tone: "success",
      title: `${formatAmount(payment.amount)} paid to ${merchantName}`,
      body: payment.upiReference,
    });
    notify({
      audience: "merchant",
      tone: "success",
      title: `${customerName} paid ${formatAmount(payment.amount)}`,
      body: `Received via Paytm UPI · ${payment.upiReference}`,
    });
  }

  function handlePartialConfirm() {
    const parsed = Number(partialAmount);
    if (!parsed || parsed <= 0 || parsed > balance) return;
    pay(parsed);
  }

  // Checked before the cleared state so the receipt survives a payment that
  // settles the khata in full — otherwise the UPI reference flashes out of
  // existence the instant the balance hits zero.
  if (mode === "success") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-4 text-center">
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
        <p className="text-sm font-semibold text-success">Paid via Paytm UPI</p>
        <p className={`text-xs ${theme.muted}`}>
          {formatAmount(lastPaid)} · {upiRef}
        </p>
        {/* A partial payment leaves a balance, and the customer must be able to
            pay the rest without reloading the page to escape this receipt. */}
        {balance > 0 && (
          <button
            type="button"
            onClick={() => setMode("idle")}
            className={`mt-1 px-4 py-2 text-sm font-semibold ${theme.primary}`}
          >
            Pay remaining {formatAmount(balance)}
          </button>
        )}
      </div>
    );
  }

  if (balance <= 0) {
    return (
      <div className="rounded-xl bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">
        Cleared — nothing owed
      </div>
    );
  }

  if (mode === "partial") {
    return (
      <div className={`flex flex-col gap-2 rounded-xl border p-3 ${theme.card}`}>
        <input
          type="number"
          autoFocus
          max={balance}
          placeholder={`Up to ${formatAmount(balance)}`}
          value={partialAmount}
          onChange={(e) => setPartialAmount(e.target.value)}
          className={`rounded-lg border px-3 py-2 text-sm outline-none focus:border-paytm-blue ${theme.input}`}
        />
        {Number(partialAmount) > balance && (
          <p className="text-xs text-alert">
            You only owe {formatAmount(balance)}.
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePartialConfirm}
            className={`flex-1 px-4 py-3 text-sm font-semibold ${theme.primary}`}
          >
            Confirm payment
          </button>
          <button
            type="button"
            onClick={() => setMode("idle")}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${theme.cancel}`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => pay(balance)}
        className={`w-full px-4 py-3 text-sm font-semibold ${theme.primary}`}
      >
        Pay {formatAmount(balance)}
      </button>
      <button
        type="button"
        onClick={() => setMode("partial")}
        className={`text-sm font-medium underline-offset-2 hover:underline ${theme.link}`}
      >
        Pay partial amount
      </button>
    </div>
  );
}
