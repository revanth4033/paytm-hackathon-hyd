"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PaytmHeader } from "@/components/PaytmHeader";
import { useBharosa } from "@/context/BharosaContext";
import { useNotifications } from "@/context/NotificationContext";
import { MERCHANT_ID } from "@/lib/seed";
import { formatAmount } from "@/lib/format";
import type { OcrExtractedEntry } from "@/lib/ai/llm";

type Stage = "select" | "reading" | "review" | "done";

const SAMPLE_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export default function OcrPage() {
  const router = useRouter();
  const { getBharosaForMerchant, addEntry } = useBharosa();
  const { notify } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customers = getBharosaForMerchant(MERCHANT_ID);
  const [customerId, setCustomerId] = useState(customers[0]?.customerId ?? "");
  const [stage, setStage] = useState<Stage>("select");
  const [entries, setEntries] = useState<OcrExtractedEntry[]>([]);
  const [error, setError] = useState("");

  const selectedBharosa = customers.find((c) => c.customerId === customerId);

  async function runOcr(base64: string, mediaType: string) {
    setStage("reading");
    setError("");
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      }).then((r) => r.json());
      setEntries(res.entries ?? []);
      setStage("review");
    } catch {
      setError("Couldn't read the page. Try again.");
      setStage("select");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      runOcr(base64, file.type || "image/jpeg");
    };
    reader.readAsDataURL(file);
  }

  function handleUseSample() {
    runOcr(SAMPLE_IMAGE_BASE64, "image/png");
  }

  function handleConfirm() {
    if (!selectedBharosa) return;
    entries.forEach((entry) => {
      addEntry(selectedBharosa.id, entry.amount, entry.description, "ocr");
    });
    // The PRD's rule for the paper lane: OCR entries are the merchant's claim,
    // so the customer is notified to review rather than asked to co-sign.
    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    notify({
      audience: "consumer",
      tone: "warning",
      title: `${selectedBharosa.merchantName} added ${entries.length} ${
        entries.length === 1 ? "entry" : "entries"
      } from their paper book`,
      body: `${formatAmount(total)} total — please review for anything misread`,
    });
    notify({
      audience: "merchant",
      tone: "success",
      title: `${entries.length} ${entries.length === 1 ? "entry" : "entries"} added to ${
        selectedBharosa.customerName
      }'s khata`,
      body: `${formatAmount(total)} from the paper book — customer notified`,
    });
    setStage("done");
  }

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title="Scan Paper Book" showBack accent />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {stage === "select" && (
          <>
            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Whose paper page is this?</p>
              <div className="flex flex-wrap gap-2">
                {customers.map((c) => (
                  <button
                    key={c.customerId}
                    type="button"
                    onClick={() => setCustomerId(c.customerId)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                      customerId === c.customerId
                        ? "border-paytm-navy bg-paytm-navy text-white"
                        : "border-border-gray bg-white text-text-secondary"
                    }`}
                  >
                    {c.customerName}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-bharosa-amber bg-bharosa-amber/5 p-8 text-center">
              <p className="text-sm font-medium text-text-secondary">Scan your paper book</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-paytm-navy px-4 py-3 text-sm font-semibold text-white"
              >
                Take photo / upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleUseSample}
                className="text-sm font-medium text-paytm-blue-dark underline-offset-2 hover:underline"
              >
                Use sample photo
              </button>
            </div>

            {error && <p className="text-center text-sm text-alert">{error}</p>}
          </>
        )}

        {stage === "reading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-bharosa-amber border-t-transparent" />
            <p className="text-sm text-text-secondary">Reading your book…</p>
          </div>
        )}

        {stage === "review" && (
          <>
            <p className="text-sm font-medium text-foreground">
              Found {entries.length} {entries.length === 1 ? "entry" : "entries"} — confirm to add
            </p>
            <div className="rounded-2xl border border-border-gray bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border-gray py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{entry.description}</span>
                    <span className="rounded-full bg-bharosa-amber/15 px-1.5 py-0.5 text-[10px] font-semibold text-bharosa-amber">
                      OCR
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-paytm-navy">
                    + {formatAmount(entry.amount)}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full rounded-xl bg-paytm-navy px-4 py-3 text-sm font-semibold text-white"
            >
              Add to Bharosa
            </button>
          </>
        )}

        {stage === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-success">
              {entries.length} entries added to {selectedBharosa?.customerName}&apos;s bharosa.
            </p>
            <p className="text-xs text-text-secondary">
              They&apos;ll be notified — the customer confirms nothing was misread.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/merchant/${customerId}`)}
              className="rounded-xl bg-paytm-navy px-4 py-3 text-sm font-semibold text-white"
            >
              View bharosa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
