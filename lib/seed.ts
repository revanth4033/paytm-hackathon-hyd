import type { Bharosa, Entry, Payment } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(n: number): number {
  return Date.now() - n * DAY_MS;
}

/**
 * All scannable merchants in the demo. m1 carries the seeded ledger history;
 * the rest exist purely as "other shops" a consumer can discover and open a
 * Bharosa with, so the consumer-side flows can prove out a many-shops
 * scenario. MERCHANT_ID/MERCHANT_NAME stay pointed at m1 for backward
 * compatibility with every merchant-side screen, which still assumes a
 * single logged-in merchant (matches how a real merchant app only sees its
 * own shop, not every shop in Paytm).
 */
export const MERCHANTS = [
  { id: "m1", name: "Sri Balaji Kirana Store" },
  { id: "m2", name: "Anand Medical & Pharmacy" },
  { id: "m3", name: "Lakshmi Fashion Boutique" },
  { id: "m4", name: "Sri Ram Electronics" },
] as const;

export const MERCHANT_ID = MERCHANTS[0].id;
export const MERCHANT_NAME = MERCHANTS[0].name;

export function getMerchantById(id: string) {
  return MERCHANTS.find((m) => m.id === id);
}

export const seedBharosas: Bharosa[] = [
  {
    id: "b1",
    merchantId: MERCHANT_ID,
    merchantName: MERCHANT_NAME,
    customerId: "c1",
    customerName: "Ramesh Kumar",
    customerLang: "hi",
    status: "active",
    createdAt: daysAgo(30),
  },
  {
    id: "b2",
    merchantId: MERCHANT_ID,
    merchantName: MERCHANT_NAME,
    customerId: "c2",
    customerName: "Lakshmi Devi",
    customerLang: "te",
    status: "active",
    createdAt: daysAgo(24),
  },
  {
    id: "b3",
    merchantId: MERCHANT_ID,
    merchantName: MERCHANT_NAME,
    customerId: "c3",
    customerName: "Suresh Reddy",
    customerLang: "te",
    status: "active",
    createdAt: daysAgo(22),
  },
  {
    id: "b4",
    merchantId: MERCHANT_ID,
    merchantName: MERCHANT_NAME,
    customerId: "c4",
    customerName: "Anita Sharma",
    customerLang: "en",
    status: "active",
    createdAt: daysAgo(3),
  },
];

export const seedEntries: Entry[] = [
  // Ramesh Kumar (b1) — overdue, largest balance, paper history + recent digital
  {
    id: "e1",
    bharosaId: "b1",
    amount: 24000,
    description: "Paper book balance (Mar–May)",
    timestamp: daysAgo(30),
    source: "ocr",
    confirmed: false,
  },
  {
    id: "e2",
    bharosaId: "b1",
    amount: 1250,
    description: "Rice 25kg",
    timestamp: daysAgo(26),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e3",
    bharosaId: "b1",
    amount: 780,
    description: "Cooking oil 5L",
    timestamp: daysAgo(21),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e4",
    bharosaId: "b1",
    amount: 380,
    description: "Atta 10kg",
    timestamp: daysAgo(17),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e5",
    bharosaId: "b1",
    amount: 650,
    description: "Ghee 1kg",
    timestamp: daysAgo(12),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e6",
    bharosaId: "b1",
    amount: 92,
    description: "Sugar 2kg",
    timestamp: daysAgo(8),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e7",
    bharosaId: "b1",
    amount: 130,
    description: "Tea powder 250g",
    timestamp: daysAgo(3),
    source: "digital_scan",
    confirmed: true,
  },

  // Lakshmi Devi (b2) — recent activity, moderate balance
  {
    id: "e8",
    bharosaId: "b2",
    amount: 6500,
    description: "Paper book balance",
    timestamp: daysAgo(24),
    source: "ocr",
    confirmed: false,
  },
  {
    id: "e9",
    bharosaId: "b2",
    amount: 260,
    description: "Rice 5kg",
    timestamp: daysAgo(18),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e10",
    bharosaId: "b2",
    amount: 155,
    description: "Cooking oil 1L",
    timestamp: daysAgo(14),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e11",
    bharosaId: "b2",
    amount: 145,
    description: "Toor dal 1kg",
    timestamp: daysAgo(9),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e12",
    bharosaId: "b2",
    amount: 380,
    description: "Ghee 500g",
    timestamp: daysAgo(6),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e13",
    bharosaId: "b2",
    amount: 210,
    description: "Soap & shampoo pack",
    timestamp: daysAgo(2),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e14",
    bharosaId: "b2",
    amount: 40,
    description: "Biscuits",
    timestamp: daysAgo(1),
    source: "digital_scan",
    confirmed: true,
  },

  // Suresh Reddy (b3) — partially paid
  {
    id: "e15",
    bharosaId: "b3",
    amount: 4800,
    description: "Paper book balance",
    timestamp: daysAgo(22),
    source: "ocr",
    confirmed: false,
  },
  {
    id: "e16",
    bharosaId: "b3",
    amount: 380,
    description: "Atta 10kg",
    timestamp: daysAgo(19),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e17",
    bharosaId: "b3",
    amount: 155,
    description: "Cooking oil 1L",
    timestamp: daysAgo(15),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e18",
    bharosaId: "b3",
    amount: 260,
    description: "Rice 5kg",
    timestamp: daysAgo(11),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e19",
    bharosaId: "b3",
    amount: 92,
    description: "Sugar 2kg",
    timestamp: daysAgo(7),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e20",
    bharosaId: "b3",
    amount: 42,
    description: "Biscuits",
    timestamp: daysAgo(4),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e21",
    bharosaId: "b3",
    amount: 128,
    description: "Tea powder 250g",
    timestamp: daysAgo(2),
    source: "digital_scan",
    confirmed: true,
  },

  // Anita Sharma (b4) — fresh, just started, no paper history
  {
    id: "e22",
    bharosaId: "b4",
    amount: 260,
    description: "Rice 5kg",
    timestamp: daysAgo(3),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e23",
    bharosaId: "b4",
    amount: 155,
    description: "Cooking oil 1L",
    timestamp: daysAgo(2),
    source: "digital_scan",
    confirmed: true,
  },
  {
    id: "e24",
    bharosaId: "b4",
    amount: 40,
    description: "Biscuits",
    timestamp: daysAgo(1),
    source: "digital_scan",
    confirmed: true,
  },
];

export const seedPayments: Payment[] = [
  {
    id: "p1",
    bharosaId: "b3",
    amount: 1500,
    timestamp: daysAgo(6),
    upiReference: "MOCK-UPI-7734",
  },
];
