"use client";

import Link from "next/link";
import { useLivePolling } from "@/lib/use-live-polling";
import { useDraftStore } from "@/lib/store";
import { MatchStatusBadge } from "@/components/match-status-badge";

function formatKickoff(kickoff: string): string {
  return new Date(kickoff).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ScoresPage() {
  useLivePolling();

  const matches = useDraftStore((state) => state.matches);
  const goalEvents = useDraftStore((state) => state.goalEvents);
  const participants = useDraftStore((state) => state.participants);

  const groupToParticipant = new Map(participants.map((p) => [p.group, p]));

  const liveMatches = matches
    .filter((m) => m.status === "live")
    .sort((a, b) => (b.minute ?? 0) - (a.minute ?? 0));

  const recentMatches = matches
    .filter((m) => m.status === "completed" || m.status === "live")
    .sort((a, b) => b.kickoff.localeCompare(a.kickoff));

  return (
    <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-8">
      <h1 className="text-xl font-extrabold sm:text-2xl">Latest Scores</h1>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Every result and live score the app currently has, most recent first.
      </p>

      {liveMatches.length > 0 && (
        <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 p-3 shadow-sm dark:border-rose-800 dark:bg-rose-950/30">
          <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-400">
            <span className="size-1.5 animate-pulse rounded-full bg-rose-600 dark:bg-rose-400" />
            Live now
          </h2>
          <p className="mt-1 text-sm font-semibold">
            {liveMatches.length} match{liveMatches.length === 1 ? "" : "es"} in progress
          </p>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {recentMatches.length === 0 && (
          <p className="text-sm text-muted-foreground">No results yet — check back once the group stage kicks off.</p>
        )}

        {recentMatches.map((match) => {
          const goals = goalEvents
            .filter((g) => g.matchId === match.id)
            .sort((a, b) => a.minute - b.minute);
          const participant = groupToParticipant.get(match.group);

          return (
            <div key={match.id} className="rounded-2xl border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  Group {match.group}
                  {participant && (
                    <>
                      ·{" "}
                      <Link
                        href={`/participant/${participant.id}`}
                        className="font-semibold text-violet-600 dark:text-violet-400"
                      >
                        {participant.name}
                      </Link>
                    </>
                  )}
                  · {formatKickoff(match.kickoff)}
                </span>
                <MatchStatusBadge status={match.status} minute={match.minute} />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="flex-1 truncate text-sm font-semibold">{match.homeTeam}</span>
                <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-base font-extrabold tabular-nums">
                  {match.homeScore ?? "–"} : {match.awayScore ?? "–"}
                </span>
                <span className="flex-1 truncate text-right text-sm font-semibold">
                  {match.awayTeam}
                </span>
              </div>

              {goals.length > 0 && (
                <p className="mt-2 truncate text-[11px] text-muted-foreground">
                  ⚽ {goals.map((g) => `${g.team} ${g.minute}'`).join(", ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
