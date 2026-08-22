# Paytm Bharosa — Pitch One-Pager & Judge Q&A Card

**Document 5 of 5** · Print this. Hold it during judging.

---

## THE NAME

**Bharosa** means trust. A kirana merchant says *"main tumhe bharose pe de raha hoon"* — "I'm giving you this on trust" — every time he opens a khata. That word is the entire product in one syllable. **Paytm Bharosa** makes that trust digital, co-signed, and visible to Paytm's lending engine.

---

## THE 30-SECOND PITCH

> Kirana and small merchants run credit — *udhaar* — in paper notebooks. Paytm sees their settled payments but is blind to the receivable sitting in that book — the exact signal that decides whether a merchant qualifies for a loan.
>
> Paytm Bharosa brings the khata inside Paytm as a co-signed digital ledger between two people who already trust each other. Our AI reads the existing paper book — no retyping. Merchants collect dues with a voice reminder in the customer's own language via Sarvam. And that receivable becomes a lending signal Paytm can't see today.
>
> Everyone else digitizes udhaar by making merchants retype it. We're the only one that reads the book they already keep.

---

## ONE-LINE ANSWERS

**The problem:** Paytm can't see the paper receivable — so the hardest-working merchants are invisible to lending. We make the invisible visible.

**How AI solves it:** AI reaches data that isn't in Paytm at all today — it reads handwritten udhaar, speaks reminders in Hindi/Telugu/English (Sarvam TTS), and answers the merchant's questions about their own book.

**The difference:** *Khatabook replaces your notebook. Paytm Bharosa reads it.* Replacement is why they plateau at the paper-committed merchant. Reading the book is how we reach exactly that merchant — with their whole history, in one photo.

---

## THE 5 JUDGE QUESTIONS — READY ANSWERS

**Q1. "What's the actual problem?"**
Paytm underwrites lending on settled digital payments. Udhaar receivables live on paper — invisible to Paytm. The merchants with the most receivables are often the least digital, so they're locked out of credit they've earned. We surface that receivable.

**Q2. "How is AI central, not bolted on?"**
Four AI touchpoints, all load-bearing: (1) vision reads handwritten Telugu/mixed-script udhaar into structured entries; (2) Sarvam TTS speaks reminders in the customer's language; (3) LLM drafts the polite reminder; (4) chatbot lets the merchant query their ledger in plain language. Remove the AI and there is no product.

**Q3. "Khatabook and OkCredit already do this. What's new?"**
Two things. One — they all make the merchant retype every transaction. Paytm Bharosa reads the existing paper book, so the paper-committed segment that never converted can finally onboard — with months of history instantly. Two — we're inside Paytm, so the receivable feeds Paytm's existing lending engine and can be verified against real UPI settlements. A standalone app owns neither rail.

**Q4. "Why inside Paytm — couldn't it be standalone?"**
Only Paytm can do two things a standalone app can't: cross-check the paper receivable against real UPI settlements (so we never send a wrong reminder to a customer who already paid), and feed the verified receivable into a lending engine Paytm already runs. Being inside Paytm isn't convenience — it's the two rails that make the signal trustworthy and actionable.

**Q5. "Paytm could just build this themselves."**
That's the goal. Paytm Bharosa is built to be absorbed into Paytm's merchant stack, not to compete with it. In this hackathon the winning idea is one Paytm would want to ship. What makes it worth their engineering time over the other ideas in this room: it's the only one whose AI reaches new data — the paper receivable — instead of re-presenting data Paytm already has.

---

## EDGE CASES — SURFACE THESE YOURSELF

Naming your edge cases before the judge does signals you've thought harder than the field.

| Edge case | Your answer |
|-----------|-------------|
| **Merchant writes fake entries to get a bigger loan** | Fakes only exist in the paper lane. Digital entries are customer-initiated and co-signed — structurally unfakeable. Lending trusts the verified digital share and the repayment pattern, not raw paper claims. |
| **"I already paid in cash"** | Digital lane: settlement is in-app, so the dispute can't happen. Paper lane: one-tap "mark paid" + reconciliation against real UPI settlements. |
| **Wrong reminder to a customer who already paid** | Before any reminder fires, we cross-check against Paytm's UPI settlements. Only Paytm can do this. It's exactly why the feature needs to be inside Paytm. |
| **Customer has no Paytm app** | Paper OCR fallback — merchant logs it, customer is outside the digital co-sign. This is why we keep both lanes. |
| **OCR misreads Telugu handwriting** | OCR output is a draft — the merchant confirms before entries are saved. Wrong reads never enter the ledger silently. |
| **Customer consent / DPDP** | Both parties opt in via mutual acceptance in the setup flow. Consent is structural — built into the first action, not an afterthought. |

---

## THE TWO-LANE MODEL (draw this if they want depth)

```
PAPER LANE (onboarding)             DIGITAL LANE (steady-state)
Merchant keeps notebook             Customer scans QR → "Add to Bharosa"
     ↓ photograph                        ↓ both sides co-sign
AI reads handwriting                 Verified entry, instant, fraud-proof
     ↓ unverified draft                   ↓
Onboards merchant + full history     Rising share of VERIFIED receivables
                                          ↓
              → Feeds Paytm's lending engine ←
              (verified receivables = clean lending signal)
```

**The line that ties it together:**
> Merchants start on paper — we read it to onboard them and their history. Every new udhaar moves to the digital co-signed flow. Over time the ledger migrates from unverified paper to verified digital — and that rising verified share is the clean lending signal.

---

## THE CLOSE

> Paytm Bharosa isn't a standalone app — it's an AI feature built to be absorbed into Paytm's merchant stack. It turns the invisible paper receivable into a lending signal that helps India's smallest merchants finally access the credit they've already earned. We named it Bharosa because that trust between a shopkeeper and his customer is the whole product — we're just making it visible.

---

## 3 THINGS TO REMEMBER

1. **Lead with AI-impact:** "our AI reaches data that isn't in Paytm at all." Not "we're integrated" — that's every entry in the room.
2. **The difference is one line:** "They replace the notebook. We read it."
3. **Name your edge cases first** — fake entries and silent cash payments. It separates you from the field.
