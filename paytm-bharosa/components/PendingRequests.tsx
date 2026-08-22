"use client";

import { Avatar } from "./Avatar";
import { useBharosa } from "@/context/BharosaContext";
import { useNotifications } from "@/context/NotificationContext";
import { formatAmount } from "@/lib/format";

interface PendingRequestsProps {
  merchantId: string;
}

/**
 * Incoming Bharosa requests on the merchant's phone. Accepting opens the
 * relationship; declining removes it outright along with the provisional first
 * purchase, so a refused customer is never left looking at a debt. Both
 * outcomes notify the customer — a request that silently vanished would be
 * indistinguishable from one still waiting.
 */
export function PendingRequests({ merchantId }: PendingRequestsProps) {
  const { getPendingRequestsForMerchant, acceptBharosaRequest, declineBharosaRequest, getBalance } =
    useBharosa();
  const { notify } = useNotifications();
  const pending = getPendingRequestsForMerchant(merchantId);

  if (pending.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {pending.map((bharosa) => {
        const firstPurchase = getBalance(bharosa.id);

        function handleAccept() {
          acceptBharosaRequest(bharosa.id);
          notify({
            audience: "merchant",
            tone: "success",
            title: `Bharosa opened with ${bharosa.customerName}`,
            body: firstPurchase > 0 ? `${formatAmount(firstPurchase)} added to their khata` : undefined,
          });
          notify({
            audience: "consumer",
            tone: "success",
            title: `${bharosa.merchantName} accepted your Bharosa`,
            body:
              firstPurchase > 0
                ? `${formatAmount(firstPurchase)} is now on your khata`
                : "You can now add purchases to your khata",
          });
        }

        function handleDecline() {
          declineBharosaRequest(bharosa.id);
          notify({
            audience: "merchant",
            tone: "info",
            title: `Declined ${bharosa.customerName}'s request`,
          });
          notify({
            audience: "consumer",
            tone: "warning",
            title: `${bharosa.merchantName} declined your Bharosa request`,
            body: "Nothing was added to your khata. You can pay as usual.",
          });
        }

        return (
          <div
            key={bharosa.id}
            className="flex flex-col gap-2.5 rounded-2xl border border-bharosa-amber/40 bg-bharosa-amber/10 p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar name={bharosa.customerName} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {bharosa.customerName}
                </p>
                <p className="text-xs text-text-secondary">
                  wants to open a Bharosa
                  {firstPurchase > 0 && ` — ${formatAmount(firstPurchase)} first purchase`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 rounded-lg bg-paytm-navy px-3 py-2 text-xs font-semibold text-white"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 rounded-lg border border-border-gray bg-white px-3 py-2 text-xs font-semibold text-text-secondary"
              >
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
