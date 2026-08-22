import { formatAmount } from "@/lib/format";
import type { AgeingLevel } from "@/lib/format";

interface BalanceCardProps {
  label: string;
  amount: number;
  tone?: "navy" | "green";
  ageing?: AgeingLevel;
}

const AGEING_CHIP: Record<AgeingLevel, { text: string; className: string } | null> = {
  normal: null,
  ageing: { text: "Ageing", className: "bg-bharosa-amber/15 text-bharosa-amber" },
  overdue: { text: "Overdue", className: "bg-alert/15 text-alert" },
};

export function BalanceCard({ label, amount, tone = "navy", ageing = "normal" }: BalanceCardProps) {
  const chip = AGEING_CHIP[ageing];

  return (
    <div className="relative rounded-2xl border border-border-gray bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {chip && (
        <span
          className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-semibold ${chip.className}`}
        >
          {chip.text}
        </span>
      )}
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          tone === "green" ? "text-success" : "text-paytm-navy"
        }`}
      >
        {formatAmount(amount)}
      </p>
    </div>
  );
}
