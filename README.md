# Paytm Bharosa

**Digital udhaar, co-signed and visible to Paytm.**

Kirana stores, chemists and salons run informal credit — *udhaar* — in paper notebooks. Paytm sees the merchant's settled digital payments but is blind to the receivable sitting in that notebook. That receivable is exactly the signal that gates working-capital lending.

Paytm Bharosa brings the khata inside Paytm as a **mutual, co-signed ledger** between a merchant and a customer who already trust each other.

> Khatabook replaces your notebook. Paytm Bharosa reads it.

---

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

**No API keys are needed.** Every AI touchpoint defaults to mocked, so the whole demo runs out of the box. To enable real calls, copy `.env.local.example` to `.env.local`, fill in the keys, and flip the matching `USE_MOCK_*` flag to `false` one at a time.

---

## The case study

`/` is the **case study** — the problem, the two-lane model, where the AI sits, the trust model, and the objections answered, with the live prototype embedded partway down. It exists because a judge opening the submission link sees a phone mockup and has no idea what it is for. Keep it in sync with `docs/05-pitch-one-pager.md`, which is the document you hold during judging.

`/demo` is the same prototype with nothing around it — open that one when presenting live.

---

## The demo

`/demo` opens on **both phones side by side**, sharing one live state — the merchant's Bharosa Book on the left, the customer's Paytm on the right. This is the point of the layout: the handoff plays out across both devices with no page reload in between.

Walk it in this order:

1. **Right phone** → Scan QR → tap the shop's QR standee → the payment screen opens
2. Enter an amount → tap the **🤝 Add Bharosa** chip → the primary CTA flips to **Add Bharosa** → tap it
3. **Left phone** lights up with the request → tap **Accept**
4. The customer now appears in the merchant's book with their first purchase already on the khata

> The two phones need roughly 900px of width to sit side by side. Present on a laptop; on a narrow screen they stack vertically.

---

## Routes

| Route | What it is |
|---|---|
| `/` | The case study, with the live prototype embedded |
| `/demo` | Both phones, side by side, sharing live state |
| `/consumer` | The customer's Paytm home, full screen |
| `/consumer/scan` | The QR scanner |
| `/consumer/pay/[merchantId]` | Payment screen — where Add Bharosa lives |
| `/consumer/bharosa` | The customer's khatas |
| `/merchant` | The merchant's Bharosa Book |
| `/ocr` | Paper-book OCR |
| `/chat` | Natural-language ledger queries |
| `/test/split` | Same two phones, as a stable test URL |

---

## How the trust model shows up in the code

Every ledger entry records **how it got there**, because that distinction is the whole product:

| Source | Meaning | Trusted for lending |
|---|---|---|
| `digital_scan` | The customer scanned and co-signed it | Yes |
| `ocr` | Read off the merchant's paper book | No — customer is notified to review |
| `manual` | Typed in by the merchant | No — customer is notified to review |

Only `digital_scan` carries `confirmed: true`. The other two render with an **"added by shop"** badge on both sides, so a merchant cannot fabricate the evidence the lending story rests on.

Other rules worth knowing:

- A Bharosa request can be **declined**, which removes it *and* the provisional first purchase — a refused customer is never left looking at a debt.
- Payments are clamped to the outstanding balance, so a balance can't go negative.
- Partial payment is supported, and the customer can pay the remainder without reloading.
- In-app notifications are **addressed to one side**, so each phone only sees what was sent to it.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4

State is in-memory React context (`context/BharosaContext.tsx`) — no backend, per the hackathon scope. Payments are mocked.

## Deploying

The app builds from the repo root — `package.json` is at the top level, so Vercel's defaults work with no Root Directory override. If this project was deployed before the app was flattened out of the old `paytm-bharosa/` subdirectory, clear that **Root Directory** setting under Settings → Build & Deployment or the build will find no `package.json` and serve a 404.
