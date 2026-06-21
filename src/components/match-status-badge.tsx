import type { MatchStatus } from "@/lib/types";

export function MatchStatusBadge({ status, minute }: { status: MatchStatus; minute: number | null }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
        <span className="size-1.5 animate-pulse rounded-full bg-rose-600 dark:bg-rose-400" />
        {minute ? `${minute}'` : "LIVE"}
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
        FT
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
      UPCOMING
    </span>
  );
}
