"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * In-app notifications, addressed to a side of the Bharosa rather than
 * broadcast. Both phones are on screen at once in the split view, so
 * "Priya wants to open a Bharosa" has to land on the merchant's phone and
 * "your Bharosa was accepted" on the customer's — a single global toast
 * would show each message on the wrong device half the time.
 *
 * Deliberately NOT wired into BharosaContext's mutators: those are called
 * from both panels and from the standalone routes, so the emitting side
 * can't be inferred there. Callers notify, because only they know who acted.
 */

export type NotificationAudience = "merchant" | "consumer";
export type NotificationTone = "info" | "success" | "warning";

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  title: string;
  body?: string;
  tone: NotificationTone;
  timestamp: number;
}

/** Long enough to read a two-line message without hunting for a dismiss. */
const AUTO_DISMISS_MS = 6000;
/** Older messages stay in the tray but stop stacking over the screen. */
const MAX_VISIBLE = 3;

interface NotificationContextValue {
  notifications: AppNotification[];
  notify: (notification: Omit<AppNotification, "id" | "timestamp">) => void;
  dismiss: (id: string) => void;
  /** Newest first, capped at MAX_VISIBLE — what the bar actually renders. */
  visibleFor: (audience: NotificationAudience) => AppNotification[];
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

let notificationSeq = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback<NotificationContextValue["notify"]>((notification) => {
    notificationSeq += 1;
    const id = `n-${notificationSeq}`;
    setNotifications((prev) => [
      ...prev,
      { ...notification, id, timestamp: Date.now() },
    ]);
    timers.current.set(
      id,
      setTimeout(() => {
        timers.current.delete(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, AUTO_DISMISS_MS)
    );
  }, []);

  // Timers outlive the notification list, so clear them on teardown rather
  // than leaving them to fire against an unmounted provider.
  const timersRef = timers;
  useEffect(() => {
    const map = timersRef.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, [timersRef]);

  const visibleFor = useCallback(
    (audience: NotificationAudience) =>
      notifications
        .filter((n) => n.audience === audience)
        .slice(-MAX_VISIBLE)
        .reverse(),
    [notifications]
  );

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, notify, dismiss, visibleFor }),
    [notifications, notify, dismiss, visibleFor]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return ctx;
}
