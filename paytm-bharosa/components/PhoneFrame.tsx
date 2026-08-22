"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NotificationBar } from "./NotificationBar";
import { PhoneShell, PAYTM_STATUS_BAR } from "./PhoneShell";
import type { NotificationAudience } from "@/context/NotificationContext";

/**
 * Wraps every route in the iPhone mockup, except the side-by-side pages — the
 * landing screen at "/" and /test/* — which draw their own two phones and need
 * the full viewport width. The check on "/" is exact: startsWith would match
 * every route.
 */

interface Chrome {
  audience: NotificationAudience;
  screen: string;
  statusBar: string;
}

/**
 * Which side of the Bharosa this route is (so the phone only shows the
 * notifications addressed to it), and what sits directly under the clock. iOS
 * carries the top-most surface colour up behind the status bar, so a screen
 * whose header is the Paytm gradient must paint that gradient there too —
 * otherwise a white band floats above the header.
 */
function chromeFor(pathname: string | null): Chrome {
  const isMerchant =
    pathname?.startsWith("/merchant") ||
    pathname?.startsWith("/ocr") ||
    pathname?.startsWith("/chat");

  if (isMerchant) {
    return { audience: "merchant", screen: "bg-white", statusBar: PAYTM_STATUS_BAR };
  }

  // The customer's Paytm is black; its Bharosa screens keep the black body but
  // put the gradient header on top. /customer and /setup are the older
  // role-toggle screens and are light throughout.
  if (pathname?.startsWith("/consumer/bharosa")) {
    return { audience: "consumer", screen: "bg-[#0c0c0c]", statusBar: PAYTM_STATUS_BAR };
  }
  if (pathname?.startsWith("/consumer")) {
    return { audience: "consumer", screen: "bg-black", statusBar: "" };
  }
  return { audience: "consumer", screen: "bg-white", statusBar: PAYTM_STATUS_BAR };
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = pathname === "/" || pathname?.startsWith("/test");

  if (isFullWidth) {
    return <>{children}</>;
  }

  const { audience, screen, statusBar } = chromeFor(pathname);

  return (
    <div className="flex min-h-screen w-full max-w-[460px] flex-col items-center bg-bg-app py-8">
      <PhoneShell
        tone="dark"
        screenClassName={screen}
        statusBarClassName={statusBar}
        indicatorTone={screen === "bg-white" ? "light" : "dark"}
      >
        <NotificationBar audience={audience} />
        {children}
      </PhoneShell>
    </div>
  );
}
