"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { PaytmHeader } from "@/components/PaytmHeader";
import { Avatar } from "@/components/Avatar";
import { BalanceCard } from "@/components/BalanceCard";
import { EntryList } from "@/components/EntryList";
import { PayButton } from "@/components/PayButton";
import { useBharosa } from "@/context/BharosaContext";

export default function CustomerMerchantDetailPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const {
    currentRole,
    currentUserId,
    switchRole,
    getBharosaForCustomer,
    getBalance,
    getEntries,
    getPayments,
  } = useBharosa();

  useEffect(() => {
    if (currentRole !== "customer") switchRole("customer");
  }, [currentRole, switchRole]);

  const bharosa = getBharosaForCustomer(currentUserId).find((b) => b.merchantId === merchantId);

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

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title={bharosa.merchantName} showBack />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <Avatar name={bharosa.merchantName} size={48} />
          <div>
            <p className="text-base font-semibold text-foreground">{bharosa.merchantName}</p>
            <p className="text-xs text-text-secondary">
              Bharosa since{" "}
              {new Date(bharosa.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <BalanceCard label="You owe" amount={balance} tone={balance <= 0 ? "green" : "navy"} />

        <EntryList entries={entries} payments={payments} />
      </div>

      <div className="shrink-0 border-t border-border-gray bg-white p-4">
        <PayButton
          bharosaId={bharosa.id}
          balance={balance}
          merchantName={bharosa.merchantName}
          customerName={bharosa.customerName}
        />
      </div>
    </div>
  );
}
