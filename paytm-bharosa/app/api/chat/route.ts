import { USE_MOCK } from "@/lib/ai/config";
import { answerLedgerQuestion, mockChatAnswer } from "@/lib/ai/llm";

export async function POST(request: Request) {
  const { question, ledger } = (await request.json()) as { question: string; ledger: string };

  if (!question || !ledger) {
    return Response.json({ error: "question and ledger are required" }, { status: 400 });
  }

  if (USE_MOCK.chat) {
    return Response.json({ answer: mockChatAnswer(question, ledger), mocked: true });
  }

  try {
    const answer = await answerLedgerQuestion(question, ledger);
    return Response.json({ answer, mocked: false });
  } catch {
    return Response.json({ answer: mockChatAnswer(question, ledger), mocked: true });
  }
}
