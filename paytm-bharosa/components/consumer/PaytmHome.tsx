"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  BalanceHistoryIcon,
  BankIcon,
  BellIcon,
  BikeIcon,
  BusIcon,
  CarIcon,
  CashbackIcon,
  ChevronRight,
  CreditCardBillIcon,
  CreditCardIcon,
  DealsIcon,
  ElectricityIcon,
  FastagIcon,
  FlightIcon,
  GiftIcon,
  GoldBarsIcon,
  GridIcon,
  HandshakeIcon,
  HealthIcon,
  HotelIcon,
  LoanIcon,
  MetroIcon,
  MobileRechargeIcon,
  PayAnyoneIcon,
  PostpaidIcon,
  RupeeNoteIcon,
  SaveGoldIcon,
  ScanQrIcon,
  SearchIcon,
  SilverIcon,
  SipChartIcon,
  StocksIcon,
  TrainIcon,
  VoucherIcon,
} from "@/components/consumer/paytmIcons";

/**
 * The Paytm home screen, rebuilt to match the live app: the UPI row, the
 * Recharge & Bills tray, the offer banners and chip rails, and the Travel /
 * Gold / Financial Services / Free Tools / Do More / Promoted stack, under a
 * floating Scan QR pill and the bottom nav.
 *
 * Everything here is decorative except the two live entry points — Scan any QR
 * (and the floating pill) and Bharosa. Bharosa rides in the UPI row as a second
 * tile, which is why that row scrolls where the real app's four tiles don't:
 * the feature has to look like it already shipped inside Paytm, not like a
 * separate surface bolted beside it.
 */

interface PaytmHomeProps {
  onScan: () => void;
  onBharosa: () => void;
  /** The split screen labels each phone; the standalone route doesn't. */
  badge?: ReactNode;
}

const RECHARGE = [
  { label: "Mobile\nRecharge", icon: <MobileRechargeIcon /> },
  { label: "Credit Card\nBill", icon: <CreditCardBillIcon /> },
  { label: "Electricity\nBill", icon: <ElectricityIcon /> },
  { label: "FASTag\nRecharge", icon: <FastagIcon /> },
];

const TRAVEL = [
  { label: "Flight", icon: <FlightIcon /> },
  { label: "Train", icon: <TrainIcon /> },
  { label: "Bus", icon: <BusIcon /> },
  { label: "Hotels", icon: <HotelIcon /> },
];

const GOLD = [
  { label: "Save Gold\nDaily", icon: <SaveGoldIcon /> },
  { label: "Buy Gold", icon: <GoldBarsIcon /> },
  { label: "Buy Silver", icon: <SilverIcon /> },
  { label: "Refer & Earn\nGold", icon: <GiftIcon /> },
];

const FINANCIAL = [
  { label: "Loan", icon: <LoanIcon /> },
  { label: "₹21 रोज SIP", icon: <SipChartIcon /> },
  { label: "Car\nInsurance", icon: <CarIcon /> },
  { label: "Bike\nInsurance", icon: <BikeIcon /> },
  { label: "Paytm\nPostpaid", icon: <PostpaidIcon /> },
  { label: "Stocks", icon: <StocksIcon /> },
  { label: "Get Credit\nCard", icon: <CreditCardIcon /> },
  { label: "Health\nInsurance", icon: <HealthIcon /> },
];

const DO_MORE = [
  { label: "Free Deals &\nOffers", icon: <DealsIcon /> },
  { label: "Gift\nVouchers", icon: <VoucherIcon /> },
  { label: "Cashback\n& Offers", icon: <CashbackIcon /> },
  { label: "See All\nServices", icon: <GridIcon /> },
];

const PROMOTED = [
  { label: "Term Plan\n₹595/month", mark: "A", markClass: "bg-white text-[#9b1b46] text-[22px]" },
  { label: "14% Fixed\nReturns", mark: "GRiP", markClass: "bg-[#1447d6] text-white text-[13px] tracking-tight" },
  { label: "RuPay Credit\nCard", mark: "HSBC", markClass: "bg-white text-[#db0011] text-[10px] tracking-tighter" },
  { label: "Unlimited Data", mark: "a", markClass: "bg-[#e40000] text-white text-[22px]" },
];

/** Two lines of label, centred, exactly as the app wraps them. */
function TileLabel({ label }: { label: string }) {
  return (
    <span className="whitespace-pre-line text-center text-[12.5px] leading-[1.25] text-white/95">
      {label}
    </span>
  );
}

function LineTile({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex w-[82px] shrink-0 flex-col items-center gap-2">
      <span className="text-white/90 [&>svg]:h-[26px] [&>svg]:w-[26px]">{icon}</span>
      <TileLabel label={label} />
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[20px] bg-[#1c1c1e] p-4 ${className}`}>{children}</div>;
}

function CardHeading({ title, viewAll }: { title: string; viewAll?: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-[19px] font-bold text-white">{title}</h3>
      {viewAll && (
        <span className="flex items-center gap-1.5 text-[15px] font-medium text-[#3d9cf5]">
          View All <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

function Chip({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full bg-[#232326] px-4 py-2.5">
      <span className="text-white/85 [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
      <span className="whitespace-nowrap text-[13.5px] font-medium text-white/95">{label}</span>
    </div>
  );
}

export function PaytmHome({ onScan, onBharosa, badge }: PaytmHomeProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-black text-white">
      {/* Top bar — pinned, matching the app's sticky header */}
      <div className="z-20 flex shrink-0 items-center gap-3 bg-black px-4 pb-3 pt-1">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#f7c8dc] text-[15px] font-bold text-[#8a2b52]">
          BR
        </div>
        <p className="flex-1 text-[14.5px] leading-[1.3] text-white">
          Up to <span className="font-bold">5% GOLD</span> on
          <br />
          everyday spends
          <span className="ml-1 inline-flex h-[15px] w-[15px] translate-y-[2px] items-center justify-center rounded-full bg-[#ff6a1f]">
            <ChevronRight className="h-2.5 w-2.5 text-white" />
          </span>
        </p>
        {badge}
        <SearchIcon className="h-[22px] w-[22px] shrink-0 text-white" />
        <BellIcon className="h-[22px] w-[22px] shrink-0 text-white" />
      </div>

      <div className="flex-1 overflow-y-auto pb-32 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ---- UPI Money Transfer ---- */}
        <div className="px-4 pt-2">
          <h2 className="mb-5 text-[24px] font-bold tracking-tight text-white">
            UPI Money Transfer
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={onScan}
              className="flex w-[74px] shrink-0 flex-col items-center gap-2.5"
            >
              <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#1476d1] text-white">
                <ScanQrIcon className="h-[30px] w-[30px]" />
              </span>
              <TileLabel label={"Scan any\nQR"} />
            </button>

            <button
              type="button"
              onClick={onBharosa}
              className="flex w-[74px] shrink-0 flex-col items-center gap-2.5"
            >
              <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#1476d1] text-white">
                <HandshakeIcon className="h-[30px] w-[30px]" />
                <span className="absolute -right-1 -top-0.5 rounded-full bg-[#ff6a1f] px-1.5 py-[1px] text-[9px] font-bold text-white">
                  NEW
                </span>
              </span>
              <TileLabel label="Bharosa" />
            </button>

            {[
              { label: "Pay\nAnyone", icon: <PayAnyoneIcon className="h-[30px] w-[30px]" /> },
              { label: "To Bank &\nSelf A/c", icon: <BankIcon className="h-[30px] w-[30px]" /> },
              { label: "Balance &\nHistory", icon: <BalanceHistoryIcon className="h-[30px] w-[30px]" /> },
            ].map((tile) => (
              <div key={tile.label} className="flex w-[74px] shrink-0 flex-col items-center gap-2.5">
                <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#1476d1] text-white">
                  {tile.icon}
                </span>
                <TileLabel label={tile.label} />
              </div>
            ))}
          </div>
        </div>

        {/* ---- Recharge & Bills ---- */}
        <div className="px-4 pt-6">
          <Card className="pb-3">
            <CardHeading title="Recharge & Bills" viewAll />
            <div className="flex justify-between">
              {RECHARGE.map((item) => (
                <LineTile key={item.label} {...item} />
              ))}
            </div>
            <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-white/25" />
          </Card>
        </div>

        {/* ---- Exclusive offer banner ---- */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-[18px] bg-gradient-to-r from-[#1d3b2a] via-[#1c3327] to-[#14211a] px-4 py-3.5">
            <span className="text-[34px] leading-none">🎁</span>
            <div className="flex-1">
              <p className="text-[17px] font-bold text-white">Exclusive offer for You!</p>
              <p className="mt-0.5 text-[13.5px] text-white/70">Claim your cashback now</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/60" />
          </div>
        </div>

        {/* ---- chip rail ---- */}
        <div className="flex gap-2.5 overflow-x-auto px-4 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip label="Refer & Win" icon={<GiftIcon />} />
          <Chip label="Cashback & Offers" icon={<CashbackIcon />} />
          <Chip label="UPI Lite" icon={<RupeeNoteIcon />} />
        </div>

        {/* ---- gold flights ad ---- */}
        <div className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#f4d38a] via-[#f0c874] to-[#e8b95c] px-4 py-4">
            <span className="inline-block rounded-[4px] bg-[#e5343d] px-2 py-[3px] text-[10px] font-bold tracking-wide text-white">
              LIMITED TIME OFFER
            </span>
            <p className="mt-2 text-[21px] font-bold leading-tight text-[#c1440e]">
              Get Gold* worth ₹1500
            </p>
            <p className="text-[16px] font-semibold text-[#2b2417]">on International Flights</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full bg-[#0b3d91] px-4 py-2 text-[14px] font-semibold text-white">
                Book Now <ArrowRight className="h-4 w-4" />
              </span>
              <span className="text-[11.5px] font-medium leading-tight text-[#2b2417]">
                Promo:
                <br />
                INTGOLD
              </span>
            </div>
            <span className="pointer-events-none absolute right-3 top-4 text-[40px] opacity-90">
              ✈️
            </span>
            <span className="pointer-events-none absolute bottom-3 right-4 text-[30px] opacity-80">
              🗼
            </span>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/45"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---- Travel & Tickets ---- */}
        <div className="px-4 pt-5">
          <Card>
            <CardHeading title="Travel & Tickets" />
            <div className="flex justify-between">
              {TRAVEL.map((item) => (
                <LineTile key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-4 flex gap-2.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip label="Book Flights, Get Gold*" icon={<FlightIcon />} />
              <Chip label="Hyderabad Metro" icon={<MetroIcon />} />
            </div>
          </Card>
        </div>

        {/* ---- Gold & Silver ---- */}
        <div className="px-4 pt-5">
          <Card>
            <CardHeading title="Gold & Silver" />
            <div className="flex justify-between">
              {GOLD.map((item) => (
                <LineTile key={item.label} {...item} />
              ))}
            </div>
          </Card>
        </div>

        {/* ---- Financial Services ---- */}
        <div className="px-4 pt-5">
          <Card>
            <CardHeading title="Financial Services" viewAll />
            <div className="grid grid-cols-4 gap-y-6">
              {FINANCIAL.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <span className="text-white/90 [&>svg]:h-[26px] [&>svg]:w-[26px]">
                    {item.icon}
                  </span>
                  <TileLabel label={item.label} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ---- Free Tools ---- */}
        <div className="px-4 pt-5">
          <Card>
            <CardHeading title="Free Tools" />
            <div className="flex gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex h-[172px] w-[116px] shrink-0 flex-col rounded-[14px] bg-[#153029] p-3">
                <p className="text-[14px] font-semibold leading-tight text-white">
                  Check Your
                  <br />
                  Credit Score
                </p>
                <div className="relative mt-auto flex items-end justify-center">
                  <svg width="92" height="56" viewBox="0 0 92 56" fill="none">
                    <path
                      d="M8 52a38 38 0 0 1 76 0"
                      stroke="url(#score)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="score" x1="8" y1="52" x2="84" y2="52">
                        <stop stopColor="#e5343d" />
                        <stop offset="0.5" stopColor="#f5a623" />
                        <stop offset="1" stopColor="#21c17a" />
                      </linearGradient>
                    </defs>
                    <path d="M46 50 62 30" stroke="#cfe8dd" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="absolute -top-1 right-0 rounded-[5px] bg-[#21c17a]/25 px-1.5 py-0.5 text-[11px] font-bold text-[#7ee6b6]">
                    820
                  </span>
                </div>
              </div>

              <div className="flex h-[172px] w-[116px] shrink-0 flex-col rounded-[14px] bg-[#33301a] p-3">
                <p className="text-[14px] font-semibold leading-tight text-white">
                  Set Gold
                  <br />
                  Price Alerts
                </p>
                <div className="mt-auto flex items-end justify-center gap-1">
                  <span className="text-[22px] text-[#e5343d]">↓</span>
                  <span className="text-[22px] text-[#21c17a]">↑</span>
                </div>
                <span className="mt-1 text-center text-[30px] leading-none">🪙</span>
              </div>

              <div className="flex h-[172px] w-[116px] shrink-0 flex-col rounded-[14px] bg-[#3a1f28] p-3">
                <p className="text-[14px] font-semibold leading-tight text-white">
                  Track Your
                  <br />
                  Spends
                </p>
                <div className="mt-auto flex flex-col gap-1">
                  {[
                    ["🚕", "₹4600", false],
                    ["🍔", "₹10,200", true],
                    ["🛍️", "₹9569", false],
                    ["✈️", "₹5628", false],
                  ].map(([emoji, amount, highlight]) => (
                    <div
                      key={amount as string}
                      className={`flex items-center gap-1.5 rounded-[6px] px-1.5 py-[3px] ${
                        highlight ? "bg-[#f0a6b4]" : "bg-[#e8c3cc]"
                      }`}
                    >
                      <span className="text-[9px]">{emoji as string}</span>
                      <span className="ml-auto text-[9.5px] font-semibold text-[#5c2733]">
                        {amount as string}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[172px] w-[116px] shrink-0 rounded-[14px] bg-[#153029] p-3">
                <p className="text-[14px] font-semibold leading-tight text-white">
                  Instant
                  <br />
                  Statements
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ---- Do More with Paytm ---- */}
        <div className="px-4 pt-5">
          <Card>
            <CardHeading title="Do More with Paytm" />
            <div className="flex justify-between">
              {DO_MORE.map((item) => (
                <LineTile key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-4 flex gap-2.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip label="Google Play | 5% Off" icon={<VoucherIcon />} />
              <Chip label="Deals Near You | 50% Off" icon={<DealsIcon />} />
            </div>
          </Card>
        </div>

        {/* ---- Promoted ---- */}
        <div className="px-4 pt-5">
          <Card>
            <CardHeading title="Promoted" />
            <div className="flex justify-between">
              {PROMOTED.map((item) => (
                <div key={item.label} className="flex w-[82px] flex-col items-center gap-2">
                  <span
                    className={`flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-[10px] font-bold ${item.markClass}`}
                  >
                    {item.mark}
                  </span>
                  <TileLabel label={item.label} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ---- floating Scan QR + bottom nav ---- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
        <div className="pointer-events-auto flex justify-center pb-1">
          <button
            type="button"
            onClick={onScan}
            className="flex items-center gap-2.5 rounded-full border border-[#4da3ff] bg-gradient-to-b from-[#1a7fe0] to-[#0b5cc0] px-7 py-3 text-[19px] font-semibold text-white shadow-[0_0_22px_rgba(29,124,224,0.55)]"
          >
            <ScanQrIcon className="h-[22px] w-[22px]" />
            Scan QR
          </button>
        </div>
        <div className="pointer-events-auto flex items-end justify-around bg-black/95 px-3 pb-6 pt-1 backdrop-blur">
          {[
            { label: "Home", icon: <GridIcon /> },
            { label: "Rewards", icon: <GiftIcon /> },
            { label: "Balance", icon: <RupeeNoteIcon /> },
            { label: "History", icon: <BalanceHistoryIcon /> },
          ].map((item, i) => (
            <div key={item.label} className="flex w-16 flex-col items-center gap-1">
              <span
                className={`[&>svg]:h-[21px] [&>svg]:w-[21px] ${
                  i === 0 ? "text-[#3d9cf5]" : "text-white/55"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10.5px] ${i === 0 ? "font-semibold text-[#3d9cf5]" : "text-white/55"}`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
