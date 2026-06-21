"use client";

import { useLivePolling } from "@/lib/use-live-polling";
import { useDraftStore } from "@/lib/store";
import { getDraftOrder } from "@/lib/draft-order";
import { LastSyncedBadge } from "@/components/last-synced-badge";

export default function LeaderboardPage() {
  useLivePolling();

  const participants = useDraftStore((state) => state.participants);
  const matches = useDraftStore((state) => state.matches);
  const goalEvents = useDraftStore((state) => state.goalEvents);
  const lastSyncedAt = useDraftStore((state) => state.lastSyncedAt);

  const order = getDraftOrder(participants, matches, goalEvents);

  return (
    <div className="mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Fantasy Draft Draw</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Pick order is decided by total goals scored in each person&apos;s assigned group. Ties
            break on the earliest goal.
          </p>
        </div>
        <LastSyncedBadge syncedAt={lastSyncedAt} />
      </div>

      <div className="mt-5 space-y-2">
        {order.map((entry) => {
          const groupMatches = matches.filter((m) => m.group === entry.participant.group);
          const played = groupMatches.filter((m) => m.status === "completed").length;
          const remaining = groupMatches.length - played;
          const fastestGoalMatch = matches.find((m) =>
            goalEvents.some((g) => g.matchId === m.id && g.minute === entry.fastestGoalMinute),
          );

          return (
            <div
              key={entry.participant.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                entry.stillTied
                  ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                  : "bg-card"
              }`}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {entry.pick}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{entry.participant.name}</span>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                    Group {entry.participant.group}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {entry.participant.countries.join(", ")}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {Number.isFinite(entry.fastestGoalMinute)
                    ? `Fastest goal ${entry.fastestGoalMinute}'${
                        fastestGoalMatch
                          ? ` · ${fastestGoalMatch.homeTeam} v ${fastestGoalMatch.awayTeam}`
                          : ""
                      }`
                    : "No goals yet"}
                </p>
              </div>

              <div className="flex shrink-0 items-stretch gap-3 text-center">
                <div>
                  <div className="text-2xl font-extrabold tabular-nums leading-none">
                    {entry.goals}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Goals
                  </div>
                </div>
                <div className="w-px self-stretch bg-border" />
                <div>
                  <div
                    className={`text-2xl font-extrabold tabular-nums leading-none ${
                      remaining === 0 ? "text-muted-foreground" : ""
                    }`}
                  >
                    {remaining}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Left
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Highlighted rows are still tied on both goals and fastest goal — pick order will resolve
        as more group-stage matches are played.
      </p>
    </div>
  );
}
