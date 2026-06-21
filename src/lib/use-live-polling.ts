"use client";

import { useEffect } from "react";
import { useDraftStore } from "@/lib/store";

const POLL_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_LIVE_POLL_INTERVAL_MS ?? 60_000);

export function useLivePolling() {
  const applyLiveUpdate = useDraftStore((state) => state.applyLiveUpdate);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/live");
        if (!res.ok) return;
        const update = await res.json();
        if (!cancelled) applyLiveUpdate(update);
      } catch {
        // fail soft — keep showing last-known state
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [applyLiveUpdate]);
}
