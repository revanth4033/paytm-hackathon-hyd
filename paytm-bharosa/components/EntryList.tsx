import type { Entry, EntrySource, Payment } from "@/lib/types";
import { formatAmount, formatDate } from "@/lib/format";

/**
 * How each entry got into the ledger, shown on every row. Only "scan" is
 * customer co-signed; the other two are the merchant's own claim, and the
 * distinction is the whole basis of the trust story — so it can't be a detail
 * buried out of sight.
 */
const SOURCE_BADGES: Record<EntrySource, { label: string; className: string }> = {
  digital_scan: { label: "scan", className: "bg-paytm-blue/15 text-paytm-blue-dark" },
  ocr: { label: "OCR", className: "bg-bharosa-amber/15 text-bharosa-amber" },
  manual: { label: "added by shop", className: "bg-bharosa-amber/15 text-bharosa-amber" },
};

type Transaction =
  | { kind: "entry"; timestamp: number; data: Entry }
  | { kind: "payment"; timestamp: number; data: Payment };

interface EntryListProps {
  entries: Entry[];
  payments: Payment[];
}

function EntryRow({ tx }: { tx: Transaction }) {
  if (tx.kind === "payment") {
    return (
      <div className="flex items-center justify-between border-b border-border-gray py-3 last:border-b-0">
        <div>
          <p className="text-sm font-medium text-foreground">Payment received</p>
          <p className="text-xs text-text-secondary">{formatDate(tx.timestamp)}</p>
        </div>
        <span className="text-sm font-semibold text-success">
          − {formatAmount(tx.data.amount)} paid
        </span>
      </div>
    );
  }

  const { data } = tx;
  return (
    <div className="flex items-center justify-between border-b border-border-gray py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{data.description}</p>
          <span
            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              SOURCE_BADGES[data.source].className
            }`}
          >
            {SOURCE_BADGES[data.source].label}
          </span>
        </div>
        <p className="text-xs text-text-secondary">{formatDate(tx.timestamp)}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-paytm-navy">
        + {formatAmount(data.amount)}
      </span>
    </div>
  );
}

export function EntryList({ entries, payments }: EntryListProps) {
  const transactions: Transaction[] = [
    ...entries.map((e): Transaction => ({ kind: "entry", timestamp: e.timestamp, data: e })),
    ...payments.map((p): Transaction => ({ kind: "payment", timestamp: p.timestamp, data: p })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (transactions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-text-secondary">
        No entries yet.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-border-gray bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {transactions.map((tx) => (
        <EntryRow key={`${tx.kind}-${tx.data.id}`} tx={tx} />
      ))}
    </div>
  );
}
