# Paytm Bharosa — Build Task Breakdown

**Document 3 of 5** · Companion to PRD, Architecture, and Design Spec
**Team:** 2 people
**Purpose:** The executable checklist. Feed tasks to your AI coding tool one phase at a time. Do them top to bottom — nothing later blocks something earlier.

---

## How to Use This Document

1. Give your AI coding tool the PRD + Architecture + Design Spec once as context.
2. Feed it tasks from here one phase at a time.
3. Check off each task before moving on.
4. Never skip ahead — the foundation phases make every later phase faster.

---

## Phase 0 — Project Setup

- [ ] **0.1** Create Next.js app with App Router, TypeScript, and Tailwind.
- [ ] **0.2** Install Inter font via `next/font/google` and set as the default font.
- [ ] **0.3** Add Paytm color tokens to `tailwind.config.ts` (paytm-blue, paytm-navy, bharosa-amber, etc. from Design Spec Section 2).
- [ ] **0.4** Set app background to `#F7F8FA`, wrap content in a centered 440px column.
- [ ] **0.5** Add phone-frame wrapper (390×844, rounded, subtle border) so the demo reads as a phone on the projector.

**Done when:** blank app runs at localhost, Inter loads, Paytm colors available as Tailwind classes.

---

## Phase 1 — Data Foundation

- [ ] **1.1** Create `lib/types.ts` — copy the `Bharosa`, `Entry`, `Payment`, `Role`, `Lang`, `EntrySource` types exactly from the Architecture doc Section 4.
- [ ] **1.2** Create `lib/seed.ts` — dummy data that makes the demo look alive:
  - 1 merchant: "Sri Balaji Kirana Store"
  - 3–4 customers with varied balances and ageing (one overdue, one recent, one partially paid, one fresh)
  - 5–8 entries per customer, mix of `source: digital_scan` and `source: ocr`
  - Realistic descriptions: "Rice 5kg", "Cooking oil 1L", "Biscuits", "Atta 10kg", "Sugar 2kg"
  - Realistic dates spread over the past 3–4 weeks
  - 1–2 partial payments so payment history is visible
  - At least one customer with `customerLang: "te"` (Telugu) for the voice demo
- [ ] **1.3** Create `context/BharosaContext.tsx` with all state and actions from Architecture doc Section 5. Initialize from seed data on mount.
- [ ] **1.4** Wrap the app in `BharosaProvider` in `app/layout.tsx`.

**Done when:** you can call `getBalance(bharosaId)` from any component and get a correct running balance from the seed data.

---

## Phase 2 — Shared Paytm Components

Build these before any screen — every screen reuses them.

- [ ] **2.1** `PaytmHeader` — navy→blue gradient bar, white title, back arrow on sub-screens, 56px height.
- [ ] **2.2** `BalanceCard` — white card, 16px radius, large bold balance amount, secondary label, optional ageing chip.
- [ ] **2.3** `CustomerRow` — avatar disc (initials on colored disc), name, right-aligned balance in correct ageing color, chevron.
- [ ] **2.4** `MerchantRow` — same pattern as CustomerRow but for the customer's view.
- [ ] **2.5** `EntryList` + `EntryRow` — description + date left, amount right; navy for charges, green for payments; small "scan" or "OCR" source pill.
- [ ] **2.6** `RoleToggle` — top-right switch to flip Merchant ⇄ Customer during the demo.

**Done when:** each component renders correctly with seed data in isolation, styled per the Design Spec.

---

## Phase 3 — Merchant View

- [ ] **3.1** `/merchant` page: PaytmHeader "Bharosa Book", total-receivable BalanceCard at top (sum across all customers), list of CustomerRows sorted by ageing (most overdue first).
- [ ] **3.2** `/merchant/[customerId]` page: customer header with avatar, BalanceCard (total outstanding + ageing), EntryList for that customer.
- [ ] **3.3** "Add Entry" action on customer detail: simple inline form (amount + description) → calls `addEntry` with `source: digital_scan` → balance updates instantly.

**Done when:** you can browse merchant → customer list → customer detail → see entries, and adding an entry updates the balance on both the detail screen and the merchant list.

---

## Phase 4 — Customer View + Mocked Payment

- [ ] **4.1** `/customer` page: PaytmHeader "My Bharosas", list of MerchantRows with balances.
- [ ] **4.2** `/customer/[merchantId]` page: BalanceCard "You owe ₹X", EntryList, PayButton pinned at bottom.
- [ ] **4.3** PayButton behavior:
  - "Pay ₹X" pays the full balance.
  - "Pay partial amount" shows an input for any amount ≤ balance.
  - On confirm → calls `addPayment` → green check success animation → "Paid via Paytm UPI" mock → balance drops.
- [ ] **4.4** Verify: paying partial reduces the running total (not specific line items), all entries stay as history.
- [ ] **4.5** Verify: after payment, the MerchantRow on `/merchant/[customerId]` also shows the updated balance (shared context).

**Done when:** customer can view a shop's ledger, pay full or partial, and the merchant view updates without a page refresh.

---

## Phase 5 — Bharosa Setup Flow

- [ ] **5.1** `/setup` page: QRMock block displaying a dummy QR → "Open Bharosa with Sri Balaji Kirana Store" button.
- [ ] **5.2** Simulated merchant-accept screen → on accept, calls `openBharosa` → new bharosa appears in both the merchant and customer lists.
- [ ] **5.3** Success state: "Bharosa opened ✓ — you can now add to your bharosa when you shop here."

**Done when:** you can create a fresh bharosa from scratch and see it appear in both views immediately.

---

## Phase 6 — AI Wrappers (mock-first)

Build all four wrappers with `USE_MOCK=true` returning canned data. Wire real providers in Phases 7–8.

- [ ] **6.1** Create `lib/ai/llm.ts` and `lib/ai/sarvam.ts` wrappers, both respecting a `USE_MOCK` env flag.
- [ ] **6.2** `app/api/reminder/route.ts` — POST `{ name, amount, lang }` → returns polite reminder text. Mock: template string "Hi [name], your outstanding balance of ₹[amount] is due. Please settle at your convenience."
- [ ] **6.3** `app/api/tts/route.ts` — POST `{ text, lang }` → returns audio blob URL. Mock: return path to a pre-recorded file in `/public/audio/`.
- [ ] **6.4** `app/api/ocr/route.ts` — POST `{ image: base64 }` → returns `Entry[]`. Mock: return a fixed array of 4–5 realistic entries for one prepared test image.
- [ ] **6.5** `app/api/chat/route.ts` — POST `{ question, ledger }` → returns answer text. Mock: pattern-match "who owes most", "total receivable", "who hasn't paid" → return canned answers from seed data.

**Done when:** all four `/api/*` routes return sensible mock responses and can be called from the UI without errors.

---

## Phase 7 — Reminder + Voice (the first wow-moment)

- [ ] **7.1** Add `ReminderButton` to `/merchant/[customerId]` page. On click: call `/api/reminder` → display the generated text.
- [ ] **7.2** Add `VoicePlayer` below the reminder text. On text received: call `/api/tts` with text + customer language → auto-play audio, show language chip ("Telugu").
- [ ] **7.3** **Wire real Sarvam TTS** — flip `USE_MOCK=false` for TTS. Test that the Telugu voice plays clearly at demo volume.
- [ ] **7.4** Pre-generate 2–3 audio files and store in `/public/audio/` as fallback in case live TTS fails on demo day.

**Done when:** pressing Send Reminder generates a polite message and plays a real Telugu voice note aloud.

---

## Phase 8 — OCR + Chatbot (the second wow-moment)

- [ ] **8.1** `/ocr` page: upload/camera capture area. On image selected → call `/api/ocr` → show "Reading your book…" loading state → display extracted entries for merchant confirmation → "Add to Bharosa" confirms and calls `addEntry` for each (`source: ocr`, `confirmed: false`).
- [ ] **8.2** **Test real OCR now** on your actual handwritten Telugu test page (see Risk note below). If reliable → wire it live. If shaky → keep mock with one prepared test image.
- [ ] **8.3** `/chat` page: chat UI with 3 suggested question chips. Merchant types or speaks. Calls `/api/chat` → answer appears as a chat bubble. Wire real LLM (cheap and reliable).
- [ ] **8.4** Test chatbot handles at least: "How much does [name] owe?", "Who hasn't paid this month?", "What's my total outstanding?"

**Done when:** OCR screen extracts from a photo (real or prepared), and chatbot answers ledger questions in natural language.

---

## Phase 9 — Polish + Demo-Proofing

- [ ] **9.1** Run the full demo script (PRD Section 9) start-to-finish without a refresh. Fix any gaps.
- [ ] **9.2** Ensure seed data looks realistic — total receivable number should feel impressive (₹40,000–₹80,000 range).
- [ ] **9.3** Flip all `USE_MOCK=true` → confirm the full demo still runs with zero AI calls. This is your safety net.
- [ ] **9.4** Deploy to Vercel. Set env vars (Sarvam key, LLM key) in dashboard. Test on the actual demo phone + laptop backup.
- [ ] **9.5** Test on the venue's projector aspect ratio. Make sure the phone-frame wrapper looks good on a large screen.
- [ ] **9.6** Pre-generate and load the Telugu reminder audio file. Test at the room volume you'll present in.

**Done when:** full demo runs on the demo device, and it survives a complete AI provider outage via mocks. Both teammates have the Vercel URL.

---

## Critical Risk — Test OCR First

**Do this before Phase 6, not during Phase 8:**

1. Photograph one real handwritten Telugu udhaar page.
2. Send it to your chosen vision model right now.
3. If extraction is reliable → wire it live in Phase 8. It's your best demo moment.
4. If it's shaky → demo uses one prepared image with a known-good mock result. You describe the capability; you don't risk a live failure.

Either path keeps the demo safe. But discovering OCR fails during Phase 8 is too late. **Test it today.**

---

## Team Split (2 people)

**Person A:** Phases 0–5 (the app shell, screens, and flows)
**Person B:** Phases 6–8 in parallel (AI wrappers, Sarvam TTS, OCR test)

Merge at Phase 7 — real AI plugs into the finished UI. Both do Phase 9 together.
