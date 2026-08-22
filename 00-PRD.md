# Paytm Bharosa — Product Requirements Document

**Event:** Build for India — Paytm AI Hackathon (Hyderabad)
**Product name:** Paytm Bharosa
**Deliverable:** Feature inside the Paytm app (not a standalone app)
**Demo platform:** Web app (React / Next.js)
**Team size:** 2
**Date:** August 2026

---

## 1. The Name

**Bharosa** means trust in Hindi — and trust is the literal word a kirana merchant uses when opening a khata: *"main tumhe bharose pe de raha hoon"* ("I'm giving you this on trust"). The product exists because of that trust between two people. Paytm Bharosa makes it digital.

---

## 2. Problem Statement

Kirana stores, chemists, salons, and small merchants run informal credit — *udhaar* — in paper notebooks. A customer takes goods today and settles later, usually at month-end. Paytm sees the merchant's settled digital payments but is completely blind to the receivable sitting in that notebook.

That blind spot matters: the receivable is exactly the signal that gates working-capital lending. A merchant with ₹80,000 in outstanding udhaar is a healthy, creditworthy business — but because that number lives on paper, Paytm can't see it, can't verify it, and can't lend against it.

**Paytm Bharosa brings the khata inside Paytm** — as a co-signed digital ledger between a merchant and a customer who already trust each other — and uses AI to (a) onboard existing paper books via OCR, (b) let merchants query their ledger in natural language, and (c) collect dues with voice reminders in the customer's own language.

---

## 3. Why This, Not Khatabook / OkCredit

Digital udhaar ledgers already exist at scale (Khatabook: 5+ crore merchants). They all share one trait: **they replace the notebook — the merchant must re-type every transaction manually.** That manual-entry wall is exactly why the most paper-committed merchants never converted.

Paytm Bharosa is different on two axes:

1. **It lives inside Paytm.** The receivable feeds Paytm's existing merchant-lending engine and rides Paytm's payment rails. Only Paytm can cross-check a paper receivable against real UPI settlements and underwrite on it.
2. **It reads the existing paper book (OCR).** Merchants onboard with months of history in one photo — no retyping. This is the differentiating feature that answers "what's new?"

> **One-line positioning:** Khatabook replaces your notebook. Paytm Bharosa reads it.

---

## 4. Core Concept

The bharosa ledger is a **mutual, co-signed relationship** between two people who already know and trust each other.

- Both merchant and customer have **Paytm Bharosa** inside their Paytm app.
- To open a bharosa: customer scans the merchant's QR → selects "Open Bharosa" → merchant accepts. Mutual acceptance establishes the relationship.
- From then on: customer buys, scans QR, selects "Add to Bharosa" instead of paying now. The entry is recorded on **both** sides instantly.
- At settlement (by mutual understanding — no forced cycle), the customer pays the total or a partial amount in-app.

---

## 5. Locked Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Itemization | Not required — total-per-entry is fine |
| 2 | Partial payment | Reduces the running total; not matched to specific entries. Entries stay as history. |
| 3 | Customer confirmation | Auto-confirmed when customer scans (they initiated it). OCR entries send the customer a notification only. |
| 4 | Monthly cycle | No forced cycle. Settlement is by mutual understanding. |
| 5 | Non-app customer | Paper OCR fallback — merchant logs it. |
| 6 | Platform | Web app (React / Next.js) |
| 7 | Demo user | Both sides — same phone, toggle between merchant and customer view |
| 8 | Languages (TTS) | Hindi + Telugu + English |
| 9 | Payment in demo | Mocked — fake button → success state |
| 10 | Backend | Local state only (React useState) |

---

## 6. AI / Sarvam Touchpoints (all four in scope)

1. **OCR** — reads a handwritten paper udhaar page → extracts customer, amount, date into structured entries.
2. **Voice reminder** — generates a polite reminder spoken via Sarvam TTS in the customer's language (Hindi / Telugu / English).
3. **Auto-generated reminder text** — LLM drafts the polite reminder message before it is spoken.
4. **Merchant chatbot** — merchant queries their ledger in natural language ("How much does Ramesh owe?", "Who hasn't paid this month?").

---

## 7. Data Model

```
Bharosa (the relationship)
  id
  merchantId
  merchantName
  customerId
  customerName
  customerLang     // hi | te | en (for voice reminder)
  status           // active | closed
  createdAt

Entry (each credit transaction)
  id
  bharosaId
  amount
  description
  timestamp
  source           // digital_scan | ocr
  confirmed        // true = customer scanned; false = OCR (notified only)

Payment (settlement, full or partial)
  id
  bharosaId
  amount
  timestamp
  upiReference     // mocked in demo
```

**Running balance** = `sum(entries.amount) − sum(payments.amount)`

---

## 8. Screens In Scope

### A. Bharosa Setup Flow
Customer scans QR → "Open Bharosa with [Store]" → merchant accepts → relationship established.

### B. Merchant View (core screen 1)
List of customers with active bharosas + each running balance. Select a customer → full entry history + balance. Actions: Send Reminder, Add Entry.

### C. Customer View (core screen 2)
List of merchants they hold a bharosa with + each balance. Select a merchant → full entry history + total owed. Action: Pay (full or partial, mocked UPI).

### D. OCR Scan Screen
Merchant photographs a paper udhaar page → AI extracts entries → merchant confirms → entries added (marked `source: ocr`, customer notified).

### E. Chatbot Query Screen
Merchant types or speaks a natural-language question → AI answers from ledger data.

---

## 9. Demo Script (the presentation)

Single phone, toggle between views. Total: ~3 minutes.

1. **Setup** — Customer opens a bharosa with the store. QR scan → merchant accepts. *(30 sec)*
2. **Transaction** — Customer buys, scans QR, selects "Add to Bharosa." Both sides get the entry instantly. *(30 sec)*
3. **OCR wow-moment** — Merchant photographs a real paper udhaar page → entries appear extracted and ready to confirm. *(45 sec)*
4. **Chatbot** — Merchant asks "Who owes me the most this month?" → AI answers. *(30 sec)*
5. **Voice reminder** — Merchant hits Send Reminder → a Telugu voice note plays aloud in the room. *(30 sec)*
6. **Payment** — Customer opens their bharosa, pays partial amount → balance drops. *(20 sec)*

**Close:** "This isn't a standalone app — it's an AI feature built to be absorbed into Paytm's merchant stack, turning the invisible paper receivable into a lending signal Paytm can't see today."

---

## 10. Edge Cases & Answers

| Edge case | Answer |
|-----------|--------|
| Merchant writes fake entries | Fakes only exist in the paper/OCR lane. Digital entries are customer co-signed and can't be faked. Lending trusts the verified digital share, not paper claims. |
| "I already paid in cash" | Digital lane: settlement is in-app, no dispute possible. Paper lane: one-tap "mark paid" + UPI reconciliation. |
| Customer has no Paytm app | Paper OCR fallback — merchant logs it, customer is outside the digital co-sign. |
| OCR misreads handwriting | Merchant confirms extracted entries before they're saved. OCR output is a draft, not final truth. |
| Wrong reminder to a good customer | Cross-check against Paytm UPI settlements before reminder fires. Only Paytm can do this. |
| Customer consent / DPDP | Both parties opt in via the mutual acceptance setup flow. Consent is structural, not an afterthought. |

---

## 11. Out of Scope (hackathon)

- Real UPI payment integration (mocked)
- Real backend / persistence (local state only)
- Live reconciliation engine (described, not built)
- Multi-page OCR, cumulative-ledger handling
- Actual lending integration (pitched as downstream value, not built)

---

## 12. Success Criteria

- OCR visibly extracts entries from a real handwritten page.
- A Telugu voice reminder plays aloud in the room.
- Both merchant and customer views work from one phone.
- Chatbot answers at least one natural-language ledger question.
- The story lands: "AI reaches the receivable Paytm can't see, inside Paytm's own stack."
