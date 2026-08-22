import type { EntrySource } from "@/lib/types";

/**
 * Dark-theme counterpart of the badge in EntryList, for the customer's own
 * view of the ledger. The customer especially needs to see which entries they
 * co-signed by scanning and which the shop added on its own — that is the
 * line they would dispute.
 */
const BADGES: Record<EntrySource, { label: string; className: string } | null> = {
  // A scan is the customer's own action; labelling it adds nothing here.
  digital_scan: null,
  ocr: { label: "from paper book", className: "bg-bharosa-amber/20 text-bharosa-amber" },
  manual: { label: "added by shop", className: "bg-bharosa-amber/20 text-bharosa-amber" },
};

export function SourceBadge({ source }: { source: EntrySource }) {
  const badge = BADGES[source];
  if (!badge) return null;

  return (
    <span
      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}
