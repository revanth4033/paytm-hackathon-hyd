"use client";

import { useParams, useRouter } from "next/navigation";
import { PayScreen } from "@/components/consumer/PayScreen";
import { getMerchantById } from "@/lib/seed";

export default function ConsumerPayPage() {
  const router = useRouter();
  const { merchantId } = useParams<{ merchantId: string }>();
  const merchantName = getMerchantById(merchantId)?.name ?? "Merchant";

  return (
    <PayScreen
      merchantId={merchantId}
      merchantName={merchantName}
      onBack={() => router.back()}
      onDone={(destination) =>
        router.push(destination === "bharosa" ? `/consumer/bharosa/${merchantId}` : "/consumer")
      }
    />
  );
}
