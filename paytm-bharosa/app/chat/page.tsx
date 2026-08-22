"use client";

import { useState } from "react";
import { PaytmHeader } from "@/components/PaytmHeader";
import { useBharosa } from "@/context/BharosaContext";
import { MERCHANT_ID } from "@/lib/seed";
import { formatAmount } from "@/lib/format";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTED = [
  "Who owes me the most?",
  "What's my total outstanding?",
  "Who hasn't paid this month?",
];

export default function ChatPage() {
  const { getBharosaForMerchant, getBalance } = useBharosa();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function buildLedgerSummary(): string {
    const rows = getBharosaForMerchant(MERCHANT_ID)
      .map((b) => ({ name: b.customerName, balance: getBalance(b.id) }))
      .sort((a, b) => b.balance - a.balance);
    return rows.map((r) => `${r.name}: ${formatAmount(r.balance)}`).join("\n");
  }

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, ledger: buildLedgerSummary() }),
      }).then((r) => r.json());
      setMessages((prev) => [...prev, { role: "assistant", text: res.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't answer that right now." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <PaytmHeader title="Ask Bharosa" showBack />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="rounded-full border border-paytm-blue bg-paytm-blue/10 px-3 py-1.5 text-sm font-medium text-paytm-blue-dark"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-paytm-navy text-white"
                  : "bg-paytm-blue/10 text-foreground"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-paytm-blue/10 px-4 py-2.5 text-sm text-text-secondary">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex shrink-0 gap-2 border-t border-border-gray bg-white p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your bharosas…"
          className="flex-1 rounded-xl border border-border-gray px-3 py-2.5 text-sm outline-none focus:border-paytm-blue"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-paytm-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
