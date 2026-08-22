import type { Lang } from "@/lib/types";

const LANG_CODE: Record<Lang, string> = {
  hi: "hi-IN",
  te: "te-IN",
  en: "en-IN",
};

interface SarvamTtsResponse {
  request_id: string;
  audios: string[]; // base64-encoded WAV
}

/** Returns a data: URL playable directly in an <audio> element. */
export async function synthesizeSpeech(text: string, lang: Lang): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error("SARVAM_API_KEY is not set");

  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey,
    },
    body: JSON.stringify({
      text,
      language_code: LANG_CODE[lang],
      model: "bulbul:v2",
      output_audio_codec: "wav",
    }),
  });

  if (!res.ok) {
    throw new Error(`Sarvam TTS failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as SarvamTtsResponse;
  const audio = data.audios[0];
  if (!audio) throw new Error("Sarvam TTS returned no audio");
  return `data:audio/wav;base64,${audio}`;
}
