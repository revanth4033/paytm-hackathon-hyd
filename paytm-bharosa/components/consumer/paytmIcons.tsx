/**
 * The line-art icon set the real Paytm home screen uses — thin white strokes
 * on the dark surface, except the UPI row where they sit knocked-out white
 * inside filled blue circles.
 */

interface IconProps {
  className?: string;
}

const S = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* ---------- top bar ---------- */

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={2} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20.5 20.5 16.7 16.7" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={2} className={className}>
      <path d="M6 9a6 6 0 1 1 12 0c0 3.6 1.4 5.2 1.4 5.2H4.6S6 12.6 6 9Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

/* ---------- UPI money transfer (white on blue) ---------- */

export function ScanQrIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={1.9} className={className}>
      <path d="M4 8.5V6a2 2 0 0 1 2-2h2.5M15.5 4H18a2 2 0 0 1 2 2v2.5M20 15.5V18a2 2 0 0 1-2 2h-2.5M8.5 20H6a2 2 0 0 1-2-2v-2.5" />
      <rect x="7.5" y="7.5" width="3.6" height="3.6" rx="0.8" />
      <rect x="12.9" y="7.5" width="3.6" height="3.6" rx="0.8" />
      <rect x="7.5" y="12.9" width="3.6" height="3.6" rx="0.8" />
      <rect x="12.9" y="12.9" width="3.6" height="3.6" rx="0.8" />
    </svg>
  );
}

export function PayAnyoneIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={1.8} className={className}>
      <rect x="3.5" y="4" width="13" height="16" rx="2.5" />
      <circle cx="10" cy="10" r="2.2" />
      <path d="M6.6 16.4a3.6 3.6 0 0 1 6.8 0" />
      <path d="M20 10.5V4.8m0 0-2 2m2-2 2 2" />
    </svg>
  );
}

export function BankIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={1.8} className={className}>
      <path d="M3.5 9.5 12 4.5l8.5 5" />
      <path d="M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8" />
      <path d="M3 17.5h18M3 20h18" />
    </svg>
  );
}

export function BalanceHistoryIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={1.8} className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2.5" />
      <path d="M9 8h6M9 11.5h6M12 11.5c1.7 0 2.6 1.4 1.4 2.6L9.4 18M9 18h6" />
    </svg>
  );
}

export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={1.8} className={className}>
      <path d="M2.5 11.5 6 9l3 1.8L12 9l2 1.6M21.5 11.5 18 9l-3 1.8" />
      <path d="M6 10.6l4.4 4.4a1.5 1.5 0 0 0 2.4-1.7M9.2 13.8l2.4 2.4a1.5 1.5 0 0 0 2.4-1.7M18 10.6 13.6 15" />
    </svg>
  );
}

/* ---------- recharge & bills ---------- */

export function MobileRechargeIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M12.8 7 10.4 11h3.2L11.2 15" />
    </svg>
  );
}

export function CreditCardBillIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M5.6 9.6h4M5.6 13.4h2.4M11 13.4h2.4" />
    </svg>
  );
}

export function ElectricityIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M12 3a6 6 0 0 0-3.4 10.9c.5.4.8 1 .8 1.6v.5h5.2v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
      <path d="M10 19h4M10.6 21.2h2.8" />
      <path d="M12.9 8 11 11h2l-1.9 3" />
    </svg>
  );
}

export function FastagIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M5.6 10h3.2M5.6 13.4h5.6" />
      <path d="M14 9.4h4.2M14 12h4.2M14 14.6h4.2" />
    </svg>
  );
}

/* ---------- travel & tickets ---------- */

export function FlightIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M3 12h18" />
      <path d="M7 12 5 8.4h1.8L10 12M7 12l-2 3.6h1.8L10 12" />
      <circle cx="13.5" cy="12" r="2.6" />
      <path d="M19 9.2v5.6" />
    </svg>
  );
}

export function TrainIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="5.5" y="3" width="13" height="14.5" rx="3" />
      <path d="M5.5 10.5h13" />
      <circle cx="9.2" cy="14" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="14" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8 17.5 6 21M16 17.5 18 21" />
    </svg>
  );
}

export function BusIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="3.5" y="4" width="17" height="13.5" rx="2.5" />
      <path d="M3.5 11h17" />
      <circle cx="7.5" cy="14.4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="14.4" r="0.9" fill="currentColor" stroke="none" />
      <path d="M6.5 17.5V20M17.5 17.5V20" />
    </svg>
  );
}

export function HotelIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M4 21V5.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14 5.5V21" />
      <path d="M7 8h1.5M10.5 8H12M7 11.4h1.5M10.5 11.4H12M7 14.8h1.5M10.5 14.8H12" />
      <path d="M14 11h4.5a1.5 1.5 0 0 1 1.5 1.5V21M3 21h18" />
      <circle cx="17.8" cy="15.6" r="1.1" />
    </svg>
  );
}

export function MetroIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.4 8.6-2 4.8-4.8 2 2-4.8z" />
    </svg>
  );
}

/* ---------- gold & silver ---------- */

export function SaveGoldIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9h17M7.6 3v3M16.4 3v3" />
      <path d="M8 13.5h8M8 16.4h5" />
    </svg>
  );
}

export function GoldBarsIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M9.2 10.5h5.6l1.4 4.2H7.8z" />
      <path d="M4.4 15.2h5.4l1.4 4.3H3z" />
      <path d="M14.2 15.2h5.4L21 19.5h-8.2z" />
      <path d="M12 3v2.6M8.4 4.4l1 2M15.6 4.4l-1 2" />
    </svg>
  );
}

export function SilverIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="m4 14.4 5-4.2 5.6 4.2-5 4.2z" />
      <path d="m10.6 8.6 4.6-3.8L20 8.6l-4 3.4" />
      <path d="M18.6 15.4v2.4M17.4 16.6h2.4M6 4.6V7M4.8 5.8h2.4" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="3.5" y="8.5" width="17" height="4.2" rx="1" />
      <path d="M5.2 12.7V19a1.5 1.5 0 0 0 1.5 1.5h10.6a1.5 1.5 0 0 0 1.5-1.5v-6.3M12 8.5v12" />
      <path d="M12 8.5S10.6 3.5 8.2 3.5a2.2 2.2 0 0 0 0 5M12 8.5s1.4-5 3.8-5a2.2 2.2 0 0 1 0 5" />
    </svg>
  );
}

/* ---------- financial services ---------- */

export function LoanIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M9.4 5.6h5.2l1.2-2.2H8.2z" />
      <path d="M14.6 5.6c3 1.4 5 4.3 5 7.6A7.6 7.6 0 0 1 12 20.8a7.6 7.6 0 0 1-7.6-7.6c0-3.3 2-6.2 5-7.6" />
      <path d="M10 10.6h4M10 13h4M12.6 13c1.4 0 2 1.1 1 2l-2.6 2.2M10 17.2h4" />
    </svg>
  );
}

export function SipChartIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M4 20V13M9 20V9.5M14 20v-5M19 20V5" />
      <path d="M3 5.5 8 8l4-3.5 5 1.5" />
    </svg>
  );
}

export function CarIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M3.5 16.5v-3.2l1.8-4.4A2 2 0 0 1 7.1 7.6h9.8a2 2 0 0 1 1.8 1.3l1.8 4.4v3.2" />
      <path d="M3.5 13.3h17" />
      <circle cx="7.2" cy="16.6" r="1.6" />
      <circle cx="16.8" cy="16.6" r="1.6" />
    </svg>
  );
}

export function BikeIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <circle cx="5.2" cy="16.6" r="3.2" />
      <circle cx="18.8" cy="16.6" r="3.2" />
      <path d="M5.2 16.6 9 9.4h4.6l2.6 7.2M9 9.4H6.6M13.6 9.4l1.6-3h2.4" />
    </svg>
  );
}

export function PostpaidIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
      <path d="M8.4 8h7.2M8.4 11.4h7.2M12.6 11.4c1.5 0 2.2 1.2 1 2.2L10.4 17M8.4 17h7.2" />
    </svg>
  );
}

export function StocksIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M3 18.5h6.5M13 18.5h8" />
      <path d="M4 15.5 8.5 11l3 2.4L17 7" />
      <path d="M13.6 7H17v3.4" />
      <circle cx="10.8" cy="18.5" r="1.6" />
    </svg>
  );
}

export function CreditCardIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
      <path d="M2.5 9.6h19" />
      <path d="M5.8 14.4h3.4" />
    </svg>
  );
}

export function HealthIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M12 20.2s-8-4.6-8-9.7A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 3.1c0 5.1-8 9.7-8 9.7Z" />
      <path d="M4.6 12.6h3.6l1.4-2.4 2 4.6 1.6-2.6h6" />
    </svg>
  );
}

/* ---------- do more with paytm ---------- */

export function DealsIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M12.6 3.5H19a1.5 1.5 0 0 1 1.5 1.5v6.4a1.5 1.5 0 0 1-.44 1.06l-7.1 7.1a1.5 1.5 0 0 1-2.12 0l-6.4-6.4a1.5 1.5 0 0 1 0-2.12l7.1-7.1a1.5 1.5 0 0 1 1.06-.44Z" />
      <circle cx="16.2" cy="7.8" r="1.3" />
    </svg>
  );
}

export function VoucherIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <path d="M2.5 8.5a1.5 1.5 0 0 1 1.5-1.5h16a1.5 1.5 0 0 1 1.5 1.5v1.9a1.8 1.8 0 0 0 0 3.2v1.9a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5v-1.9a1.8 1.8 0 0 0 0-3.2z" />
      <path d="M12 7v10" strokeDasharray="1.6 2" />
    </svg>
  );
}

export function CashbackIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.5" />
      <path d="M8.2 9.4h3.2M8.2 12.2h3.2M10.4 12.2c1.2 0 1.7 1 .8 1.7l-2.2 1.8M8.2 15.7h3.2" />
      <path d="M15 9.6h2.6M15 14.4h2.6" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}

export function RupeeNoteIcon({ className }: IconProps) {
  return (
    <svg {...S} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M9.6 9.6h4.8M9.6 12h4.8M12.6 12c1.4 0 2 1.1 1 1.9l-2.4 1.9" />
    </svg>
  );
}

export function ChevronRight({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={2} className={className}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...S} strokeWidth={2} className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
