import Anthropic from "@anthropic-ai/sdk";
import type { Lang } from "@/lib/types";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

const LANG_NAME: Record<Lang, string> = { hi: "Hindi", te: "Telugu", en: "English" };

export interface OcrExtractedEntry {
  description: string;
  amount: number;
}

export function mockReminderText(customerName: string, amount: number): string {
  return `Hi ${customerName}, your outstanding balance of ₹${amount} is due. Please settle at your convenience.`;
}

export async function generateReminderText(params: {
  customerName: string;
  amount: number;
  lang: Lang;
}): Promise<string> {
  const { customerName, amount, lang } = params;
  const response = await getClient().messages.create({
    model: "claude-opus-5",
    max_tokens: 300,
    system:
      "You write short, polite payment reminder messages for a kirana (small grocery) merchant to send a regular customer over a shared credit ledger app called Paytm Bharosa. Keep it warm, respectful, and brief (1-2 sentences). Reply with only the message text in the requested language — no preamble, no quotes, no translation.",
    messages: [
      {
        role: "user",
        content: `Write a polite payment reminder in ${LANG_NAME[lang]} for ${customerName}, who owes ₹${amount}.`,
      },
    ],
  });
  const block = response.content.find((b) => b.type === "text");
  return block && block.type === "text"
    ? block.text.trim()
    : mockReminderText(customerName, amount);
}

export function mockOcrEntries(): OcrExtractedEntry[] {
  return [
    { description: "Rice 5kg", amount: 260 },
    { description: "Cooking oil 1L", amount: 155 },
    { description: "Atta 10kg", amount: 380 },
    { description: "Sugar 2kg", amount: 92 },
    { description: "Biscuits", amount: 40 },
  ];
}

export async function extractEntriesFromImage(
  base64Image: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<OcrExtractedEntry[]> {
  const response = await getClient().messages.create({
    model: "claude-opus-5",
    max_tokens: 1000,
    system:
      'You read handwritten Indian kirana (grocery store) udhaar/credit notebook pages, which may mix Hindi, Telugu, or English scripts and Devanagari/Telugu numerals. Extract every line item as {"description": string, "amount": number}. Respond with ONLY a JSON array — no prose, no markdown fences.',
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Image } },
          { type: "text", text: "Extract every credit entry from this paper udhaar page as a JSON array." },
        ],
      },
    ],
  });
  const block = response.content.find((b) => b.type === "text");
  const raw = block && block.type === "text" ? block.text.trim() : "[]";
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("OCR response was not a JSON array");
  return parsed.map((e) => ({
    description: String(e.description ?? "Item"),
    amount: Number(e.amount) || 0,
  }));
}

export function mockChatAnswer(question: string, ledgerSummary: string): string {
  const q = question.toLowerCase();
  const lines = ledgerSummary.split("\n").filter(Boolean);
  const first = lines[0]?.split(":")[0]?.trim();
  if (q.includes("most") || q.includes("highest")) {
    return first ? `${first} owes the most.` : "No customers found.";
  }
  if (q.includes("total")) {
    return "Check the Total outstanding card at the top of Bharosa Book for the exact figure.";
  }
  return "I can answer questions like “Who owes me the most?” or “What's my total outstanding?”";
}

export async function answerLedgerQuestion(question: string, ledgerSummary: string): Promise<string> {
  const response = await getClient().messages.create({
    model: "claude-opus-5",
    max_tokens: 500,
    system:
      "You are a helpful assistant for a kirana merchant using Paytm Bharosa, a udhaar (credit) ledger app. Answer the merchant's question using ONLY the ledger data provided below. Be concise (1-3 sentences). Use ₹ for amounts.",
    messages: [
      {
        role: "user",
        content: `Ledger data:\n${ledgerSummary}\n\nQuestion: ${question}`,
      },
    ],
  });
  const block = response.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text.trim() : mockChatAnswer(question, ledgerSummary);
}
