import { describe, expect, it } from "vitest";
import { dedupeGoalEvents, normalizeTeamName } from "@/lib/espn";
import type { GoalEvent } from "@/lib/types";

describe("normalizeTeamName", () => {
  it("strips diacritics and lowercases", () => {
    expect(normalizeTeamName("Türkiye")).toBe("turkiye");
  });

  it("treats Ivory Coast and Côte d'Ivoire as the same team", () => {
    expect(normalizeTeamName("Ivory Coast")).toBe(normalizeTeamName("Côte d'Ivoire"));
  });

  it("normalizes Curacao consistently regardless of accent", () => {
    expect(normalizeTeamName("Curaçao")).toBe(normalizeTeamName("Curacao"));
  });
});

describe("dedupeGoalEvents", () => {
  it("removes duplicate goal events sharing the same match, team, and minute", () => {
    const events: GoalEvent[] = [
      { id: "1", matchId: "a1", group: "A", team: "Mexico", minute: 10, source: "api" },
      { id: "2", matchId: "a1", group: "A", team: "Mexico", minute: 10, source: "api" },
      { id: "3", matchId: "a1", group: "A", team: "Mexico", minute: 45, source: "api" },
    ];
    const result = dedupeGoalEvents(events);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(["1", "3"]);
  });
});
