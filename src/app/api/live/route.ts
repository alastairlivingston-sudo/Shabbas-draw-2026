import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { fetchEventGoals, fetchScoreboard, findEspnEventForMatch, mapEspnStatus } from "@/lib/espn";
import { fixtures } from "@/lib/data/fixtures";
import type { GoalEvent, GroupMatch } from "@/lib/types";

const TOURNAMENT_DATE_RANGE = "20260611-20260720";
const REVALIDATE_SECONDS = Number(process.env.LIVE_SYNC_REVALIDATE_SECONDS ?? 3600);

type LiveUpdate = {
  matches: Array<Pick<GroupMatch, "id" | "status" | "homeScore" | "awayScore" | "minute">>;
  goalEvents: GoalEvent[];
};

async function buildLiveUpdate(): Promise<LiveUpdate> {
  const events = await fetchScoreboard(TOURNAMENT_DATE_RANGE);

  const matches: LiveUpdate["matches"] = [];
  const goalEventLists = await Promise.all(
    fixtures.map(async (fixture) => {
      const event = findEspnEventForMatch(fixture, events);
      if (!event) return [] as GoalEvent[];

      const competition = event.competitions[0];
      const homeCompetitor = competition.competitors.find((c) => c.homeAway === "home");
      const awayCompetitor = competition.competitors.find((c) => c.homeAway === "away");
      const status = mapEspnStatus(event.status.type.state);

      matches.push({
        id: fixture.id,
        status,
        homeScore: homeCompetitor?.score !== undefined ? Number(homeCompetitor.score) : null,
        awayScore: awayCompetitor?.score !== undefined ? Number(awayCompetitor.score) : null,
        minute: null,
      });

      if (status === "live" || status === "completed") {
        try {
          return await fetchEventGoals(event.id, fixture);
        } catch {
          return [] as GoalEvent[];
        }
      }
      return [] as GoalEvent[];
    }),
  );

  return { matches, goalEvents: goalEventLists.flat() };
}

const getCachedLiveUpdate = unstable_cache(buildLiveUpdate, ["live-update"], {
  revalidate: REVALIDATE_SECONDS,
});

export async function GET() {
  try {
    const update = await getCachedLiveUpdate();
    return NextResponse.json(update);
  } catch {
    return NextResponse.json({ matches: [], goalEvents: [] });
  }
}
