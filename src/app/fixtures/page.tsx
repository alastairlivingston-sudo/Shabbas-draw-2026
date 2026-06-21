"use client";

import { useState } from "react";
import { useLivePolling } from "@/lib/use-live-polling";
import { useDraftStore } from "@/lib/store";
import { getTeamGoalTotals } from "@/lib/team-stats";
import { MatchStatusBadge } from "@/components/match-status-badge";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

function formatKickoff(kickoff: string): string {
  return new Date(kickoff).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function FixturesPage() {
  useLivePolling();

  const matches = useDraftStore((state) => state.matches);
  const goalEvents = useDraftStore((state) => state.goalEvents);
  const [group, setGroup] = useState("A");

  const groupMatches = matches
    .filter((m) => m.group === group)
    .sort((a, b) => a.matchday - b.matchday || a.kickoff.localeCompare(b.kickoff));
  const teamTotals = getTeamGoalTotals(group, matches);

  return (
    <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-8">
      <h1 className="text-xl font-extrabold sm:text-2xl">Fixtures &amp; Results</h1>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Group-stage matches and team goal totals feeding the leaderboard.
      </p>

      <div className="mt-4 -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:-mx-4 sm:px-4">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
              g === group
                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            Group {g}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border bg-card p-3 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Team goals
        </h2>
        <div className="mt-2 space-y-1.5">
          {teamTotals.map((t) => (
            <div key={t.team} className="flex items-center justify-between text-sm">
              <span className="font-medium">{t.team}</span>
              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{t.played} played</span>
                <span className="text-base font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {t.goals}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {groupMatches.map((match) => {
          const goals = goalEvents
            .filter((g) => g.matchId === match.id)
            .sort((a, b) => a.minute - b.minute);

          return (
            <div key={match.id} className="rounded-2xl border bg-card p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Matchday {match.matchday} · {formatKickoff(match.kickoff)}
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
