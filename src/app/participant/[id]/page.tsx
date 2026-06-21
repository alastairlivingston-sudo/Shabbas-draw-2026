"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useLivePolling } from "@/lib/use-live-polling";
import { useDraftStore } from "@/lib/store";
import { getTeamGoalTotals } from "@/lib/team-stats";
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

export default function ParticipantPage() {
  useLivePolling();

  const params = useParams<{ id: string }>();
  const participants = useDraftStore((state) => state.participants);
  const matches = useDraftStore((state) => state.matches);
  const goalEvents = useDraftStore((state) => state.goalEvents);

  const participant = participants.find((p) => p.id === params.id);
  if (!participant) notFound();

  const groupMatches = matches
    .filter((m) => m.group === participant.group)
    .sort((a, b) => a.matchday - b.matchday || a.kickoff.localeCompare(b.kickoff));
  const teamTotals = getTeamGoalTotals(participant.group, matches);
  const totalGoals = teamTotals.reduce((sum, t) => sum + t.goals, 0);

  return (
    <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-8">
      <Link href="/" className="text-xs font-medium text-violet-600 dark:text-violet-400">
        ← Back to leaderboard
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-extrabold text-white">
          {participant.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold sm:text-2xl">{participant.name}</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Group {participant.group} · {participant.countries.join(", ")}
          </p>
        </div>
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
        <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm font-semibold">
          <span>Group total</span>
          <span className="text-base font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
            {totalGoals}
          </span>
        </div>
      </div>

      <h2 className="mt-5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Results
      </h2>
      <div className="mt-2 space-y-2">
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
