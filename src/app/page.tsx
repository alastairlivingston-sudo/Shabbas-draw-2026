"use client";

import { useLivePolling } from "@/lib/use-live-polling";
import { useDraftStore } from "@/lib/store";
import { getDraftOrder } from "@/lib/draft-order";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LeaderboardPage() {
  useLivePolling();

  const participants = useDraftStore((state) => state.participants);
  const matches = useDraftStore((state) => state.matches);
  const goalEvents = useDraftStore((state) => state.goalEvents);

  const order = getDraftOrder(participants, matches, goalEvents);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Fantasy Draft Draw</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Draft pick order is decided by total goals scored in each person&apos;s assigned 2026
        World Cup group. Ties are broken by the earliest goal scored in either tied group.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pick</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Countries</TableHead>
              <TableHead className="text-right">Goals</TableHead>
              <TableHead className="text-right">Fastest goal</TableHead>
              <TableHead className="text-right">Played</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.map((entry) => {
              const groupMatches = matches.filter((m) => m.group === entry.participant.group);
              const played = groupMatches.filter((m) => m.status === "completed").length;
              const fastestGoalMatch = matches.find((m) =>
                goalEvents.some(
                  (g) => g.matchId === m.id && g.minute === entry.fastestGoalMinute,
                ),
              );

              return (
                <TableRow
                  key={entry.participant.id}
                  className={entry.stillTied ? "bg-amber-50 dark:bg-amber-950/30" : undefined}
                >
                  <TableCell className="font-mono font-medium">{entry.pick}</TableCell>
                  <TableCell className="font-medium">{entry.participant.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Group {entry.participant.group}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.participant.countries.join(", ")}
                  </TableCell>
                  <TableCell className="text-right font-mono">{entry.goals}</TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {Number.isFinite(entry.fastestGoalMinute)
                      ? `${entry.fastestGoalMinute}'${
                          fastestGoalMatch
                            ? ` (${fastestGoalMatch.homeTeam} v ${fastestGoalMatch.awayTeam})`
                            : ""
                        }`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {played} of {groupMatches.length}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Highlighted rows are still tied on both goals and fastest goal — pick order will resolve
        as more group-stage matches are played.
      </p>
    </div>
  );
}
