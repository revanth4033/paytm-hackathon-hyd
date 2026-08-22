import Link from "next/link";
import { DemoStage } from "@/components/DemoStage";

/**
 * The case study. A judge opening the submission link lands here, not on the
 * phones — the prototype shows what it does but not why it matters, and the
 * why is the whole entry. The live demo is embedded as its own section so the
 * story and the working thing sit on one URL; /demo serves the bare phones for
 * pitching, where this page would just be something to scroll past.
 *
 * Content is the pitch one-pager in docs/05-pitch-one-pager.md, rendered. Keep
 * the two in sync — that document is what gets held during judging.
 */

const PAYTM_GRADIENT = "bg-[linear-gradient(135deg,#002970_0%,#0071b8_100%)]";

/** Section heading + standfirst, so every band on the page reads the same way. */
function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paytm-blue-dark">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-base leading-relaxed text-text-secondary">{children}</p>
      ) : null}
    </div>
  );
}

function Card({
  title,
  children,
  accent = "border-border-gray",
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${accent}`}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{children}</p>
    </div>
  );
}

/** A judge who doesn't know what to tap concludes the prototype is broken, so
 *  the walkthrough sits directly above the phones rather than in the README. */
const STEPS = [
  {
    phone: "Right phone",
    body: "Tap Scan QR, then tap the shop's QR standee. The payment screen opens.",
  },
  {
    phone: "Right phone",
    body: "Enter an amount and tap the Add Bharosa chip. The primary button flips to Add Bharosa — tap it.",
  },
  {
    phone: "Left phone",
    body: "The shop's Bharosa Book lights up with the request. Tap Accept.",
  },
  {
    phone: "Both",
    body: "The customer is now in the merchant's book, first purchase already on the khata.",
  },
];

const AI_TOUCHPOINTS = [
  {
    title: "Vision reads the paper book",
    body: "Handwritten Telugu and mixed-script udhaar, photographed and parsed into structured entries. This is the touchpoint that reaches data Paytm does not hold at all.",
    route: "/ocr",
  },
  {
    title: "Sarvam TTS speaks the reminder",
    body: "The collection nudge goes out as a voice note in the customer's own language — Hindi, Telugu or English — because the customer who owes on a khata often does not read the app.",
    route: "/merchant",
  },
  {
    title: "An LLM drafts the words",
    body: "Asking for money is the part merchants avoid. The model writes the polite version, in context, from the actual balance and how long it has been outstanding.",
    route: "/merchant",
  },
  {
    title: "The merchant queries the book",
    body: "Plain-language questions against their own ledger — who owes most, who has not paid in a month — instead of a filter UI a kirana owner will never learn.",
    route: "/chat",
  },
];

const SOURCES = [
  {
    source: "digital_scan",
    how: "The customer scanned the QR and co-signed the entry.",
    signal: "Trusted",
    tone: "text-success",
    dot: "bg-success",
  },
  {
    source: "ocr",
    how: "Read by AI off the merchant's paper book.",
    signal: "Draft — customer notified to review",
    tone: "text-bharosa-amber",
    dot: "bg-bharosa-amber",
  },
  {
    source: "manual",
    how: "Typed in by the merchant.",
    signal: "Draft — customer notified to review",
    tone: "text-bharosa-amber",
    dot: "bg-bharosa-amber",
  },
];

const EDGE_CASES: [string, string][] = [
  [
    "A merchant writes fake entries to inflate a loan",
    "Fakes can only exist in the paper lane. Digital entries are customer-initiated and co-signed, so they are structurally unfakeable. Lending trusts the verified digital share and the repayment pattern, not raw paper claims.",
  ],
  [
    "“I already paid that in cash”",
    "Digital lane: settlement happens in-app, so the dispute cannot arise. Paper lane: one-tap mark-paid, reconciled against real UPI settlements.",
  ],
  [
    "A reminder fires at someone who already paid",
    "Every reminder is cross-checked against Paytm's settled UPI payments before it sends. Only Paytm can run that check — it is precisely why this belongs inside Paytm.",
  ],
  [
    "The customer has no Paytm app",
    "The paper lane stays open: the merchant logs it, the customer sits outside the digital co-sign. This is why we keep both lanes rather than forcing one.",
  ],
  [
    "OCR misreads Telugu handwriting",
    "OCR output is a draft the merchant confirms before anything is saved. A wrong read never enters the ledger silently.",
  ],
  [
    "Customer consent and DPDP",
    "Both parties opt in through mutual acceptance in the very first action. Consent is structural here, not a checkbox bolted on later.",
  ],
];

export default function CaseStudy() {
  return (
    <div className="w-full bg-bg-app">
      {/* ---------------------------------------------------------------- hero */}
      <header className={`${PAYTM_GRADIENT} w-full px-6 py-20 text-white sm:py-28`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Hackathon prototype
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">Paytm Bharosa</h1>
          <p className="mt-4 text-xl font-medium text-white/90">
            Digital udhaar, co-signed and visible to Paytm.
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/80">
            Small merchants run credit — <em>udhaar</em> — in paper notebooks. Paytm sees their
            settled payments but is blind to the receivable sitting in that book: the exact
            signal that decides whether a merchant qualifies for a loan. Bharosa brings the
            khata inside Paytm as a co-signed ledger between two people who already trust each
            other — and our AI reads the book they already keep instead of asking them to type
            it all again.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-paytm-navy transition hover:bg-white/90"
            >
              See it working ↓
            </a>
            <a
              href="#model"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              How the model works
            </a>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-white/60">
            Bharosa means trust. A merchant says <em>“main tumhe bharose pe de raha hoon”</em> —
            I am giving you this on trust — every time he opens a khata. That word is the whole
            product.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------- problem */}
      <section className="w-full px-6 py-20">
        <SectionHead eyebrow="The problem" title="Paytm cannot see the paper receivable">
          Kirana stores, chemists and salons extend credit every day and record it on paper.
          That receivable is the single best indicator of a merchant's real trade — and it is
          the one number Paytm's lending engine never gets to look at.
        </SectionHead>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
          <Card title="What Paytm sees">
            Settled UPI payments. Verified, timestamped, already feeding underwriting.
          </Card>
          <Card title="What Paytm misses" accent="border-bharosa-amber/40">
            The receivable in the notebook. Invisible to every system, so it counts for nothing
            when the merchant asks for working capital.
          </Card>
          <Card title="Who pays for that">
            The merchant with the fullest khata and the thinnest credit file. The most
            paper-committed merchants are the least digital — and so the least lendable.
          </Card>
        </div>

        <blockquote className="mx-auto mt-16 max-w-3xl border-l-4 border-paytm-blue pl-6">
          <p className="text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
            Khatabook replaces your notebook. Paytm Bharosa reads it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Replacement is why the incumbents plateau at the paper-committed merchant — it asks
            that merchant to do their bookkeeping twice. Reading the book is how we reach
            exactly that merchant, with months of history, in one photograph.
          </p>
        </blockquote>
      </section>

      {/* ---------------------------------------------------------------- demo */}
      <section
        id="demo"
        className="w-full scroll-mt-8 border-y border-border-gray bg-white px-6 py-20"
      >
        <SectionHead eyebrow="The prototype" title="Two phones, one live ledger">
          The merchant's Bharosa Book on the left, the customer's Paytm on the right, sharing
          one state. The handoff the product is actually about plays out across both screens
          with nothing to reload in between. It is a working prototype — tap it.
        </SectionHead>

        <ol className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.body} className="rounded-2xl border border-border-gray bg-bg-app p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paytm-navy text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-paytm-blue-dark">
                  {step.phone}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <DemoStage />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-text-secondary">
          The phones need roughly 900px of width to sit side by side; on a narrow screen they
          stack. Everything runs on in-memory state — no backend, no API keys.{" "}
          <Link href="/demo" className="font-medium text-paytm-blue-dark underline">
            Open the demo on its own
          </Link>{" "}
          for a full-screen run.
        </p>
      </section>

      {/* --------------------------------------------------------------- model */}
      <section id="model" className="w-full scroll-mt-8 px-6 py-20">
        <SectionHead eyebrow="The model" title="Two lanes into one lending signal">
          Paper onboards the merchant. Digital keeps them. The ledger migrates from one to the
          other on its own — and that migration is the product.
        </SectionHead>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-bharosa-amber/40 bg-white p-7">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-bharosa-amber" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-bharosa-amber">
                Paper lane · onboarding
              </h3>
            </div>
            <ol className="mt-5 space-y-3 text-sm leading-relaxed text-text-secondary">
              <li>The merchant keeps writing in the notebook they already trust.</li>
              <li>They photograph a page.</li>
              <li>AI reads the handwriting into structured entries.</li>
              <li>The merchant confirms the draft — nothing saves silently.</li>
              <li className="font-medium text-foreground">
                The merchant and their whole history are now inside Paytm.
              </li>
            </ol>
            <p className="mt-5 rounded-xl bg-bharosa-amber/10 px-4 py-3 text-xs leading-relaxed text-foreground">
              Unverified by design. This lane onboards — it does not underwrite.
            </p>
          </div>

          <div className="rounded-2xl border border-success/40 bg-white p-7">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-success">
                Digital lane · steady state
              </h3>
            </div>
            <ol className="mt-5 space-y-3 text-sm leading-relaxed text-text-secondary">
              <li>The customer scans the shop's QR to pay, exactly as they already do.</li>
              <li>Short this week, they tap Add Bharosa instead.</li>
              <li>The merchant accepts. Both sides have now signed.</li>
              <li>The entry is verified the moment it exists.</li>
              <li className="font-medium text-foreground">
                Every new udhaar lands here instead of on paper.
              </li>
            </ol>
            <p className="mt-5 rounded-xl bg-success/10 px-4 py-3 text-xs leading-relaxed text-foreground">
              Co-signed, so structurally unfakeable. This is the lane lending trusts.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-5xl rounded-2xl bg-paytm-navy px-7 py-6 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">
            Both lanes feed Paytm's lending engine
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
            Merchants start on paper — we read it to onboard them and their history. Every new
            udhaar moves to the digital co-signed flow. Over time the ledger migrates from
            unverified paper to verified digital, and that{" "}
            <strong className="font-semibold text-white">rising verified share</strong> is the
            clean lending signal Paytm has never had.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ ai */}
      <section className="w-full border-y border-border-gray bg-white px-6 py-20">
        <SectionHead eyebrow="Where the AI sits" title="Four touchpoints, all load-bearing">
          The test for an AI feature is whether removing it still leaves a product. Remove
          these and there is nothing left — the paper book never gets read, the reminder never
          gets spoken, and the merchant is back to a filter UI they will not learn.
        </SectionHead>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {AI_TOUCHPOINTS.map((t) => (
            <div key={t.title} className="rounded-2xl border border-border-gray bg-bg-app p-6">
              <h3 className="text-base font-semibold text-foreground">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t.body}</p>
              <Link
                href={t.route}
                className="mt-4 inline-block text-xs font-semibold text-paytm-blue-dark underline"
              >
                Open {t.route}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- trust */}
      <section className="w-full px-6 py-20">
        <SectionHead eyebrow="The trust model" title="Every entry records how it got there">
          This is not a detail of the schema — it is the fraud answer, and it is rendered on
          both phones. A merchant cannot fabricate the evidence the lending story rests on.
        </SectionHead>

        <div className="mx-auto mt-12 max-w-4xl overflow-x-auto">
          <table className="w-full min-w-[560px] overflow-hidden rounded-2xl border border-border-gray bg-white text-left">
            <thead>
              <tr className="bg-bg-app text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">How it got there</th>
                <th className="px-6 py-4">Lending signal</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.source} className="border-t border-border-gray">
                  <td className="px-6 py-5">
                    <code className="rounded-md bg-bg-app px-2 py-1 text-xs font-semibold text-foreground">
                      {s.source}
                    </code>
                  </td>
                  <td className="px-6 py-5 text-sm leading-relaxed text-text-secondary">{s.how}</td>
                  <td className={`px-6 py-5 text-sm font-medium ${s.tone}`}>
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
                      {s.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-text-secondary">
          Only <code className="text-foreground">digital_scan</code> is marked confirmed. The
          other two carry an <strong>“added by shop”</strong> badge on the merchant's screen and
          on the customer's, so the unverified lane stays visible to the person it would
          otherwise be used against.
        </p>
      </section>

      {/* ----------------------------------------------------------- why paytm */}
      <section className="w-full border-y border-border-gray bg-white px-6 py-20">
        <SectionHead eyebrow="Why inside Paytm" title="Two rails a standalone app cannot own">
          Being inside Paytm is not a distribution convenience. It is the only place where this
          receivable can be both verified and acted on.
        </SectionHead>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          <Card title="Cross-check against real UPI settlements">
            Before any reminder fires, the balance is checked against payments Paytm has
            actually settled — so a customer who already paid never gets chased. No standalone
            khata app can see that ledger.
          </Card>
          <Card title="Feed a lending engine that already runs">
            The verified receivable lands directly in underwriting Paytm operates today.
            Anywhere else it is a number in an app with nobody to lend against it.
          </Card>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-text-secondary">
          Paytm Bharosa is built to be absorbed into Paytm's merchant stack rather than to
          compete with it — an AI feature that reaches <em>new</em> data instead of
          re-presenting data Paytm already has.
        </p>
      </section>

      {/* ---------------------------------------------------------- edge cases */}
      <section className="w-full px-6 py-20">
        <SectionHead eyebrow="Pressure-testing it" title="The objections, answered">
          Naming the failure modes before someone else does is the difference between a demo
          and a product proposal.
        </SectionHead>
        <dl className="mx-auto mt-12 max-w-4xl divide-y divide-border-gray overflow-hidden rounded-2xl border border-border-gray bg-white">
          {EDGE_CASES.map(([question, answer]) => (
            <div
              key={question}
              className="grid gap-2 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:gap-8"
            >
              <dt className="flex items-start gap-2 text-sm font-semibold text-foreground">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-alert" />
                {question}
              </dt>
              <dd className="text-sm leading-relaxed text-text-secondary">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* --------------------------------------------------------------- close */}
      <footer className={`${PAYTM_GRADIENT} w-full px-6 py-20 text-white`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xl font-medium leading-relaxed sm:text-2xl">
            Bharosa turns the invisible paper receivable into a lending signal that helps
            India's smallest merchants reach credit they have already earned. We named it
            Bharosa because that trust between a shopkeeper and his customer is the whole
            product — we are just making it visible.
          </p>

          <div className="mt-12 border-t border-white/20 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Walk the prototype
            </p>
            <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/85">
              <Link href="/demo" className="underline hover:text-white">
                Both phones
              </Link>
              <Link href="/consumer" className="underline hover:text-white">
                Customer’s Paytm
              </Link>
              <Link href="/merchant" className="underline hover:text-white">
                Merchant’s book
              </Link>
              <Link href="/consumer/bharosa" className="underline hover:text-white">
                Customer’s khatas
              </Link>
              <Link href="/ocr" className="underline hover:text-white">
                Paper-book OCR
              </Link>
              <Link href="/chat" className="underline hover:text-white">
                Ledger chat
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
