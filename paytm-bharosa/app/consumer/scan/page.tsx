"use client";

import { useRouter } from "next/navigation";
import { ScannerScreen } from "@/components/consumer/ScannerScreen";
import { MERCHANT_ID, MERCHANT_NAME } from "@/lib/seed";

/** Tapping "Scan any QR" lands here first, exactly as it does in the real app,
 *  instead of jumping straight to the amount keypad. */
export default function ConsumerScanPage() {
  const router = useRouter();

  return (
    <ScannerScreen
      merchantName={MERCHANT_NAME}
      onBack={() => router.back()}
      onScanned={() => router.push(`/consumer/pay/${MERCHANT_ID}`)}
    />
  );
}
