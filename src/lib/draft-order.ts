import type { DraftOrderEntry, GoalEvent, GroupMatch, Participant } from "@/lib/types";

export function getGroupGoalTotal(group: string, matches: GroupMatch[]): number {
  return matches
    .filter((m) => m.group === group)
    .reduce((sum, m) => sum + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
}

export function getGroupFastestGoalMinute(group: string, goalEvents: GoalEvent[]): number {
  const minutes = goalEvents.filter((g) => g.group === group).map((g) => g.minute);
  return minutes.length > 0 ? Math.min(...minutes) : Infinity;
}

export function getDraftOrder(
  participants: Participant[],
  matches: GroupMatch[],
  goalEvents: GoalEvent[],
): DraftOrderEntry[] {
  const ranked = participants
    .map((participant) => ({
      participant,
      goals: getGroupGoalTotal(participant.group, matches),
      fastestGoalMinute: getGroupFastestGoalMinute(participant.group, goalEvents),
    }))
    .sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      return a.fastestGoalMinute - b.fastestGoalMinute;
    });

  const entries: DraftOrderEntry[] = [];
  let pick = 1;
  for (let i = 0; i < ranked.length; i++) {
    const current = ranked[i];
    const previous = ranked[i - 1];
    const tiedWithPrevious =
      previous !== undefined &&
      previous.goals === current.goals &&
      previous.fastestGoalMinute === current.fastestGoalMinute;

    if (!tiedWithPrevious) {
      pick = i + 1;
    }

    const tiedWithNext =
      ranked[i + 1] !== undefined &&
      ranked[i + 1].goals === current.goals &&
      ranked[i + 1].fastestGoalMinute === current.fastestGoalMinute;

    entries.push({
      participant: current.participant,
      pick,
      goals: current.goals,
      fastestGoalMinute: current.fastestGoalMinute,
      stillTied: tiedWithPrevious || tiedWithNext,
    });
  }

  return entries;
}
