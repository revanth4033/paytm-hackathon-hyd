import Link from "next/link";
import { Avatar } from "./Avatar";
import { ageingColorClass, formatAmount, type AgeingLevel } from "@/lib/format";

interface MerchantRowProps {
  href: string;
  name: string;
  balance: number;
  ageing: AgeingLevel;
}

export function MerchantRow({ href, name, balance, ageing }: MerchantRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border-gray bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
    >
      <Avatar name={name} />
      <span className="flex-1 truncate text-[15px] font-semibold text-foreground">
        {name}
      </span>
      <span className={`text-base font-bold ${ageingColorClass(ageing)}`}>
        {formatAmount(balance)}
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
