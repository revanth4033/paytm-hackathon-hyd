import type { Lang } from "@/lib/types";
import { USE_MOCK } from "@/lib/ai/config";
import { synthesizeSpeech } from "@/lib/ai/sarvam";

export async function POST(request: Request) {
  const { text, lang } = (await request.json()) as { text: string; lang: Lang };

  if (!text || !lang) {
    return Response.json({ error: "text and lang are required" }, { status: 400 });
  }

  if (USE_MOCK.tts) {
    // No pre-recorded asset shipped — the client falls back to the browser's
    // built-in speech synthesis when audioUrl is null, so the demo still speaks
    // without needing a bundled audio file or an AI provider.
    return Response.json({ audioUrl: null, mocked: true });
  }

  try {
    const audioUrl = await synthesizeSpeech(text, lang);
    return Response.json({ audioUrl, mocked: false });
  } catch {
    return Response.json({ audioUrl: null, mocked: true });
  }
}
