"use client";

import { useEffect, useRef } from "react";
import type { Lang } from "@/lib/types";

const LANG_LABEL: Record<Lang, string> = { hi: "Hindi", te: "Telugu", en: "English" };
const SPEECH_LOCALE: Record<Lang, string> = { hi: "hi-IN", te: "te-IN", en: "en-IN" };

interface VoicePlayerProps {
  text: string;
  audioUrl: string | null;
  lang: Lang;
}

export function VoicePlayer({ text, audioUrl, lang }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function play() {
    if (audioUrl) {
      audioRef.current?.play().catch(() => {});
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEECH_LOCALE[lang];
      window.speechSynthesis.speak(utterance);
    }
  }

  useEffect(() => {
    // Best-effort autoplay — browsers may block audio without a fresh user
    // gesture, so the Play button below is the reliable trigger.
    play();
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, audioUrl, lang]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-paytm-blue/30 bg-paytm-blue/5 p-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-paytm-blue/15 px-2.5 py-0.5 text-xs font-semibold text-paytm-blue-dark">
          {LANG_LABEL[lang]}
        </span>
        <span className="text-xs font-medium text-success">Reminder sent</span>
      </div>
      <p className="text-sm text-foreground">{text}</p>
      <button
        type="button"
        onClick={play}
        className="flex items-center justify-center gap-2 rounded-xl bg-paytm-navy px-4 py-2.5 text-sm font-semibold text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        Play voice note
      </button>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}
    </div>
  );
}
