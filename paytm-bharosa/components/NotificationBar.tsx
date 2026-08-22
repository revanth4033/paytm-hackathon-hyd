"use client";

import {
  useNotifications,
  type AppNotification,
  type NotificationAudience,
  type NotificationTone,
} from "@/context/NotificationContext";

/**
 * The notification strip for one phone. Renders absolutely over the top of
 * whatever screen is showing, so an event never depends on the user happening
 * to be on the right screen to find out about it. Needs a `relative` ancestor
 * — the phone frame and both split panels provide one.
 */

const TONE_STYLES: Record<NotificationTone, { ring: string; dot: string }> = {
  success: { ring: "border-success/40", dot: "bg-success" },
  warning: { ring: "border-bharosa-amber/50", dot: "bg-bharosa-amber" },
  info: { ring: "border-paytm-blue/40", dot: "bg-paytm-blue" },
};

function Toast({
  notification,
  onDismiss,
}: {
  notification: AppNotification;
  onDismiss: () => void;
}) {
  const tone = TONE_STYLES[notification.tone];

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-2.5 rounded-2xl border bg-[#101010]/95 p-3 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur ${tone.ring}`}
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-snug text-white">{notification.title}</p>
        {notification.body && (
          <p className="mt-0.5 text-[12px] leading-snug text-white/65">{notification.body}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-white/40 hover:text-white/80"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function NotificationBar({ audience }: { audience: NotificationAudience }) {
  const { visibleFor, dismiss } = useNotifications();
  const items = visibleFor(audience);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex flex-col gap-2 p-3">
      {items.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={() => dismiss(notification.id)}
        />
      ))}
    </div>
  );
}
