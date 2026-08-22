import { USE_MOCK } from "@/lib/ai/config";
import { extractEntriesFromImage, mockOcrEntries } from "@/lib/ai/llm";

const SUPPORTED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number];

function isSupportedMediaType(value: string): value is SupportedMediaType {
  return (SUPPORTED_MEDIA_TYPES as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  const { image, mediaType } = (await request.json()) as { image: string; mediaType?: string };

  if (!image) {
    return Response.json({ error: "image (base64) is required" }, { status: 400 });
  }

  if (USE_MOCK.ocr) {
    return Response.json({ entries: mockOcrEntries(), mocked: true });
  }

  const resolvedMediaType = isSupportedMediaType(mediaType ?? "") ? (mediaType as SupportedMediaType) : "image/jpeg";

  try {
    const entries = await extractEntriesFromImage(image, resolvedMediaType);
    return Response.json({ entries, mocked: false });
  } catch {
    return Response.json({ entries: mockOcrEntries(), mocked: true });
  }
}
