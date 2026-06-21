import { describe, expect, it } from "vitest";
import { getDraftOrder, getGroupFastestGoalMinute, getGroupGoalTotal } from "@/lib/draft-order";
import type { GoalEvent, GroupMatch, Participant } from "@/lib/types";

function makeMatch(overrides: Partial<GroupMatch>): GroupMatch {
  return {
    id: "x1",
    group: "A",
    matchday: 1,
    homeTeam: "Home",
    awayTeam: "Away",
    kickoff: "2026-06-11T19:00:00Z",
    venue: "Venue",
    status: "completed",
    homeScore: 0,
    awayScore: 0,
    minute: null,
    locked: false,
    ...overrides,
  };
}

function makeParticipant(overrides: Partial<Participant>): Participant {
  return {
    id: "p1",
    name: "Player",
    group: "A",
    countries: [],
    ...overrides,
  };
}

describe("getGroupGoalTotal", () => {
  it("sums home and away scores across all matches in the group", () => {
    const matches = [
      makeMatch({ id: "a1", group: "A", homeScore: 2, awayScore: 1 }),
      makeMatch({ id: "a2", group: "A", homeScore: 0, awayScore: 3 }),
      makeMatch({ id: "b1", group: "B", homeScore: 5, awayScore: 5 }),
    ];
    expect(getGroupGoalTotal("A", matches)).toBe(6);
  });

  it("treats null scores as zero", () => {
    const matches = [makeMatch({ id: "a1", group: "A", homeScore: null, awayScore: null, status: "upcoming" })];
    expect(getGroupGoalTotal("A", matches)).toBe(0);
  });
});

describe("getGroupFastestGoalMinute", () => {
  it("returns the earliest minute among goals in the group", () => {
    const goals: GoalEvent[] = [
      { id: "g1", matchId: "a1", group: "A", team: "Home", minute: 23, source: "api" },
      { id: "g2", matchId: "a2", group: "A", team: "Away", minute: 5, source: "api" },
      { id: "g3", matchId: "b1", group: "B", team: "Home", minute: 1, source: "api" },
    ];
    expect(getGroupFastestGoalMinute("A", goals)).toBe(5);
  });

  it("returns Infinity when no goals have been scored in the group yet", () => {
    expect(getGroupFastestGoalMinute("A", [])).toBe(Infinity);
  });
});

describe("getDraftOrder", () => {
  it("ranks participants by descending group goal total", () => {
    const participants = [
      makeParticipant({ id: "p-a", group: "A" }),
      makeParticipant({ id: "p-b", group: "B" }),
      makeParticipant({ id: "p-c", group: "C" }),
    ];
    const matches = [
      makeMatch({ id: "a1", group: "A", homeScore: 3, awayScore: 2 }), // 5
      makeMatch({ id: "b1", group: "B", homeScore: 1, awayScore: 0 }), // 1
      makeMatch({ id: "c1", group: "C", homeScore: 2, awayScore: 2 }), // 4
    ];
    const order = getDraftOrder(participants, matches, []);
    expect(order.map((e) => e.participant.id)).toEqual(["p-a", "p-c", "p-b"]);
    expect(order.map((e) => e.pick)).toEqual([1, 2, 3]);
    expect(order.every((e) => !e.stillTied)).toBe(true);
  });

  it("breaks a goal-total tie using the earliest goal scored in either group", () => {
    const participants = [
      makeParticipant({ id: "p-a", group: "A" }),
      makeParticipant({ id: "p-b", group: "B" }),
    ];
    const matches = [
      makeMatch({ id: "a1", group: "A", homeScore: 1, awayScore: 1 }), // 2
      makeMatch({ id: "b1", group: "B", homeScore: 2, awayScore: 0 }), // 2
    ];
    const goals: GoalEvent[] = [
      { id: "g1", matchId: "a1", group: "A", team: "Home", minute: 30, source: "api" },
      { id: "g2", matchId: "b1", group: "B", team: "Home", minute: 12, source: "api" },
    ];
    const order = getDraftOrder(participants, matches, goals);
    expect(order.map((e) => e.participant.id)).toEqual(["p-b", "p-a"]);
    expect(order.map((e) => e.pick)).toEqual([1, 2]);
    expect(order.every((e) => !e.stillTied)).toBe(true);
  });

  it("marks groups as still tied when there's genuinely no signal yet", () => {
    const participants = [
      makeParticipant({ id: "p-a", group: "A" }),
      makeParticipant({ id: "p-b", group: "B" }),
      makeParticipant({ id: "p-c", group: "C" }),
    ];
    const matches = [
      makeMatch({ id: "a1", group: "A", homeScore: null, awayScore: null, status: "upcoming" }),
      makeMatch({ id: "b1", group: "B", homeScore: null, awayScore: null, status: "upcoming" }),
      makeMatch({ id: "c1", group: "C", homeScore: 1, awayScore: 0 }),
    ];
    const order = getDraftOrder(participants, matches, []);
    const tied = order.filter((e) => e.participant.group !== "C");
    expect(tied).toHaveLength(2);
    expect(tied.every((e) => e.stillTied)).toBe(true);
    expect(tied.every((e) => e.pick === tied[0].pick)).toBe(true);
    const leader = order.find((e) => e.participant.group === "C")!;
    expect(leader.pick).toBe(1);
    expect(leader.stillTied).toBe(false);
  });
});
