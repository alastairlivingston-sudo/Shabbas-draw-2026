import type { GroupMatch } from "@/lib/types";

export type TeamGoalTotal = {
  team: string;
  goals: number;
  played: number;
};

export function getTeamGoalTotals(group: string, matches: GroupMatch[]): TeamGoalTotal[] {
  const totals = new Map<string, TeamGoalTotal>();

  for (const match of matches.filter((m) => m.group === group)) {
    for (const [team, score] of [
      [match.homeTeam, match.homeScore],
      [match.awayTeam, match.awayScore],
    ] as const) {
      if (!totals.has(team)) totals.set(team, { team, goals: 0, played: 0 });
      const entry = totals.get(team)!;
      if (match.status === "completed" || match.status === "live") {
        entry.goals += score ?? 0;
      }
      if (match.status === "completed") {
        entry.played += 1;
      }
    }
  }

  return [...totals.values()].sort((a, b) => b.goals - a.goals);
}
