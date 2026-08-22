"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PaytmHeader } from "@/components/PaytmHeader";
import { RoleToggle } from "@/components/RoleToggle";
import { BalanceCard } from "@/components/BalanceCard";
import { CustomerRow } from "@/components/CustomerRow";
import { PendingRequests } from "@/components/PendingRequests";
import { useBharosa } from "@/context/BharosaContext";
import { MERCHANT_ID } from "@/lib/seed";
import { ageingLevel, daysSince, type AgeingLevel } from "@/lib/format";

const AGEING_RANK: Record<AgeingLevel, number> = { overdue: 0, ageing: 1, normal: 2 };

export default function MerchantPage() {
  const { currentRole, switchRole, getBharosaForMerchant, getBalance, getPayments } = useBharosa();

  useEffect(() => {
    if (currentRole !== "merchant") switchRole("merchant");
  }, [currentRole, switchRole]);

  const rows = getBharosaForMerchant(MERCHANT_ID)
    .map((bharosa) => {
      const balance = getBalance(bharosa.id);
      const payments = getPayments(bharosa.id);
      const lastPaymentTimestamp = payments.length
        ? Math.max(...payments.map((p) => p.timestamp))
        : bharosa.createdAt;
      const ageing = ageingLevel(daysSince(lastPaymentTimestamp));
      return { bharosa, balance, ageing };
    })
    .sort((a, b) => AGEING_RANK[a.ageing] - AGEING_RANK[b.ageing] || b.balance - a.balance);

  const total = rows.reduce((sum, r) => sum + r.balance, 0);

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title="Bharosa Book" right={<RoleToggle />} />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <PendingRequests merchantId={MERCHANT_ID} />
        <BalanceCard label="Total outstanding" amount={total} />

        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-secondary">
            No bharosas yet. Scan a QR to start.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map(({ bharosa, balance, ageing }) => (
              <CustomerRow
                key={bharosa.id}
                href={`/merchant/${bharosa.customerId}`}
                name={bharosa.customerName}
                balance={balance}
                ageing={ageing}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-center gap-3 border-t border-border-gray bg-white p-4">
        <Link
          href="/ocr"
          className="flex-1 rounded-xl border border-bharosa-amber bg-white px-4 py-3 text-center text-sm font-semibold text-bharosa-amber"
        >
          Scan Paper Book
        </Link>
        <Link
          href="/chat"
          className="flex-1 rounded-xl border border-paytm-blue bg-white px-4 py-3 text-center text-sm font-semibold text-paytm-blue-dark"
        >
          Ask
        </Link>
      </div>
    </div>
  );
}
