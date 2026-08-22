"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "@/components/Avatar";
import { BackArrowIcon } from "@/components/consumer/icons";
import { useBharosa, CONSUMER_NAME } from "@/context/BharosaContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatAmount } from "@/lib/format";

/**
 * Paytm's post-scan payment screen, shared by /consumer/pay/[merchantId] and
 * the consumer half of the split screen — one source of truth so the two can't
 * drift apart on chip labels or CTA behaviour.
 *
 * Bharosa lives here as a chip beside Shopping and EMI rather than as its own
 * journey: pick it and the primary CTA flips from "Proceed" to "Add Bharosa",
 * which sends the merchant a request the first time and appends to the ledger
 * once they've accepted.
 *
 * Presentational as far as navigation goes — `onDone` reports where the flow
 * should land next and the caller decides whether that's a route push or a
 * local screen change.
 */

interface PayScreenProps {
  merchantId: string;
  merchantName: string;
  onBack: () => void;
  /** "home" after a plain payment or a fresh Bharosa request, "bharosa" after
   *  adding to an already-active Bharosa. */
  onDone: (destination: "home" | "bharosa") => void;
  badge?: ReactNode;
}

type ChipId = "bharosa" | "shopping" | "emi";

const CHIP_LABELS: Record<"shopping" | "emi", string> = {
  shopping: "🛍️ Shopping",
  emi: "💰 EMI and Loans",
};

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "⌫"],
];

/** The request confirmation carries more to read than a plain payment's. */
const REQUEST_DWELL_MS = 1600;
const PAYMENT_DWELL_MS = 1200;

export function PayScreen({ merchantId, merchantName, onBack, onDone, badge }: PayScreenProps) {
  const { consumerId, getLiveBharosa, requestBharosa, addEntry } = useBharosa();
  const { notify } = useNotifications();

  // Only an active or pending relationship counts. A closed one must not keep
  // the chip hidden forever — the customer has to be able to open a new khata.
  const bharosa = getLiveBharosa(consumerId, merchantId);
  const canUseBharosaChip = !bharosa || bharosa.status === "active";

  const [amount, setAmount] = useState("0");
  const [selectedChip, setSelectedChip] = useState<ChipId | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cleared on unmount so the dwell timer can't fire onDone against a screen
  // the user has already navigated away from.
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (dwellTimer.current) clearTimeout(dwellTimer.current);
    },
    []
  );

  const numericAmount = Number(amount) || 0;

  function pressKey(key: string) {
    if (key === "⌫") {
      setAmount((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
      return;
    }
    if (key === "." && amount.includes(".")) return;
    setAmount((prev) => (prev === "0" && key !== "." ? key : prev + key));
  }

  function finish(message: string, destination: "home" | "bharosa", dwellMs: number) {
    setSuccess(message);
    dwellTimer.current = setTimeout(() => onDone(destination), dwellMs);
  }

  function handleProceed() {
    if (numericAmount <= 0) return;
    const formatted = formatAmount(numericAmount);

    if (selectedChip === "bharosa") {
      // Guarded on status rather than existence: a pending request must not be
      // able to fire a second one, and the chip is hidden in that state anyway.
      if (!bharosa) {
        requestBharosa({
          merchantId,
          merchantName,
          customerId: consumerId,
          customerName: CONSUMER_NAME,
          customerLang: "en",
          initialAmount: numericAmount,
          initialDescription: "Bharosa purchase",
        });
        notify({
          audience: "merchant",
          tone: "warning",
          title: `${CONSUMER_NAME} wants to open a Bharosa`,
          body: `${formatted} first purchase — accept or decline`,
        });
        notify({
          audience: "consumer",
          tone: "info",
          title: `Bharosa request sent to ${merchantName}`,
          body: `${formatted} — you'll be notified when they accept`,
        });
        finish(
          `Bharosa request sent to ${merchantName} for ${formatted} — you'll be notified when they accept.`,
          "home",
          REQUEST_DWELL_MS
        );
        return;
      }

      if (bharosa.status === "active") {
        addEntry(bharosa.id, numericAmount, "Bharosa purchase", "digital_scan");
        notify({
          audience: "merchant",
          tone: "success",
          title: `${CONSUMER_NAME} added ${formatted} to their khata`,
          body: "Customer-scanned entry — co-signed",
        });
        notify({
          audience: "consumer",
          tone: "success",
          title: `${formatted} added to your Bharosa`,
          body: `with ${merchantName}`,
        });
        finish(`${formatted} added to your Bharosa with ${merchantName}`, "bharosa", PAYMENT_DWELL_MS);
        return;
      }
    }

    notify({
      audience: "merchant",
      tone: "success",
      title: `${formatted} received from ${CONSUMER_NAME}`,
      body: "Paid via Paytm UPI",
    });
    notify({
      audience: "consumer",
      tone: "success",
      title: `${formatted} paid to ${merchantName}`,
    });
    finish(`${formatted} paid to ${merchantName}`, "home", PAYMENT_DWELL_MS);
  }

  if (success) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[#0c0c0c] p-6 text-center text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-base font-semibold text-white">{success}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0c0c0c] text-white">
      <div className="flex items-center px-4 pt-4">
        <button type="button" onClick={onBack} className="p-1 text-white" aria-label="Back">
          <BackArrowIcon />
        </button>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <Avatar name={merchantName} size={56} />
        <p className="text-lg font-bold text-white">{merchantName}</p>
        <p className="text-xs text-white/50">Verified Name, A/c Linked on Paytm</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p className="flex items-baseline gap-1 text-5xl font-semibold text-white/90">
          <span className="text-3xl text-white/40">₹</span>
          {amount}
        </p>
        {bharosa?.status === "pending" && (
          <p className="px-4 text-center text-xs font-medium text-bharosa-amber">
            Bharosa request pending — waiting for {merchantName} to accept
          </p>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {canUseBharosaChip && (
          <button
            type="button"
            onClick={() => setSelectedChip(selectedChip === "bharosa" ? null : "bharosa")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              selectedChip === "bharosa"
                ? "bg-bharosa-amber text-black"
                : "bg-bharosa-amber/25 text-bharosa-amber"
            }`}
          >
            🤝 Add Bharosa
          </button>
        )}
        {(Object.keys(CHIP_LABELS) as (keyof typeof CHIP_LABELS)[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedChip(selectedChip === id ? null : id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              selectedChip === id ? "bg-white text-black" : "bg-white/10 text-white/80"
            }`}
          >
            {CHIP_LABELS[id]}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleProceed}
          disabled={numericAmount <= 0}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00BAF2] px-4 py-3 text-base font-semibold text-white disabled:opacity-50"
        >
          {selectedChip === "bharosa" ? "Add Bharosa" : "Proceed"}
        </button>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-px bg-black pb-4">
        {KEYPAD_ROWS.flat().map((key, i) => (
          <button
            key={`${key}-${i}`}
            type="button"
            onClick={() => pressKey(key)}
            className={`py-4 text-xl font-medium ${
              key === "." ? "text-[#00BAF2]" : "text-white"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
