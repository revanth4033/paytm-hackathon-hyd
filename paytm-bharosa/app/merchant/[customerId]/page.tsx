"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PaytmHeader } from "@/components/PaytmHeader";
import { Avatar } from "@/components/Avatar";
import { BalanceCard } from "@/components/BalanceCard";
import { EntryList } from "@/components/EntryList";
import { ReminderButton } from "@/components/ReminderButton";
import { useBharosa } from "@/context/BharosaContext";
import { MERCHANT_ID } from "@/lib/seed";
import { useNotifications } from "@/context/NotificationContext";
import { ageingLevel, daysSince, formatAmount } from "@/lib/format";

export default function MerchantCustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const { currentRole, switchRole, getBharosaForMerchant, getBalance, getEntries, getPayments, addEntry } =
    useBharosa();

  useEffect(() => {
    if (currentRole !== "merchant") switchRole("merchant");
  }, [currentRole, switchRole]);
  const { notify } = useNotifications();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const bharosa = getBharosaForMerchant(MERCHANT_ID).find((b) => b.customerId === customerId);

  if (!bharosa) {
    return (
      <div className="flex flex-1 flex-col">
        <PaytmHeader title="Not found" showBack />
        <p className="p-4 text-sm text-text-secondary">This bharosa doesn&apos;t exist.</p>
      </div>
    );
  }

  const balance = getBalance(bharosa.id);
  const entries = getEntries(bharosa.id);
  const payments = getPayments(bharosa.id);
  const lastPaymentTimestamp = payments.length
    ? Math.max(...payments.map((p) => p.timestamp))
    : bharosa.createdAt;
  const ageing = ageingLevel(daysSince(lastPaymentTimestamp));

  function handleAddEntry() {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0 || !description.trim()) return;
    // "manual", never "digital_scan" — the customer didn't scan this, the
    // merchant typed it. Recording it as a co-signed entry would let a shop
    // fabricate the exact evidence the lending story is meant to trust.
    addEntry(bharosa!.id, parsed, description.trim(), "manual");
    notify({
      audience: "consumer",
      tone: "warning",
      title: `${bharosa!.merchantName} added ${formatAmount(parsed)} to your khata`,
      body: `${description.trim()} — added by the shop, please review`,
    });
    notify({
      audience: "merchant",
      tone: "info",
      title: `${formatAmount(parsed)} added to ${bharosa!.customerName}'s khata`,
      body: "Marked unconfirmed until the customer reviews it",
    });
    setAmount("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title={bharosa.customerName} showBack />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <Avatar name={bharosa.customerName} size={48} />
          <div>
            <p className="text-base font-semibold text-foreground">{bharosa.customerName}</p>
            <p className="text-xs text-text-secondary">Bharosa since {new Date(bharosa.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>

        <BalanceCard label="Total outstanding" amount={balance} ageing={ageing} />

        {showForm ? (
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddEntry}
                className="flex-1 rounded-xl bg-paytm-navy px-4 py-2 text-sm font-semibold text-white"
              >
                Add to Bharosa
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-border-gray px-4 py-2 text-sm font-semibold text-text-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl border border-paytm-blue bg-white px-4 py-2 text-sm font-semibold text-paytm-blue-dark"
          >
            + Add entry
          </button>
        )}

        <EntryList entries={entries} payments={payments} />
      </div>

      {balance > 0 && (
        <div className="shrink-0 border-t border-border-gray bg-white p-4">
          <ReminderButton
            customerName={bharosa.customerName}
            amount={balance}
            lang={bharosa.customerLang}
            merchantName={bharosa.merchantName}
          />
        </div>
      )}
    </div>
  );
}
