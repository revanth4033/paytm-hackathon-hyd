"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { VoicePlayer } from "./VoicePlayer";
import { useNotifications } from "@/context/NotificationContext";
import { formatAmount } from "@/lib/format";

interface ReminderButtonProps {
  customerName: string;
  amount: number;
  lang: Lang;
  merchantName: string;
}

type State = "idle" | "loading" | "ready" | "error";

const LANG_LABELS: Record<Lang, string> = { hi: "Hindi", te: "Telugu", en: "English" };

export function ReminderButton({ customerName, amount, lang, merchantName }: ReminderButtonProps) {
  const { notify } = useNotifications();
  const [state, setState] = useState<State>("idle");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function handleSend() {
    setState("loading");
    try {
      const reminderRes = await fetch("/api/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customerName, amount, lang }),
      }).then((r) => r.json());

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reminderRes.text, lang }),
      }).then((r) => r.json());

      setText(reminderRes.text);
      setAudioUrl(ttsRes.audioUrl ?? null);
      setState("ready");
      // A reminder the customer never sees isn't a reminder. It lands on
      // their phone the moment the merchant sends it.
      notify({
        audience: "consumer",
        tone: "warning",
        title: `Reminder from ${merchantName}`,
        body: `${formatAmount(amount)} outstanding on your khata`,
      });
      notify({
        audience: "merchant",
        tone: "success",
        title: `Reminder sent to ${customerName}`,
        body: `Voice note in ${LANG_LABELS[lang]}`,
      });
    } catch {
      setState("error");
    }
  }

  if (state === "ready") {
    return <VoicePlayer text={text} audioUrl={audioUrl} lang={lang} />;
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleSend}
        disabled={state === "loading"}
        className="w-full rounded-xl border border-paytm-blue bg-paytm-blue/10 px-4 py-3 text-sm font-semibold text-paytm-blue-dark disabled:opacity-60"
      >
        {state === "loading" ? "Sending…" : "Send Reminder"}
      </button>
      {state === "error" && (
        <p className="text-center text-xs text-alert">Couldn&apos;t send reminder. Try again.</p>
      )}
    </div>
  );
}
