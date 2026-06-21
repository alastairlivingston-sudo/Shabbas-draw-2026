import { create } from "zustand";
import { persist } from "zustand/middleware";
import { participants } from "@/lib/data/participants";
import { fixtures } from "@/lib/data/fixtures";
import { dedupeGoalEvents } from "@/lib/espn";
import type { AuditLogEntry, GoalEvent, GroupMatch, MatchStatus, Participant } from "@/lib/types";

type DraftStore = {
  participants: Participant[];
  matches: GroupMatch[];
  goalEvents: GoalEvent[];
  auditLog: AuditLogEntry[];
  lastSyncedAt: string | null;

  applyLiveUpdate: (update: {
    matches: Array<Pick<GroupMatch, "id" | "status" | "homeScore" | "awayScore" | "minute">>;
    goalEvents: GoalEvent[];
    syncedAt?: string | null;
  }) => void;

  manualUpdateMatch: (
    matchId: string,
    fields: Partial<Pick<GroupMatch, "status" | "homeScore" | "awayScore" | "minute">>,
  ) => void;
  toggleMatchLock: (matchId: string) => void;
  addManualGoalEvent: (event: Omit<GoalEvent, "id" | "source">) => void;
  removeGoalEvent: (eventId: string) => void;
};

function logEntry(description: string): AuditLogEntry {
  return { id: crypto.randomUUID(), timestamp: new Date().toISOString(), description };
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      participants,
      matches: fixtures,
      goalEvents: [],
      auditLog: [],
      lastSyncedAt: null,

      applyLiveUpdate: ({ matches: matchUpdates, goalEvents: newGoalEvents, syncedAt }) => {
        set((state) => {
          const updatedMatches = state.matches.map((match) => {
            if (match.locked) return match;
            const update = matchUpdates.find((u) => u.id === match.id);
            if (!update) return match;
            return {
              ...match,
              status: update.status as MatchStatus,
              homeScore: update.homeScore,
              awayScore: update.awayScore,
              minute: update.minute,
            };
          });

          const lockedMatchIds = new Set(state.matches.filter((m) => m.locked).map((m) => m.id));
          const filteredNewGoals = newGoalEvents.filter((g) => !lockedMatchIds.has(g.matchId));

          return {
            matches: updatedMatches,
            goalEvents: dedupeGoalEvents([...state.goalEvents, ...filteredNewGoals]),
            lastSyncedAt: syncedAt ?? state.lastSyncedAt,
          };
        });
      },

      manualUpdateMatch: (matchId, fields) => {
        const match = get().matches.find((m) => m.id === matchId);
        set((state) => ({
          matches: state.matches.map((m) => (m.id === matchId ? { ...m, ...fields } : m)),
          auditLog: [
            logEntry(`Manually updated ${match?.homeTeam} vs ${match?.awayTeam} (${matchId})`),
            ...state.auditLog,
          ],
        }));
      },

      toggleMatchLock: (matchId) => {
        const match = get().matches.find((m) => m.id === matchId);
        set((state) => ({
          matches: state.matches.map((m) => (m.id === matchId ? { ...m, locked: !m.locked } : m)),
          auditLog: [
            logEntry(
              `${match?.locked ? "Unlocked" : "Locked"} ${match?.homeTeam} vs ${match?.awayTeam} (${matchId})`,
            ),
            ...state.auditLog,
          ],
        }));
      },

      addManualGoalEvent: (event) => {
        const newEvent: GoalEvent = { ...event, id: crypto.randomUUID(), source: "manual" };
        set((state) => ({
          goalEvents: [...state.goalEvents, newEvent],
          auditLog: [
            logEntry(`Manually added goal for ${event.team} at minute ${event.minute} (${event.matchId})`),
            ...state.auditLog,
          ],
        }));
      },

      removeGoalEvent: (eventId) => {
        const event = get().goalEvents.find((g) => g.id === eventId);
        set((state) => ({
          goalEvents: state.goalEvents.filter((g) => g.id !== eventId),
          auditLog: event
            ? [logEntry(`Removed goal event for ${event.team} at minute ${event.minute} (${event.matchId})`), ...state.auditLog]
            : state.auditLog,
        }));
      },
    }),
    { name: "fantasy-draft-draw" },
  ),
);
