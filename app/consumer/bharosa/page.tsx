"use client";

import Link from "next/link";
import { PaytmHeader } from "@/components/PaytmHeader";
import { Avatar } from "@/components/Avatar";
import { HandshakeIcon, ChevronRightIcon } from "@/components/consumer/icons";
import { useBharosa } from "@/context/BharosaContext";
import { formatAmount, formatDate } from "@/lib/format";

export default function ConsumerBharosaHomePage() {
  const { consumerId, getAllBharosaForCustomer, getBalance, getEntries, getPayments } =
    useBharosa();

  const rows = getAllBharosaForCustomer(consumerId).map((bharosa) => {
    const activity = [...getEntries(bharosa.id), ...getPayments(bharosa.id)];
    const lastTimestamp = activity.length
      ? Math.max(...activity.map((tx) => tx.timestamp))
      : bharosa.createdAt;
    return {
      bharosa,
      balance: getBalance(bharosa.id),
      lastTimestamp,
    };
  });

  return (
    <div className="flex flex-1 flex-col bg-[#0c0c0c] text-white">
      <PaytmHeader title="Bharosa" showBack />

      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-bharosa-amber">
            <HandshakeIcon className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold text-white">No Bharosas yet</p>
          <p className="text-sm text-white/50">Scan a store&apos;s QR code to open your first Bharosa</p>
          <Link
            href="/consumer/scan"
            className="mt-2 rounded-xl bg-[#00BAF2] px-5 py-3 text-sm font-semibold text-white"
          >
            Scan QR
          </Link>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {rows.map(({ bharosa, balance, lastTimestamp }) => (
            <Link
              key={bharosa.id}
              href={`/consumer/bharosa/${bharosa.merchantId}`}
              className="flex items-center gap-3 rounded-2xl bg-[#1a1a1a] p-4"
            >
              <Avatar name={bharosa.merchantName} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-white">
                  {bharosa.merchantName}
                </p>
                <p className="text-xs text-white/50">Last transaction {formatDate(lastTimestamp)}</p>
              </div>
              <div className="flex items-center gap-2">
                {bharosa.status === "pending" ? (
                  <span className="rounded-full bg-bharosa-amber/20 px-2.5 py-1 text-xs font-semibold text-bharosa-amber">
                    Pending
                  </span>
                ) : (
                  <span className="text-base font-bold text-white">{formatAmount(balance)}</span>
                )}
                <ChevronRightIcon className="text-white/40" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
