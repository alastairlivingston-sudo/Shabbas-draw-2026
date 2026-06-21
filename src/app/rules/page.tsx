export default function RulesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Rules</h1>
      <div className="mt-4 space-y-4 text-sm leading-6">
        <p>
          Each of the 12 participants was assigned one group from the 2026 FIFA World Cup. Draft
          pick order for the fantasy league is decided entirely by what happens in the group stage.
        </p>
        <div>
          <h2 className="font-semibold">1. Primary: total group goals</h2>
          <p className="mt-1 text-muted-foreground">
            Add up every goal scored by either team in all 6 group-stage matches of a
            participant&apos;s assigned group. The group with the most goals gives its owner pick
            #1, the next most gives pick #2, and so on down to pick #12.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">2. Tiebreak: fastest goal</h2>
          <p className="mt-1 text-muted-foreground">
            If two or more groups are level on total goals, whichever of those groups had the
            earliest-minute goal scored anywhere in its group stage gets the better (earlier)
            pick.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Still tied?</h2>
          <p className="mt-1 text-muted-foreground">
            If groups are level on both goals and fastest goal (most commonly because neither has
            scored yet), the leaderboard shows them as tied with a shared provisional pick number
            until more matches resolve the tie.
          </p>
        </div>
        <p className="text-muted-foreground">
          A participant&apos;s 4 listed countries are simply their group&apos;s 4 teams, shown for
          flavour — scoring is always based on the whole group&apos;s total, not the countries
          individually.
        </p>
      </div>
    </div>
  );
}
