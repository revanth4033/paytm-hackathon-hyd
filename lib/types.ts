export type Role = "merchant" | "customer";
export type Lang = "hi" | "te" | "en";
/** `digital_scan` is the customer scanning and co-signing the entry — the only
 *  kind the lending story can trust. `ocr` is read off the paper book and
 *  `manual` is typed in by the merchant: both are the merchant's claim alone,
 *  so they carry `confirmed: false` and the customer is notified to review. */
export type EntrySource = "digital_scan" | "ocr" | "manual";
export type BharosaStatus = "pending" | "active" | "closed";

export interface Bharosa {
  id: string;
  merchantId: string;
  merchantName: string;
  customerId: string;
  customerName: string;
  customerLang: Lang; // drives voice reminder language
  status: BharosaStatus;
  createdAt: number;
}

export interface Entry {
  id: string;
  bharosaId: string;
  amount: number;
  description: string;
  timestamp: number;
  source: EntrySource;
  confirmed: boolean; // true = customer scanned; false = OCR (notified only)
}

export interface Payment {
  id: string;
  bharosaId: string;
  amount: number;
  timestamp: number;
  upiReference: string; // mocked, e.g. "MOCK-UPI-8842"
}
