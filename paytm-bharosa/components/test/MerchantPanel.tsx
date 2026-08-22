"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { BalanceCard } from "@/components/BalanceCard";
import { EntryList } from "@/components/EntryList";
import { PendingRequests } from "@/components/PendingRequests";
import { useBharosa } from "@/context/BharosaContext";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationBar } from "@/components/NotificationBar";
import { MERCHANT_ID, MERCHANT_NAME } from "@/lib/seed";
import { ageingLevel, ageingColorClass, daysSince, formatAmount } from "@/lib/format";

/**
 * Standalone merchant view for the split-screen test harness — no <Link>,
 * no router, no role-sync effect. Master/detail navigation is local state
 * so it can sit side by side with ConsumerPanel in the same page and share
 * the one live BharosaContext instance.
 */
export function MerchantPanel() {
  const {
    getBharosaForMerchant,
    getBalance,
    getEntries,
    getPayments,
    addEntry,
  } = useBharosa();
  const { notify } = useNotifications();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const rows = getBharosaForMerchant(MERCHANT_ID).map((bharosa) => {
    const balance = getBalance(bharosa.id);
    const payments = getPayments(bharosa.id);
    const lastPaymentTimestamp = payments.length
      ? Math.max(...payments.map((p) => p.timestamp))
      : bharosa.createdAt;
    return { bharosa, balance, ageing: ageingLevel(daysSince(lastPaymentTimestamp)) };
  });

  const selected = rows.find((r) => r.bharosa.customerId === selectedCustomerId);

  function handleAddEntry() {
    if (!selected) return;
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || !description.trim()) return;
    // "manual", never "digital_scan" — see app/merchant/[customerId]/page.tsx.
    addEntry(selected.bharosa.id, parsed, description.trim(), "manual");
    notify({
      audience: "consumer",
      tone: "warning",
      title: `${selected.bharosa.merchantName} added ${formatAmount(parsed)} to your khata`,
      body: `${description.trim()} — added by the shop, please review`,
    });
    notify({
      audience: "merchant",
      tone: "info",
      title: `${formatAmount(parsed)} added to ${selected.bharosa.customerName}'s khata`,
      body: "Marked unconfirmed until the customer reviews it",
    });
    setAmount("");
    setDescription("");
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
      <NotificationBar audience="merchant" />
      <div
        className="flex h-14 shrink-0 items-center gap-2 px-4"
        style={{ background: "linear-gradient(135deg, #002970 0%, #00BAF2 100%)" }}
      >
        {selected && (
          <button
            type="button"
            onClick={() => setSelectedCustomerId(null)}
            aria-label="Back"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <h2 className="text-lg font-semibold text-white">
          {selected ? selected.bharosa.customerName : MERCHANT_NAME}
        </h2>
        <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
          Merchant
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {!selected ? (
          <>
            <PendingRequests merchantId={MERCHANT_ID} />
            <BalanceCard
              label="Total outstanding"
              amount={rows.reduce((sum, r) => sum + r.balance, 0)}
            />
            {rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-secondary">
                No active bharosas yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {rows.map(({ bharosa, balance, ageing }) => (
                  <button
                    key={bharosa.id}
                    type="button"
                    onClick={() => setSelectedCustomerId(bharosa.customerId)}
                    className="flex items-center gap-3 rounded-2xl border border-border-gray bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  >
                    <Avatar name={bharosa.customerName} />
                    <span className="flex-1 truncate text-[15px] font-semibold text-foreground">
                      {bharosa.customerName}
                    </span>
                    <span className={`text-base font-bold ${ageingColorClass(ageing)}`}>
                      {formatAmount(balance)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <BalanceCard
              label="Total outstanding"
              amount={selected.balance}
              ageing={selected.ageing}
            />
            <div className="flex flex-col gap-2 rounded-2xl border border-border-gray bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <input
                type="text"
                placeholder="Description (e.g. Rice 5kg)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-lg border border-border-gray px-3 py-2 text-sm outline-none focus:border-paytm-blue"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg border border-border-gray px-3 py-2 text-sm outline-none focus:border-paytm-blue"
              />
              <button
                type="button"
                onClick={handleAddEntry}
                className="rounded-xl bg-paytm-navy px-4 py-2 text-sm font-semibold text-white"
              >
                Add to Bharosa
              </button>
            </div>
            <EntryList
              entries={getEntries(selected.bharosa.id)}
              payments={getPayments(selected.bharosa.id)}
            />
          </>
        )}
      </div>
    </div>
  );
}
