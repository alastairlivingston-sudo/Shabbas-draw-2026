"use client";

import { useEffect, useState } from "react";

function formatRelative(syncedAt: string | null): string {
  if (!syncedAt) return "Not synced";
  const diffMs = Date.now() - new Date(syncedAt).getTime();
  const diffSec = Math.max(0, Math.round(diffMs / 1000));
  if (diffSec < 10) return "Synced now";
  if (diffSec < 60) return `Synced ${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `Synced ${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `Synced ${diffHr}h ago`;
}

export function LastSyncedBadge({ syncedAt }: { syncedAt: string | null }) {
  const [label, setLabel] = useState(() => formatRelative(syncedAt));

  useEffect(() => {
    setLabel(formatRelative(syncedAt));
    const interval = setInterval(() => setLabel(formatRelative(syncedAt)), 15_000);
    return () => clearInterval(interval);
  }, [syncedAt]);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
      <span
        className={`size-1.5 rounded-full ${syncedAt ? "bg-emerald-500" : "bg-muted-foreground"}`}
      />
      {label}
    </span>
  );
}
