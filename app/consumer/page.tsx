"use client";

import { useRouter } from "next/navigation";
import { PaytmHome } from "@/components/consumer/PaytmHome";

export default function ConsumerHomePage() {
  const router = useRouter();

  return (
    <PaytmHome
      onScan={() => router.push("/consumer/scan")}
      onBharosa={() => router.push("/consumer/bharosa")}
    />
  );
}
