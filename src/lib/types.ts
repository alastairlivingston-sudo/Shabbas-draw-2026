export type Participant = {
  id: string;
  name: string;
  group: string;
  countries: string[];
};

export type MatchStatus = "upcoming" | "live" | "completed";

export type GroupMatch = {
  id: string;
  group: string;
  matchday: 1 | 2 | 3;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  venue: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  minute: number | null;
  locked: boolean;
};

export type GoalEvent = {
  id: string;
  matchId: string;
  group: string;
  team: string;
  minute: number;
  ownGoal?: boolean;
  source: "api" | "manual";
};

export type DraftOrderEntry = {
  participant: Participant;
  pick: number;
  goals: number;
  fastestGoalMinute: number;
  stillTied: boolean;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  description: string;
};
