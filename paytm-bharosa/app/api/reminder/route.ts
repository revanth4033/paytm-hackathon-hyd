import type { Lang } from "@/lib/types";
import { USE_MOCK } from "@/lib/ai/config";
import { generateReminderText, mockReminderText } from "@/lib/ai/llm";

export async function POST(request: Request) {
  const { name, amount, lang } = (await request.json()) as {
    name: string;
    amount: number;
    lang: Lang;
  };

  if (!name || !amount || !lang) {
    return Response.json({ error: "name, amount, and lang are required" }, { status: 400 });
  }

  if (USE_MOCK.reminder) {
    return Response.json({ text: mockReminderText(name, amount), mocked: true });
  }

  try {
    const text = await generateReminderText({ customerName: name, amount, lang });
    return Response.json({ text, mocked: false });
  } catch {
    return Response.json({ text: mockReminderText(name, amount), mocked: true });
  }
}
