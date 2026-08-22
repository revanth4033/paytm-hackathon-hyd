"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { BackArrowIcon, ChevronRightIcon, HandshakeIcon } from "@/components/consumer/icons";
import { NotificationBar } from "@/components/NotificationBar";
import { PaytmHome } from "@/components/consumer/PaytmHome";
import { PayButton } from "@/components/PayButton";
import { SourceBadge } from "@/components/consumer/SourceBadge";
import { ScannerScreen } from "@/components/consumer/ScannerScreen";
import { PayScreen } from "@/components/consumer/PayScreen";
import { useBharosa } from "@/context/BharosaContext";
import { MERCHANT_ID, MERCHANT_NAME } from "@/lib/seed";
import { formatAmount, formatDate } from "@/lib/format";
import type { Entry, Payment } from "@/lib/types";

type Transaction =
  | { kind: "entry"; timestamp: number; data: Entry }
  | { kind: "payment"; timestamp: number; data: Payment };

type Screen = "home" | "bharosaList" | "bharosaDetail" | "scan" | "pay";

function ConsumerBadge() {
  return (
    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
      Consumer
    </span>
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div
      className="flex h-14 shrink-0 items-center gap-2 px-4"
      style={{ background: "linear-gradient(135deg, #002970 0%, #00BAF2 100%)" }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
        >
          <BackArrowIcon />
        </button>
      )}
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <span className="ml-auto">
        <ConsumerBadge />
      </span>
    </div>
  );
}

function TransactionList({ bharosaId }: { bharosaId: string }) {
  const { getEntries, getPayments } = useBharosa();
  const transactions: Transaction[] = [
    ...getEntries(bharosaId).map((e): Transaction => ({ kind: "entry", timestamp: e.timestamp, data: e })),
    ...getPayments(bharosaId).map((p): Transaction => ({ kind: "payment", timestamp: p.timestamp, data: p })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
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
  );
}

/**
 * The consumer phone in the side-by-side view — dark themed to match
 * /consumer/*, but driven by local screen state instead of the router so it
 * can sit beside MerchantPanel sharing one live BharosaContext. That shared
 * context is the point: a Bharosa requested on this side lands as a pending
 * request on the merchant side immediately, with no page reload to wipe it.
 *
 * Scan and pay render the very same components as the standalone
 * /consumer/scan and /consumer/pay routes, so the two cannot drift apart.
 */
export function ConsumerPanel() {
  const { consumerId, getAllBharosaForCustomer, getBalance } = useBharosa();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  const myBharosas = getAllBharosaForCustomer(consumerId);
  const selectedBharosa = myBharosas.find((b) => b.merchantId === selectedMerchantId);

  function goHome() {
    setScreen("home");
    setSelectedMerchantId(null);
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0c0c0c] text-white">
      <NotificationBar audience="consumer" />
      {screen === "home" && (
        <PaytmHome
          badge={<ConsumerBadge />}
          onScan={() => setScreen("scan")}
          onBharosa={() => setScreen("bharosaList")}
        />
      )}



      {screen === "scan" && (
        <ScannerScreen
          merchantName={MERCHANT_NAME}
          badge={<ConsumerBadge />}
          onBack={goHome}
          onScanned={() => {
            setSelectedMerchantId(MERCHANT_ID);
            setScreen("pay");
          }}
        />
      )}

      {screen === "pay" && selectedMerchantId && (
        <PayScreen
          merchantId={selectedMerchantId}
          merchantName={MERCHANT_NAME}
          badge={<ConsumerBadge />}
          onBack={() => setScreen("scan")}
          onDone={(destination) =>
            destination === "bharosa" ? setScreen("bharosaDetail") : goHome()
          }
        />
      )}

      {screen === "bharosaList" && (
        <>
          <Header title="Bharosa" onBack={goHome} />
          {myBharosas.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-bharosa-amber">
                <HandshakeIcon className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-white">No Bharosas yet</p>
              <p className="text-sm text-white/50">
                Scan a store&apos;s QR code to open your first Bharosa
              </p>
              <button
                type="button"
                onClick={() => setScreen("scan")}
                className="mt-2 rounded-xl bg-[#00BAF2] px-5 py-3 text-sm font-semibold text-white"
              >
                Scan QR
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {myBharosas.map((bharosa) => (
                <button
                  key={bharosa.id}
                  type="button"
                  onClick={() => {
                    setSelectedMerchantId(bharosa.merchantId);
                    setScreen("bharosaDetail");
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-[#1a1a1a] p-4 text-left"
                >
                  <Avatar name={bharosa.merchantName} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-white">
                      {bharosa.merchantName}
                    </p>
                  </div>
                  {bharosa.status === "pending" ? (
                    <span className="rounded-full bg-bharosa-amber/20 px-2.5 py-1 text-xs font-semibold text-bharosa-amber">
                      Pending
                    </span>
                  ) : (
                    <span className="text-base font-bold text-white">
                      {formatAmount(getBalance(bharosa.id))}
                    </span>
                  )}
                  <ChevronRightIcon className="text-white/40" />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {screen === "bharosaDetail" && selectedBharosa && (
        <>
          <Header title={selectedBharosa.merchantName} onBack={() => setScreen("bharosaList")} />
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedBharosa.merchantName} size={48} />
              <p className="text-base font-semibold text-white">{selectedBharosa.merchantName}</p>
            </div>

            {selectedBharosa.status === "pending" ? (
              <div className="rounded-2xl bg-bharosa-amber/10 p-4 text-center">
                <p className="text-sm font-semibold text-bharosa-amber">Pending</p>
                <p className="mt-1 text-sm text-white/70">
                  Waiting for {selectedBharosa.merchantName} to accept your Bharosa request.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl bg-[#1a1a1a] p-4">
                  <p className="text-xs font-medium text-white/50">
                    {getBalance(selectedBharosa.id) > 0 ? "You owe" : "Cleared"}
                  </p>
                  <p
                    className={`mt-1 text-3xl font-bold ${
                      getBalance(selectedBharosa.id) > 0 ? "text-white" : "text-success"
                    }`}
                  >
                    {formatAmount(getBalance(selectedBharosa.id))}
                  </p>
                </div>
                <PayButton
                  variant="dark"
                  bharosaId={selectedBharosa.id}
                  balance={getBalance(selectedBharosa.id)}
                  merchantName={selectedBharosa.merchantName}
                  customerName={selectedBharosa.customerName}
                />
                <TransactionList bharosaId={selectedBharosa.id} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
