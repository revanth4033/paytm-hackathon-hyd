"use client";

import { useParams } from "next/navigation";
import { PaytmHeader } from "@/components/PaytmHeader";
import { Avatar } from "@/components/Avatar";
import { PayButton } from "@/components/PayButton";
import { SourceBadge } from "@/components/consumer/SourceBadge";
import { useBharosa } from "@/context/BharosaContext";
import { formatAmount, formatDate } from "@/lib/format";
import type { Entry, Payment } from "@/lib/types";

type Transaction =
  | { kind: "entry"; timestamp: number; data: Entry }
  | { kind: "payment"; timestamp: number; data: Payment };

export default function ConsumerBharosaDetailPage() {
  const { merchantId } = useParams<{ merchantId: string }>();
  const { consumerId, getLiveBharosa, getBalance, getEntries, getPayments } = useBharosa();

  // The live relationship, not just any match: a closed khata for this shop
  // must not shadow a newly reopened one.
  const bharosa = getLiveBharosa(consumerId, merchantId);

  if (!bharosa) {
    return (
      <div className="flex flex-1 flex-col bg-[#0c0c0c] text-white">
        <PaytmHeader title="Bharosa" showBack />
        <p className="p-4 text-sm text-white/50">You don&apos;t have a Bharosa with this store.</p>
      </div>
    );
  }

  const balance = getBalance(bharosa.id);
  const entries = getEntries(bharosa.id);
  const payments = getPayments(bharosa.id);
  const transactions: Transaction[] = [
    ...entries.map((e): Transaction => ({ kind: "entry", timestamp: e.timestamp, data: e })),
    ...payments.map((p): Transaction => ({ kind: "payment", timestamp: p.timestamp, data: p })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex flex-1 flex-col bg-[#0c0c0c] text-white">
      <PaytmHeader title={bharosa.merchantName} showBack />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center gap-3">
          <Avatar name={bharosa.merchantName} size={48} />
          <div>
            <p className="text-base font-semibold text-white">{bharosa.merchantName}</p>
            <p className="text-xs text-white/50">
              Bharosa since{" "}
              {new Date(bharosa.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {bharosa.status === "pending" ? (
          <div className="rounded-2xl bg-bharosa-amber/10 p-4">
            <p className="text-sm font-semibold text-bharosa-amber">Pending</p>
            <p className="mt-1 text-sm text-white/70">
              Waiting for {bharosa.merchantName} to accept your Bharosa request.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#1a1a1a] p-4">
            <p className="text-xs font-medium text-white/50">
              {balance > 0 ? "You owe" : "Cleared"}
            </p>
            <p className={`mt-1 text-3xl font-bold ${balance > 0 ? "text-white" : "text-success"}`}>
              {formatAmount(balance)}
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-[#1a1a1a] px-4">
          {transactions.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/50">No entries yet.</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={`${tx.kind}-${tx.data.id}`}
                className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0"
              >
                {tx.kind === "payment" ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-white">Payment received</p>
                      <p className="text-xs text-white/50">{formatDate(tx.timestamp)}</p>
                    </div>
                    <span className="text-sm font-semibold text-success">
                      − {formatAmount(tx.data.amount)} paid
                    </span>
                  </>
                ) : (
                  <>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">
                          {tx.data.description}
                        </p>
                        <SourceBadge source={tx.data.source} />
                      </div>
                      <p className="text-xs text-white/50">{formatDate(tx.timestamp)}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-white/90">
                      + {formatAmount(tx.data.amount)}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 p-4">
        {bharosa.status === "pending" ? (
          <div className="rounded-xl bg-white/5 px-4 py-3 text-center text-sm font-medium text-white/50">
            Waiting for merchant to accept
          </div>
        ) : (
          <PayButton
            variant="dark"
            bharosaId={bharosa.id}
            balance={balance}
            merchantName={bharosa.merchantName}
            customerName={bharosa.customerName}
          />
        )}
      </div>
    </div>
  );
}
