"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PaytmHeader } from "@/components/PaytmHeader";
import { RoleToggle } from "@/components/RoleToggle";
import { MerchantRow } from "@/components/MerchantRow";
import { useBharosa } from "@/context/BharosaContext";
import { ageingLevel, daysSince } from "@/lib/format";

export default function CustomerPage() {
  const { currentRole, currentUserId, switchRole, getBharosaForCustomer, getBalance, getPayments } =
    useBharosa();

  useEffect(() => {
    if (currentRole !== "customer") switchRole("customer");
  }, [currentRole, switchRole]);

  const rows = getBharosaForCustomer(currentUserId).map((bharosa) => {
    const balance = getBalance(bharosa.id);
    const payments = getPayments(bharosa.id);
    const lastPaymentTimestamp = payments.length
      ? Math.max(...payments.map((p) => p.timestamp))
      : bharosa.createdAt;
    const ageing = ageingLevel(daysSince(lastPaymentTimestamp));
    return { bharosa, balance, ageing };
  });

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title="My Bharosas" right={<RoleToggle />} />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-secondary">
            No bharosas yet. Scan a QR to start.
          </p>
        ) : (
          rows.map(({ bharosa, balance, ageing }) => (
            <MerchantRow
              key={bharosa.id}
              href={`/customer/${bharosa.merchantId}`}
              name={bharosa.merchantName}
              balance={balance}
              ageing={ageing}
            />
          ))
        )}

        <Link
          href="/setup"
          className="rounded-2xl border border-dashed border-paytm-blue px-4 py-3 text-center text-sm font-semibold text-paytm-blue-dark"
        >
          + Open new Bharosa
        </Link>
      </div>
    </div>
  );
}
