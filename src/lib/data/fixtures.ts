import type { GroupMatch } from "@/lib/types";

type SeedMatch = Omit<GroupMatch, "status" | "homeScore" | "awayScore" | "minute" | "locked">;

const seedMatches: SeedMatch[] = [
  // Group A
  { id: "a1", group: "A", matchday: 1, homeTeam: "Mexico", awayTeam: "South Africa", kickoff: "2026-06-11T19:00:00Z", venue: "Estadio Azteca, Mexico City" },
  { id: "a2", group: "A", matchday: 1, homeTeam: "Korea", awayTeam: "Czechia", kickoff: "2026-06-12T02:00:00Z", venue: "Estadio Akron, Guadalajara" },
  { id: "a3", group: "A", matchday: 2, homeTeam: "Czechia", awayTeam: "South Africa", kickoff: "2026-06-18T16:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta, Georgia" },
  { id: "a4", group: "A", matchday: 2, homeTeam: "Mexico", awayTeam: "Korea", kickoff: "2026-06-19T01:00:00Z", venue: "Estadio Akron, Guadalajara" },
  { id: "a5", group: "A", matchday: 3, homeTeam: "Czechia", awayTeam: "Mexico", kickoff: "2026-06-25T01:00:00Z", venue: "Estadio Azteca, Mexico City" },
  { id: "a6", group: "A", matchday: 3, homeTeam: "South Africa", awayTeam: "Korea", kickoff: "2026-06-25T01:00:00Z", venue: "Estadio BBVA, Guadalupe" },

  // Group B
  { id: "b1", group: "B", matchday: 1, homeTeam: "Canada", awayTeam: "Bosnia-Herzegovina", kickoff: "2026-06-12T19:00:00Z", venue: "BMO Field, Toronto" },
  { id: "b2", group: "B", matchday: 1, homeTeam: "Qatar", awayTeam: "Switzerland", kickoff: "2026-06-13T19:00:00Z", venue: "Levi's Stadium, Santa Clara, California" },
  { id: "b3", group: "B", matchday: 2, homeTeam: "Switzerland", awayTeam: "Bosnia-Herzegovina", kickoff: "2026-06-18T19:00:00Z", venue: "SoFi Stadium, Inglewood, California" },
  { id: "b4", group: "B", matchday: 2, homeTeam: "Canada", awayTeam: "Qatar", kickoff: "2026-06-18T22:00:00Z", venue: "BC Place, Vancouver" },
  { id: "b5", group: "B", matchday: 3, homeTeam: "Bosnia-Herzegovina", awayTeam: "Qatar", kickoff: "2026-06-24T19:00:00Z", venue: "Lumen Field, Seattle, Washington" },
  { id: "b6", group: "B", matchday: 3, homeTeam: "Switzerland", awayTeam: "Canada", kickoff: "2026-06-24T19:00:00Z", venue: "BC Place, Vancouver" },

  // Group C
  { id: "c1", group: "C", matchday: 1, homeTeam: "Brazil", awayTeam: "Morocco", kickoff: "2026-06-13T22:00:00Z", venue: "MetLife Stadium, East Rutherford, New Jersey" },
  { id: "c2", group: "C", matchday: 1, homeTeam: "Haiti", awayTeam: "Scotland", kickoff: "2026-06-14T01:00:00Z", venue: "Gillette Stadium, Foxborough, Massachusetts" },
  { id: "c3", group: "C", matchday: 2, homeTeam: "Scotland", awayTeam: "Morocco", kickoff: "2026-06-19T22:00:00Z", venue: "Gillette Stadium, Foxborough, Massachusetts" },
  { id: "c4", group: "C", matchday: 2, homeTeam: "Brazil", awayTeam: "Haiti", kickoff: "2026-06-20T00:30:00Z", venue: "Lincoln Financial Field, Philadelphia, Pennsylvania" },
  { id: "c5", group: "C", matchday: 3, homeTeam: "Morocco", awayTeam: "Haiti", kickoff: "2026-06-24T22:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta, Georgia" },
  { id: "c6", group: "C", matchday: 3, homeTeam: "Scotland", awayTeam: "Brazil", kickoff: "2026-06-24T22:00:00Z", venue: "Hard Rock Stadium, Miami Gardens, Florida" },

  // Group D
  { id: "d1", group: "D", matchday: 1, homeTeam: "USA", awayTeam: "Paraguay", kickoff: "2026-06-13T01:00:00Z", venue: "SoFi Stadium, Inglewood, California" },
  { id: "d2", group: "D", matchday: 1, homeTeam: "Australia", awayTeam: "Türkiye", kickoff: "2026-06-14T04:00:00Z", venue: "BC Place, Vancouver" },
  { id: "d3", group: "D", matchday: 2, homeTeam: "USA", awayTeam: "Australia", kickoff: "2026-06-19T19:00:00Z", venue: "Lumen Field, Seattle, Washington" },
  { id: "d4", group: "D", matchday: 2, homeTeam: "Türkiye", awayTeam: "Paraguay", kickoff: "2026-06-20T03:00:00Z", venue: "Levi's Stadium, Santa Clara, California" },
  { id: "d5", group: "D", matchday: 3, homeTeam: "Paraguay", awayTeam: "Australia", kickoff: "2026-06-26T02:00:00Z", venue: "Levi's Stadium, Santa Clara, California" },
  { id: "d6", group: "D", matchday: 3, homeTeam: "Türkiye", awayTeam: "USA", kickoff: "2026-06-26T02:00:00Z", venue: "SoFi Stadium, Inglewood, California" },

  // Group E
  { id: "e1", group: "E", matchday: 1, homeTeam: "Germany", awayTeam: "Curacao", kickoff: "2026-06-14T17:00:00Z", venue: "NRG Stadium, Houston, Texas" },
  { id: "e2", group: "E", matchday: 1, homeTeam: "Ivory Coast", awayTeam: "Ecuador", kickoff: "2026-06-14T23:00:00Z", venue: "Lincoln Financial Field, Philadelphia, Pennsylvania" },
  { id: "e3", group: "E", matchday: 2, homeTeam: "Germany", awayTeam: "Ivory Coast", kickoff: "2026-06-20T20:00:00Z", venue: "BMO Field, Toronto" },
  { id: "e4", group: "E", matchday: 2, homeTeam: "Ecuador", awayTeam: "Curacao", kickoff: "2026-06-21T00:00:00Z", venue: "GEHA Field at Arrowhead Stadium, Kansas City, Missouri" },
  { id: "e5", group: "E", matchday: 3, homeTeam: "Curacao", awayTeam: "Ivory Coast", kickoff: "2026-06-25T20:00:00Z", venue: "Lincoln Financial Field, Philadelphia, Pennsylvania" },
  { id: "e6", group: "E", matchday: 3, homeTeam: "Ecuador", awayTeam: "Germany", kickoff: "2026-06-25T20:00:00Z", venue: "MetLife Stadium, East Rutherford, New Jersey" },

  // Group F
  { id: "f1", group: "F", matchday: 1, homeTeam: "Netherlands", awayTeam: "Japan", kickoff: "2026-06-14T20:00:00Z", venue: "AT&T Stadium, Arlington, Texas" },
  { id: "f2", group: "F", matchday: 1, homeTeam: "Sweden", awayTeam: "Tunisia", kickoff: "2026-06-15T02:00:00Z", venue: "Estadio BBVA, Guadalupe" },
  { id: "f3", group: "F", matchday: 2, homeTeam: "Netherlands", awayTeam: "Sweden", kickoff: "2026-06-20T17:00:00Z", venue: "NRG Stadium, Houston, Texas" },
  { id: "f4", group: "F", matchday: 2, homeTeam: "Tunisia", awayTeam: "Japan", kickoff: "2026-06-21T04:00:00Z", venue: "Estadio BBVA, Guadalupe" },
  { id: "f5", group: "F", matchday: 3, homeTeam: "Japan", awayTeam: "Sweden", kickoff: "2026-06-25T23:00:00Z", venue: "AT&T Stadium, Arlington, Texas" },
  { id: "f6", group: "F", matchday: 3, homeTeam: "Tunisia", awayTeam: "Netherlands", kickoff: "2026-06-25T23:00:00Z", venue: "GEHA Field at Arrowhead Stadium, Kansas City, Missouri" },

  // Group G
  { id: "g1", group: "G", matchday: 1, homeTeam: "Belgium", awayTeam: "Egypt", kickoff: "2026-06-15T19:00:00Z", venue: "Lumen Field, Seattle, Washington" },
  { id: "g2", group: "G", matchday: 1, homeTeam: "Iran", awayTeam: "New Zealand", kickoff: "2026-06-16T01:00:00Z", venue: "SoFi Stadium, Inglewood, California" },
  { id: "g3", group: "G", matchday: 2, homeTeam: "Belgium", awayTeam: "Iran", kickoff: "2026-06-21T19:00:00Z", venue: "SoFi Stadium, Inglewood, California" },
  { id: "g4", group: "G", matchday: 2, homeTeam: "New Zealand", awayTeam: "Egypt", kickoff: "2026-06-22T01:00:00Z", venue: "BC Place, Vancouver" },
  { id: "g5", group: "G", matchday: 3, homeTeam: "Egypt", awayTeam: "Iran", kickoff: "2026-06-27T03:00:00Z", venue: "Lumen Field, Seattle, Washington" },
  { id: "g6", group: "G", matchday: 3, homeTeam: "New Zealand", awayTeam: "Belgium", kickoff: "2026-06-27T03:00:00Z", venue: "BC Place, Vancouver" },

  // Group H
  { id: "h1", group: "H", matchday: 1, homeTeam: "Spain", awayTeam: "Cape Verde", kickoff: "2026-06-15T16:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta, Georgia" },
  { id: "h2", group: "H", matchday: 1, homeTeam: "Saudi Arabia", awayTeam: "Uruguay", kickoff: "2026-06-15T22:00:00Z", venue: "Hard Rock Stadium, Miami Gardens, Florida" },
  { id: "h3", group: "H", matchday: 2, homeTeam: "Spain", awayTeam: "Saudi Arabia", kickoff: "2026-06-21T16:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta, Georgia" },
  { id: "h4", group: "H", matchday: 2, homeTeam: "Uruguay", awayTeam: "Cape Verde", kickoff: "2026-06-21T22:00:00Z", venue: "Hard Rock Stadium, Miami Gardens, Florida" },
  { id: "h5", group: "H", matchday: 3, homeTeam: "Cape Verde", awayTeam: "Saudi Arabia", kickoff: "2026-06-27T00:00:00Z", venue: "NRG Stadium, Houston, Texas" },
  { id: "h6", group: "H", matchday: 3, homeTeam: "Uruguay", awayTeam: "Spain", kickoff: "2026-06-27T00:00:00Z", venue: "Estadio Akron, Guadalajara" },

  // Group I
  { id: "i1", group: "I", matchday: 1, homeTeam: "France", awayTeam: "Senegal", kickoff: "2026-06-16T19:00:00Z", venue: "MetLife Stadium, East Rutherford, New Jersey" },
  { id: "i2", group: "I", matchday: 1, homeTeam: "Iraq", awayTeam: "Norway", kickoff: "2026-06-16T22:00:00Z", venue: "Gillette Stadium, Foxborough, Massachusetts" },
  { id: "i3", group: "I", matchday: 2, homeTeam: "France", awayTeam: "Iraq", kickoff: "2026-06-22T21:00:00Z", venue: "Lincoln Financial Field, Philadelphia, Pennsylvania" },
  { id: "i4", group: "I", matchday: 2, homeTeam: "Norway", awayTeam: "Senegal", kickoff: "2026-06-23T00:00:00Z", venue: "MetLife Stadium, East Rutherford, New Jersey" },
  { id: "i5", group: "I", matchday: 3, homeTeam: "Norway", awayTeam: "France", kickoff: "2026-06-26T19:00:00Z", venue: "Gillette Stadium, Foxborough, Massachusetts" },
  { id: "i6", group: "I", matchday: 3, homeTeam: "Senegal", awayTeam: "Iraq", kickoff: "2026-06-26T19:00:00Z", venue: "BMO Field, Toronto" },

  // Group J
  { id: "j1", group: "J", matchday: 1, homeTeam: "Argentina", awayTeam: "Algeria", kickoff: "2026-06-17T01:00:00Z", venue: "GEHA Field at Arrowhead Stadium, Kansas City, Missouri" },
  { id: "j2", group: "J", matchday: 1, homeTeam: "Austria", awayTeam: "Jordan", kickoff: "2026-06-17T04:00:00Z", venue: "Levi's Stadium, Santa Clara, California" },
  { id: "j3", group: "J", matchday: 2, homeTeam: "Argentina", awayTeam: "Austria", kickoff: "2026-06-22T17:00:00Z", venue: "AT&T Stadium, Arlington, Texas" },
  { id: "j4", group: "J", matchday: 2, homeTeam: "Jordan", awayTeam: "Algeria", kickoff: "2026-06-23T03:00:00Z", venue: "Levi's Stadium, Santa Clara, California" },
  { id: "j5", group: "J", matchday: 3, homeTeam: "Algeria", awayTeam: "Austria", kickoff: "2026-06-28T02:00:00Z", venue: "GEHA Field at Arrowhead Stadium, Kansas City, Missouri" },
  { id: "j6", group: "J", matchday: 3, homeTeam: "Jordan", awayTeam: "Argentina", kickoff: "2026-06-28T02:00:00Z", venue: "AT&T Stadium, Arlington, Texas" },

  // Group K
  { id: "k1", group: "K", matchday: 1, homeTeam: "Portugal", awayTeam: "DR Congo", kickoff: "2026-06-17T17:00:00Z", venue: "NRG Stadium, Houston, Texas" },
  { id: "k2", group: "K", matchday: 1, homeTeam: "Uzbekistan", awayTeam: "Colombia", kickoff: "2026-06-18T02:00:00Z", venue: "Estadio Azteca, Mexico City" },
  { id: "k3", group: "K", matchday: 2, homeTeam: "Portugal", awayTeam: "Uzbekistan", kickoff: "2026-06-23T17:00:00Z", venue: "NRG Stadium, Houston, Texas" },
  { id: "k4", group: "K", matchday: 2, homeTeam: "Colombia", awayTeam: "DR Congo", kickoff: "2026-06-24T02:00:00Z", venue: "Estadio Akron, Guadalajara" },
  { id: "k5", group: "K", matchday: 3, homeTeam: "Colombia", awayTeam: "Portugal", kickoff: "2026-06-27T23:30:00Z", venue: "Hard Rock Stadium, Miami Gardens, Florida" },
  { id: "k6", group: "K", matchday: 3, homeTeam: "DR Congo", awayTeam: "Uzbekistan", kickoff: "2026-06-27T23:30:00Z", venue: "Mercedes-Benz Stadium, Atlanta, Georgia" },

  // Group L
  { id: "l1", group: "L", matchday: 1, homeTeam: "England", awayTeam: "Croatia", kickoff: "2026-06-17T20:00:00Z", venue: "AT&T Stadium, Arlington, Texas" },
  { id: "l2", group: "L", matchday: 1, homeTeam: "Ghana", awayTeam: "Panama", kickoff: "2026-06-17T23:00:00Z", venue: "BMO Field, Toronto" },
  { id: "l3", group: "L", matchday: 2, homeTeam: "England", awayTeam: "Ghana", kickoff: "2026-06-23T20:00:00Z", venue: "Gillette Stadium, Foxborough, Massachusetts" },
  { id: "l4", group: "L", matchday: 2, homeTeam: "Panama", awayTeam: "Croatia", kickoff: "2026-06-23T23:00:00Z", venue: "BMO Field, Toronto" },
  { id: "l5", group: "L", matchday: 3, homeTeam: "Croatia", awayTeam: "Ghana", kickoff: "2026-06-27T21:00:00Z", venue: "Lincoln Financial Field, Philadelphia, Pennsylvania" },
  { id: "l6", group: "L", matchday: 3, homeTeam: "Panama", awayTeam: "England", kickoff: "2026-06-27T21:00:00Z", venue: "MetLife Stadium, East Rutherford, New Jersey" },
];

export const fixtures: GroupMatch[] = seedMatches.map((m) => ({
  ...m,
  status: "upcoming",
  homeScore: null,
  awayScore: null,
  minute: null,
  locked: false,
}));
