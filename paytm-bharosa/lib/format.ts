export function formatAmount(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const AVATAR_COLORS = [
  "#00BAF2",
  "#002970",
  "#F5A623",
  "#21C17A",
  "#6B7280",
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function daysSince(timestamp: number): number {
  return Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
}

export type AgeingLevel = "normal" | "ageing" | "overdue";

/**
 * Ageing reflects how long a balance has gone unpaid — days since the last
 * payment (or since the bharosa opened, if it's never been paid down).
 * New charges don't reset this: buying more on credit isn't repayment.
 */
export function ageingLevel(daysSinceLastPayment: number): AgeingLevel {
  if (daysSinceLastPayment >= 25) return "overdue";
  if (daysSinceLastPayment >= 10) return "ageing";
  return "normal";
}

export function ageingColorClass(level: AgeingLevel): string {
  switch (level) {
    case "overdue":
      return "text-alert";
    case "ageing":
      return "text-bharosa-amber";
    default:
      return "text-paytm-navy";
  }
}
