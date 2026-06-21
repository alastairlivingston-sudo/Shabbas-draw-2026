"use client";

import { useState } from "react";
import { useDraftStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MatchStatus } from "@/lib/types";

const STATUS_OPTIONS: MatchStatus[] = ["upcoming", "live", "completed"];

export default function AdminPage() {
  const matches = useDraftStore((state) => state.matches);
  const goalEvents = useDraftStore((state) => state.goalEvents);
  const auditLog = useDraftStore((state) => state.auditLog);
  const manualUpdateMatch = useDraftStore((state) => state.manualUpdateMatch);
  const toggleMatchLock = useDraftStore((state) => state.toggleMatchLock);
  const addManualGoalEvent = useDraftStore((state) => state.addManualGoalEvent);
  const removeGoalEvent = useDraftStore((state) => state.removeGoalEvent);

  const [goalForm, setGoalForm] = useState<{ matchId: string; team: string; minute: string }>({
    matchId: matches[0]?.id ?? "",
    team: "",
    minute: "",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manual corrections for when ESPN data is late or wrong. Lock a match to freeze it against
        further automatic sync.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Matches</h2>
      <div className="mt-2 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Home</TableHead>
              <TableHead className="text-right">Away</TableHead>
              <TableHead>Locked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="text-sm">
                  {match.group}: {match.homeTeam} v {match.awayTeam}
                </TableCell>
                <TableCell>
                  <select
                    className="rounded border bg-background px-2 py-1 text-sm"
                    value={match.status}
                    disabled={match.locked}
                    onChange={(e) =>
                      manualUpdateMatch(match.id, { status: e.target.value as MatchStatus })
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    className="w-16 text-right"
                    disabled={match.locked}
                    value={match.homeScore ?? ""}
                    onChange={(e) =>
                      manualUpdateMatch(match.id, {
                        homeScore: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    className="w-16 text-right"
                    disabled={match.locked}
                    value={match.awayScore ?? ""}
                    onChange={(e) =>
                      manualUpdateMatch(match.id, {
                        awayScore: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={match.locked ? "default" : "outline"}
                    onClick={() => toggleMatchLock(match.id)}
                  >
                    {match.locked ? "Locked" : "Unlocked"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Add manual goal event</h2>
      <div className="mt-2 flex flex-wrap items-end gap-3 rounded-lg border p-4">
        <div>
          <Label htmlFor="match-select">Match</Label>
          <select
            id="match-select"
            className="mt-1 block rounded border bg-background px-2 py-1 text-sm"
            value={goalForm.matchId}
            onChange={(e) => setGoalForm((f) => ({ ...f, matchId: e.target.value }))}
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.group}: {m.homeTeam} v {m.awayTeam}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="team-input">Scoring team</Label>
          <Input
            id="team-input"
            className="mt-1 w-40"
            value={goalForm.team}
            onChange={(e) => setGoalForm((f) => ({ ...f, team: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="minute-input">Minute</Label>
          <Input
            id="minute-input"
            type="number"
            className="mt-1 w-20"
            value={goalForm.minute}
            onChange={(e) => setGoalForm((f) => ({ ...f, minute: e.target.value }))}
          />
        </div>
        <Button
          onClick={() => {
            const match = matches.find((m) => m.id === goalForm.matchId);
            if (!match || !goalForm.team || goalForm.minute === "") return;
            addManualGoalEvent({
              matchId: match.id,
              group: match.group,
              team: goalForm.team,
              minute: Number(goalForm.minute),
            });
            setGoalForm((f) => ({ ...f, team: "", minute: "" }));
          }}
        >
          Add goal
        </Button>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Goal events</h2>
      <div className="mt-2 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Minute</TableHead>
              <TableHead>Source</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {goalEvents.map((event) => {
              const match = matches.find((m) => m.id === event.matchId);
              return (
                <TableRow key={event.id}>
                  <TableCell className="text-sm">
                    {match ? `${match.homeTeam} v ${match.awayTeam}` : event.matchId}
                  </TableCell>
                  <TableCell>{event.team}</TableCell>
                  <TableCell className="text-right">{event.minute}&apos;</TableCell>
                  <TableCell>
                    <Badge variant={event.source === "manual" ? "secondary" : "outline"}>
                      {event.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => removeGoalEvent(event.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Audit log</h2>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {auditLog.length === 0 && <li>No manual edits yet.</li>}
        {auditLog.map((entry) => (
          <li key={entry.id}>
            {new Date(entry.timestamp).toLocaleString()} — {entry.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
