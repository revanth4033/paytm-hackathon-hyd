# Paytm Bharosa — Development Roadmap

**Document 4 of 5** · Companion to the Build Task Breakdown
**Team:** 2 people
**Format:** Time-boxed blocks. The goal is a working demo, not a complete product. Stop building features the moment the demo script works end-to-end.

---

## Guiding Rule

> Build to the demo script, not to the spec. Every task that isn't on the demo script is optional until Phases 0–7 are done.

The demo script is 6 beats, ~3 minutes (PRD Section 9). Everything else is polish or pitch prep.

---

## Block 1 — Foundation (2–3 hours)

**Goal:** app runs, data flows, Paytm look is in place.

| Time | Person A | Person B |
|------|----------|----------|
| Hour 1 | Project setup (Phase 0) | **OCR risk test** — photograph a real Telugu udhaar page, run it through the vision model, decide real vs mock |
| Hour 2 | Types + Context + seed data (Phase 1) | Set up AI wrappers with `USE_MOCK=true` (Phase 6.1–6.2) |
| Hour 3 | Shared Paytm components (Phase 2) | Mock reminder + TTS endpoints (Phase 6.3–6.5) |

**Exit criteria:** `getBalance()` works on seed data, PaytmHeader gradient renders, OCR decision is made.

---

## Block 2 — Core Screens (2–3 hours)

**Goal:** both merchant and customer views work end-to-end with mocked AI.

| Time | Person A | Person B |
|------|----------|----------|
| Hour 4 | Merchant list + customer detail (Phase 3) | ReminderButton + VoicePlayer wired to mock TTS (Phase 7.1–7.2) |
| Hour 5 | Customer view + mocked payment (Phase 4) | OCR screen wired to mock extractor (Phase 8.1) |
| Hour 6 | Setup flow (Phase 5) | Chatbot screen wired to mock answers (Phase 8.3) |

**Exit criteria:** full demo script runs top to bottom with all mock data. No AI provider needed yet.

---

## Block 3 — Real AI (1–2 hours)

**Goal:** replace mock AI with real providers for the two wow-moments.

| Time | Person A | Person B |
|------|----------|----------|
| Hour 7 | Wire real Sarvam TTS (Phase 7.3) — test Telugu voice at demo volume | Wire real LLM for chatbot (Phase 8.3) + reminder text (Phase 6.2) |
| Hour 8 | Wire real OCR if test passed (Phase 8.2), else confirm mock is solid | Test all four AI touchpoints together; confirm fallbacks work |

**Exit criteria:** Telugu voice note plays live. Chatbot answers real ledger questions. All `USE_MOCK` fallbacks confirmed working.

---

## Block 4 — Polish + Deploy (1 hour)

**Goal:** demo-proof, deployed, tested on the actual device.

- [ ] Seed data review — make the total receivable number impressive.
- [ ] Run full demo script on the actual phone without touching the keyboard.
- [ ] Deploy to Vercel, set env vars, confirm URL loads on mobile.
- [ ] Flip all `USE_MOCK=true`, run full demo again — confirm it still works.
- [ ] Pre-load Telugu audio fallback file.
- [ ] Test on projector or large screen — confirm phone-frame wrapper looks right.

**Exit criteria:** demo runs on the phone in 3 minutes flat, survives an AI outage via mocks.

---

## Block 5 — Pitch Prep (30–60 minutes, parallel to Block 4)

**One person builds, one person prepares the pitch while the app deploys.**

- [ ] Read the Pitch One-Pager (Doc 05) once top to bottom.
- [ ] Memorize the 30-second pitch and the 3 things to remember.
- [ ] Practice the 5 judge Q&A answers out loud.
- [ ] Decide who speaks, who runs the phone, who answers edge-case questions.
- [ ] Practice the demo script twice with the actual phone.

---

## If Time Runs Short — Cut in This Order

If you're behind, drop features in this order. The demo still works after each cut.

| Cut | What you lose | What you keep |
|-----|--------------|---------------|
| Drop OCR screen | The paper wow-moment (describe it instead) | All 5 other demo beats |
| Drop chatbot | NL query beat | Core ledger + voice |
| Drop setup flow | The mutual-acceptance story | Merchant + customer views + payment + reminder |
| Drop partial payment | Payment nuance | Full payment mock still works |
| Mock all AI | Both wow-moments become described, not shown | Everything else works |

**Hard floor — never cut these:**
- Merchant view (customer list + one customer detail)
- Customer view (one merchant + pay button)
- Send Reminder → Voice note (even if pre-recorded, not live)
- The role toggle (so judges see both sides)

These four together are the minimum viable demo. Everything above them is upside.

---

## What Done Looks Like

The demo is done when:
1. You can run all 6 beats of the PRD demo script on one phone without stopping.
2. A Telugu voice note plays aloud when Send Reminder is pressed.
3. The Vercel URL loads on a fresh device in under 5 seconds.
4. All `USE_MOCK=true` and the demo still runs — AI failure cannot break the presentation.
