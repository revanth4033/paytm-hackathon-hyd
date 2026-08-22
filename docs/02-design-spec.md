# Paytm Bharosa — UI/UX + Paytm Design Spec

**Document 2 of 5** · Companion to the PRD & Technical Architecture
**Goal:** Make every screen look like it genuinely lives inside the Paytm app.

---

## 1. Design Philosophy

The visual goal here is the opposite of "be original." We are deliberately matching Paytm's existing design language so the demo reads as a native Paytm feature — not a third-party app or a hackathon prototype. The only original touch is a subtle Bharosa identity element (Section 8).

**The single most important visual claim in the pitch is "this is a feature inside Paytm, not a standalone app." If the UI looks generic, that claim fails on sight.**

---

## 2. Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| `paytm-blue` | `#00BAF2` | Primary brand — headers, active states, links |
| `paytm-blue-dark` | `#0099CC` | Pressed/hover state of primary blue |
| `paytm-navy` | `#002970` | Deep finance-blue — primary buttons, headings |
| `paytm-navy-deep` | `#012B72` | Gradient partner to navy |
| `bg-white` | `#FFFFFF` | Card surfaces, primary background |
| `bg-gray` | `#F7F8FA` | App background behind cards |
| `border-gray` | `#EAECEF` | Card borders, dividers |
| `text-primary` | `#1A1A1A` | Primary text |
| `text-secondary` | `#6B7280` | Secondary text, timestamps, labels |
| `success-green` | `#21C17A` | Payment success, cleared balance |
| `alert-red` | `#E5343D` | Overdue balance |
| `warn-amber` | `#F5A623` | Ageing balance + Bharosa accent (see Section 8) |

**Signature header gradient (use on all top bars):**
```css
background: linear-gradient(135deg, #002970 0%, #00BAF2 100%);
```
This is the most recognizable Paytm visual cue. Use it on every screen's app bar.

**Tailwind config additions:**
```js
colors: {
  'paytm-blue': '#00BAF2',
  'paytm-blue-dark': '#0099CC',
  'paytm-navy': '#002970',
  'paytm-navy-deep': '#012B72',
  'bg-app': '#F7F8FA',
  'success': '#21C17A',
  'alert': '#E5343D',
  'bharosa-amber': '#F5A623',
}
```

---

## 3. Typography

Paytm uses a custom font ("Paytm Sans"). **Inter** is a near-perfect free approximation.

| Role | Font | Weight | Size | Use |
|------|------|--------|------|-----|
| Display | Inter | 700 | 24–28px | Screen titles, large balance amounts |
| Heading | Inter | 600 | 18–20px | Card titles, customer/merchant names |
| Body | Inter | 400–500 | 14–16px | Entry descriptions, general text |
| Caption | Inter | 500 | 12–13px | Timestamps, metadata, small labels |
| Amount | Inter | 700 | 20–32px | Running balances — the number is the hero |

**Rule:** money amounts are always the largest, boldest element on any card. In a finance app the number is the focal point — never subordinate it to a label.

Load Inter via `next/font/google`.

---

## 4. Layout & Spacing

- **Mobile-first, single column.** This is a phone feature. Max content width 440px, centered on larger screens.
- **Phone-frame wrapper (recommended):** wrap the whole app in a centered 390×844 rounded container with a subtle border — on the projector it reads instantly as a phone screen inside Paytm.
- **8px spacing scale:** 4, 8, 12, 16, 24, 32px.
- **Card padding:** 16px. Gap between cards: 12px.
- **Card radius:** 16px. Button radius: 12px.
- **Shadow:** `box-shadow: 0 2px 8px rgba(0,0,0,0.06)` — soft, light.

---

## 5. Core Components (visual spec)

### PaytmHeader
Navy→blue gradient bar. White title text. Back arrow on sub-screens. Height ~56px. This single component sells "inside Paytm" more than anything else.

### BalanceCard
White card, 16px radius, soft shadow. Large bold amount in navy (owed) or green (cleared). Small secondary label above ("Total Outstanding" / "You owe"). Optional ageing chip (amber/red) in top-right corner.

### CustomerRow / MerchantRow
White row card. Avatar circle (colored disc with initials). Name in heading weight. Running balance right-aligned and bold — colored: navy (normal), amber (ageing), red (overdue). Chevron on right. Tap → detail screen.

### EntryList + EntryRow
Each entry: description + date on left, amount on right. Charges in navy "+ ₹X". Payments in green "− ₹X paid". Small source pill: "scan" or "OCR" — visually distinguishes the two lanes at a glance.

### PayButton
Full-width, `paytm-navy` background, white text, 600 weight, 12px radius. Label: "Pay ₹X" (full amount). Secondary text link below: "Pay partial amount." On tap → green check success animation + "Paid via Paytm UPI" mock confirmation.

### ReminderButton
Secondary style: `paytm-blue` outline or light-blue fill. Label: "Send Reminder." On tap → shows generated reminder text → plays voice note.

### QRMock
Styled QR block (use a real QR image of a dummy string for visual authenticity). "Scan to Pay / Bharosa" framing. Button simulates the scan completing.

### VoicePlayer
Appears after Send Reminder. Shows reminder text + play button + language chip ("Telugu"). Auto-plays Sarvam audio. Make this component visually prominent — it is the second memorable demo beat.

---

## 6. Screen-by-Screen Layout

**Landing / Role Toggle (`/`)**
Paytm gradient header with "Paytm Bharosa" title. Two large cards: "I'm a Merchant" / "I'm a Customer." Persistent role toggle top-right for the demo.

**Merchant list (`/merchant`)**
Header "Bharosa Book." Total-receivable summary card at top — the aggregate "what Paytm can now see" number. List of CustomerRows sorted by ageing. Floating action buttons: "Scan Paper Book" (→ OCR) and "Ask" (→ chatbot).

**Merchant → customer detail (`/merchant/[customerId]`)**
Header with customer name and avatar. BalanceCard with total outstanding + ageing indicator. EntryList of all transactions (charges + payments). "Send Reminder" button pinned at bottom.

**Customer list (`/customer`)**
Header "My Bharosas." List of MerchantRows — shops they owe, each with current balance.

**Customer → merchant detail (`/customer/[merchantId]`)**
BalanceCard "You owe ₹X." EntryList. PayButton (full / partial) pinned at bottom.

**Setup (`/setup`)**
QRMock → "Open Bharosa with [Store]" → merchant-accept confirmation screen → success.

**OCR (`/ocr`)**
Upload/capture area. "Reading your book…" loading state. Extracted entries shown for merchant confirmation. "Add to Bharosa" confirm button.

**Chatbot (`/chat`)**
Clean chat UI. Suggested question chips at top. Merchant types or speaks. Answers appear as chat bubbles in Paytm blue.

---

## 7. Microcopy (Paytm voice)

Plain, direct, sentence case. No jargon. No exclamation marks.

| Context | Copy |
|---------|------|
| Balance label (merchant) | "Total outstanding" |
| Balance label (customer) | "You owe" |
| Add credit | "Add to Bharosa" |
| Pay full | "Pay ₹500" |
| Pay partial | "Pay partial amount" |
| Reminder sent | "Reminder sent" |
| Payment success | "Paid via Paytm UPI" |
| Payment received | "₹500 received" |
| OCR upload | "Scan your paper book" |
| OCR processing | "Reading your book…" |
| OCR result | "Found 5 entries — confirm to add" |
| Empty state | "No bharosas yet. Scan a QR to start." |
| Chatbot placeholder | "Ask about your bharosas…" |
| Open bharosa | "Open Bharosa" |
| Setup success | "Bharosa opened with [Store]" |

---

## 8. The Bharosa Signature Element

Everything above matches Paytm's system. The single thing that marks this as Paytm Bharosa:

A small **"Bharosa" wordmark badge** using `#F5A623` amber — the color of aged paper, nodding to the paper notebook that is the product's origin. Used only on:
- The feature entry point (landing screen header accent)
- The OCR screen (the "paper lane" visually)
- The source pill on OCR entries in the EntryList

Nowhere else. One accent, used sparingly, so it reads as intentional identity rather than decoration.

---

## 9. What the AI Coding Tool Should NOT Do

- Do not invent a new color palette — use the tokens in Section 2 verbatim.
- Do not use dark mode, heavy shadows, or colored backgrounds on the main surfaces — Paytm is light, airy, blue-on-white.
- Do not put the gradient everywhere — navy→blue gradient is for headers only.
- Do not add animations everywhere — one satisfying payment success and one voice-play moment. Nothing else moves on its own.
- Do not use rounded corners on single-sided borders.
- Do not write text on colored backgrounds in black — use the darkest shade of the same color family.
