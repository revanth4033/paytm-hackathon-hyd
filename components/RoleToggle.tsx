"use client";

import { useRouter } from "next/navigation";
import { useBharosa } from "@/context/BharosaContext";

export function RoleToggle() {
  const { currentRole, switchRole } = useBharosa();
  const router = useRouter();

  function select(role: "merchant" | "customer") {
    switchRole(role);
    router.push(role === "merchant" ? "/merchant" : "/customer");
  }

  return (
    <div className="flex shrink-0 rounded-full bg-white/15 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => select("merchant")}
        className={`rounded-full px-3 py-1 transition-colors ${
          currentRole === "merchant" ? "bg-white text-paytm-navy" : "text-white/90"
        }`}
      >
        Merchant
      </button>
      <button
        type="button"
        onClick={() => select("customer")}
        className={`rounded-full px-3 py-1 transition-colors ${
          currentRole === "customer" ? "bg-white text-paytm-navy" : "text-white/90"
        }`}
      >
        Customer
      </button>
    </div>
  );
}
