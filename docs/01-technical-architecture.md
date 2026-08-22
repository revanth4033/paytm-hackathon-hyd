# Paytm Bharosa — Technical Architecture

**Document 1 of 5** · Companion to the PRD
**Stack:** Next.js (React) · Local state · Mocked payment · Real AI touchpoints for demo wow-moments
**Team:** 2 people

---

## 1. Purpose of This Document

This tells any AI coding tool exactly how the demo is structured — so it builds *your* architecture instead of inventing its own. Read alongside the PRD: the PRD says *what* and *why*; this says *how it's wired*.

**Scope reminder:** This is a hackathon demo, not production. The goal is a convincing, clickable web app that shows the idea end-to-end. We build real UI + real AI wow-moments, and mock everything that would need Paytm's actual backend (payments, persistence, lending).

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js (App Router)** | Fast to build, single deploy, API routes for AI calls |
| Language | **TypeScript** | Types double as documentation for the AI coding tool |
| Styling | **Tailwind CSS** | Fast; lets us match Paytm's look precisely |
| State | **React Context + useState** | No backend needed; one shared store for the whole demo |
| Persistence | **None (in-memory)** | Resets on refresh — fine for a demo. Seed with dummy data on load |
| Payment | **Mocked** | Fake button → success animation. No real UPI |
| AI calls | **Next.js API routes** → Sarvam / LLM | Keeps API keys server-side, never in the browser |

**Why Context over a database:** The demo toggles between merchant and customer views on one phone. Both views must read/write the *same* ledger in real time. A single React Context holds all bharosas, entries, and payments — when the customer adds an entry, the merchant view updates instantly, with zero backend. That "both sides update live" moment is part of the demo.

---

## 3. Folder Structure

```
. (repo root)
├── app/
│   ├── layout.tsx                  # Root layout — wraps app in BharosaProvider
│   ├── page.tsx                    # Landing / role toggle (Merchant ⇄ Customer)
│   ├── merchant/
│   │   ├── page.tsx                # Merchant: list of customers + balances
│   │   └── [customerId]/
│   │       └── page.tsx            # Merchant: one customer's entries + Send Reminder
│   ├── customer/
│   │   ├── page.tsx                # Customer: list of merchants + balances
│   │   └── [merchantId]/
│   │       └── page.tsx            # Customer: one merchant's entries + Pay
│   ├── setup/
│   │   └── page.tsx                # Bharosa setup flow (QR scan → mutual accept)
│   ├── ocr/
│   │   └── page.tsx                # OCR scan screen (photo → extracted entries)
│   ├── chat/
│   │   └── page.tsx                # Merchant chatbot query screen
│   └── api/
│       ├── ocr/route.ts            # POST image → extracted entries (LLM vision)
│       ├── tts/route.ts            # POST text+lang → audio (Sarvam TTS)
│       ├── reminder/route.ts       # POST balance+name → polite reminder text
│       └── chat/route.ts           # POST question+ledger → natural-language answer
│
├── context/
│   └── BharosaContext.tsx          # Single shared store (all state + actions)
│
├── lib/
│   ├── types.ts                    # Bharosa, Entry, Payment types
│   ├── seed.ts                     # Dummy data to make the demo look alive
│   └── ai/
│       ├── sarvam.ts               # Sarvam TTS client wrapper
│       └── llm.ts                  # LLM client (OCR, chat, reminder text)
│
├── components/
│   ├── RoleToggle.tsx              # Switch between Merchant / Customer view
│   ├── PaytmHeader.tsx             # Paytm-styled top bar
│   ├── BalanceCard.tsx             # Reusable balance display card
│   ├── EntryList.tsx               # List of ledger entries
│   ├── CustomerRow.tsx             # One customer in merchant's list
│   ├── MerchantRow.tsx             # One merchant in customer's list
│   ├── PayButton.tsx               # Mocked payment → success state
│   ├── ReminderButton.tsx          # Triggers reminder text + voice
│   ├── QRMock.tsx                  # Fake QR scan for setup/transaction
│   └── VoicePlayer.tsx             # Plays the Sarvam audio
│
└── (config: tailwind.config.ts, tsconfig.json, .env.local)
```

---

## 4. Data Model (in code)

`lib/types.ts` — the contract the whole app builds on:

```typescript
export type Role = "merchant" | "customer";
export type Lang = "hi" | "te" | "en";
export type EntrySource = "digital_scan" | "ocr";
export type BharosaStatus = "active" | "closed";

export interface Bharosa {
  id: string;
  merchantId: string;
  merchantName: string;
  customerId: string;
  customerName: string;
  customerLang: Lang;         // drives voice reminder language
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
  confirmed: boolean;         // true = customer scanned; false = OCR (notified only)
}

export interface Payment {
  id: string;
  bharosaId: string;
  amount: number;
  timestamp: number;
  upiReference: string;       // mocked, e.g. "MOCK-UPI-8842"
}
```

**Running balance** for a bharosa:
```
balance = sum(entries where bharosaId matches) − sum(payments where bharosaId matches)
```
Computed on the fly from context — never stored, so it can never drift out of sync.

---

## 5. The Shared Store (BharosaContext)

One context holds everything. Both merchant and customer views consume it.

**State it holds:**
- `bharosas: Bharosa[]`
- `entries: Entry[]`
- `payments: Payment[]`
- `currentRole: Role`
- `currentUserId: string`

**Actions it exposes:**
- `openBharosa(merchantId, customerId)` — creates a bharosa (setup flow)
- `addEntry(bharosaId, amount, description, source)` — records a credit
- `addPayment(bharosaId, amount)` — records a mocked payment, returns a fake UPI ref
- `getBalance(bharosaId)` — computes running balance on the fly
- `getBharosaForMerchant(merchantId)` / `getBharosaForCustomer(customerId)`
- `getEntries(bharosaId)` — entries for one relationship
- `switchRole(role)` — flips the toggle

**Why this matters for the demo:** because both views share one store, "customer adds an entry → merchant sees it instantly" is automatic. No syncing code, no backend round-trip.

---

## 6. Screen Wiring

| Route | View | Reads | Writes |
|-------|------|-------|--------|
| `/` | Role toggle + entry point | — | `switchRole` |
| `/setup` | QR scan → mutual accept | — | `openBharosa` |
| `/merchant` | Customer list + balances | `getBharosaForMerchant`, `getBalance` | — |
| `/merchant/[customerId]` | One customer's ledger | `getEntries`, `getBalance` | `addEntry`, reminder APIs |
| `/customer` | Merchant list + balances | `getBharosaForCustomer`, `getBalance` | — |
| `/customer/[merchantId]` | One merchant's ledger + pay | `getEntries`, `getBalance` | `addPayment` |
| `/ocr` | Photo → extracted entries | — | `addEntry` (source: ocr) |
| `/chat` | Merchant NL query | ledger snapshot | — (read-only) |

---

## 7. AI Integration — Mock vs Real

Four AI touchpoints. Each has a `USE_MOCK` flag so the demo survives an AI outage.

| Touchpoint | Recommended | Where it lives | Fallback |
|------------|-------------|----------------|----------|
| **Voice reminder (Sarvam TTS)** | **REAL** — the wow-moment | `api/tts/route.ts` | Pre-generated audio files |
| **OCR (handwriting → entries)** | **REAL if test passes**, else mock | `api/ocr/route.ts` | Fixed result for one prepared image |
| **Reminder text generation** | REAL (cheap, reliable) | `api/reminder/route.ts` | Template string with name + amount |
| **Merchant chatbot** | REAL (cheap, reliable) | `api/chat/route.ts` | Pattern-match 3 canned questions |

**Design rule:** every AI call goes through an API route and a `lib/ai/` wrapper. Switching from real → mock is one line inside the wrapper. Build all wrappers with `USE_MOCK=true` first, then flip real touchpoints one by one.

**Server-side only:** API keys (Sarvam, LLM) live only in Next.js API routes via `.env.local` — never in client components.

---

## 8. What's Mocked (explicit list)

- **Payment:** `addPayment` generates a fake `upiReference` and shows a success animation. No money moves.
- **Persistence:** all state is in-memory; refresh resets it. Seed data reloads on mount.
- **QR scan:** `QRMock` simulates a scan with a button. No camera required (camera is a nice-to-have if time allows).
- **Auth / login:** no real accounts. `currentUserId` is set by the role toggle.
- **Lending:** not built. Referenced in the pitch as the downstream value.

---

## 9. Build Order

Build in this dependency order — nothing later blocks something earlier:

1. Types + Context + seed data
2. Paytm-styled shared components
3. Merchant view (read-only first)
4. Customer view + mocked payment
5. Setup flow
6. AI wrappers with `USE_MOCK=true`
7. Wire real Sarvam TTS
8. OCR + chatbot (real or mock per Section 7)
9. Polish + demo-proofing

*(Detailed per-task checklist is in the Build Task Breakdown doc.)*

---

## 10. Deployment

- **Vercel** — one-command deploy, instant shareable URL for judges.
- Set env vars (Sarvam key, LLM key) in Vercel dashboard before demo day.
- Have the URL ready on the demo phone **and** a laptop as backup.
- Test on the venue projector aspect ratio before presenting.
