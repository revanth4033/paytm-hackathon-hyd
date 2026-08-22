function flag(name: string): boolean {
  return process.env[name] !== "false";
}

/** Each touchpoint defaults to mocked so the demo runs with zero API keys. Flip via .env.local. */
export const USE_MOCK = {
  reminder: flag("USE_MOCK_REMINDER"),
  tts: flag("USE_MOCK_TTS"),
  ocr: flag("USE_MOCK_OCR"),
  chat: flag("USE_MOCK_CHAT"),
};
