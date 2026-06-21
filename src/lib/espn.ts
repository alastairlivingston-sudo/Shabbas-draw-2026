import { fixtures } from "@/lib/data/fixtures";
import type { GoalEvent, GroupMatch, MatchStatus } from "@/lib/types";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";

const TEAM_ALIASES: Record<string, string> = {
  "cote divoire": "ivory coast",
  "ivory coast": "ivory coast",
  "korea republic": "korea",
  "south korea": "korea",
  "czech republic": "czechia",
  "turkey": "turkiye",
  "united states": "usa",
  "usmnt": "usa",
  "bosnia and herzegovina": "bosnia herzegovina",
  "bosnia": "bosnia herzegovina",
  "dr congo": "congo dr",
  "democratic republic of the congo": "congo dr",
  "congo dr": "congo dr",
  "cabo verde": "cape verde",
  "ir iran": "iran",
};

export function normalizeTeamName(name: string): string {
  const stripped = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[-_]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ");
  return TEAM_ALIASES[stripped] ?? stripped;
}

function sameUtcDay(a: string, b: string): boolean {
  return a.slice(0, 10) === new Date(b).toISOString().slice(0, 10);
}

type EspnCompetitor = {
  team: { displayName: string; name?: string; shortDisplayName?: string };
  score?: string;
  homeAway: "home" | "away";
};

type EspnEvent = {
  id: string;
  date: string;
  status: { type: { state: "pre" | "in" | "post" } };
  competitions: Array<{
    competitors: EspnCompetitor[];
  }>;
};

type EspnScoreboardResponse = {
  events: EspnEvent[];
};

export function mapEspnStatus(state: "pre" | "in" | "post"): MatchStatus {
  if (state === "in") return "live";
  if (state === "post") return "completed";
  return "upcoming";
}

export function findEspnEventForMatch(
  match: GroupMatch,
  events: EspnEvent[],
): EspnEvent | undefined {
  return events.find((event) => {
    const competition = event.competitions[0];
    if (!competition || competition.competitors.length !== 2) return false;
    if (!sameUtcDay(match.kickoff, event.date)) return false;

    const names = competition.competitors.map((c) => normalizeTeamName(c.team.displayName));
    const home = normalizeTeamName(match.homeTeam);
    const away = normalizeTeamName(match.awayTeam);
    return names.includes(home) && names.includes(away);
  });
}

export async function fetchScoreboard(dateRange: string): Promise<EspnEvent[]> {
  const res = await fetch(`${ESPN_BASE}/scoreboard?dates=${dateRange}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`ESPN scoreboard request failed: ${res.status}`);
  const data = (await res.json()) as EspnScoreboardResponse;
  return data.events ?? [];
}

type EspnKeyEvent = {
  clock?: { value?: number; displayValue?: string };
  team?: { displayName?: string };
  type?: { id?: string; text?: string };
  scoringPlay?: boolean;
  ownGoal?: boolean;
};

type EspnSummaryResponse = {
  keyEvents?: EspnKeyEvent[];
};

export async function fetchEventGoals(
  eventId: string,
  match: GroupMatch,
): Promise<GoalEvent[]> {
  const res = await fetch(`${ESPN_BASE}/summary?event=${eventId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`ESPN summary request failed: ${res.status}`);
  const data = (await res.json()) as EspnSummaryResponse;
  const keyEvents = data.keyEvents ?? [];

  return keyEvents
    .filter((e) => e.scoringPlay && e.team?.displayName)
    .map((e, index) => {
      const minute =
        parseMinuteFromDisplay(e.clock?.displayValue) ??
        (e.clock?.value !== undefined ? Math.round(e.clock.value / 60) : 0);
      const isOwnGoal = e.ownGoal === true || e.type?.text?.toLowerCase().includes("own goal");
      // ESPN's keyEvent.team for an own goal already names the benefiting side, not the scorer.
      const creditedTeam = e.team!.displayName!;

      return {
        id: `${match.id}:${creditedTeam}:${minute}:${index}`,
        matchId: match.id,
        group: match.group,
        team: creditedTeam,
        minute,
        ownGoal: isOwnGoal,
        source: "api" as const,
      };
    });
}

function parseMinuteFromDisplay(display?: string): number | undefined {
  if (!display) return undefined;
  const match = display.match(/^(\d+)(?:\+(\d+))?/);
  if (!match) return undefined;
  const base = Number(match[1]);
  const extra = match[2] ? Number(match[2]) : 0;
  return base + extra;
}

export function dedupeGoalEvents(events: GoalEvent[]): GoalEvent[] {
  const seen = new Set<string>();
  const result: GoalEvent[] = [];
  for (const event of events) {
    const key = `${event.matchId}:${event.team}:${event.minute}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(event);
  }
  return result;
}

export function getAllFixtures(): GroupMatch[] {
  return fixtures;
}
