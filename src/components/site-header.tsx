"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDraftStore } from "@/lib/store";
import { LastSyncedBadge } from "@/components/last-synced-badge";

const NAV_LINKS = [
  { href: "/", label: "Leaderboard" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/rules", label: "Rules" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const lastSyncedAt = useDraftStore((state) => state.lastSyncedAt);

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-violet-700 via-indigo-700 to-violet-800 text-white shadow-md">
      <nav className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link href="/" className="text-sm font-extrabold tracking-tight sm:text-base">
          ⚽ Draft Draw
        </Link>
        <LastSyncedBadge syncedAt={lastSyncedAt} />
      </nav>
      <div className="mx-auto max-w-2xl overflow-x-auto px-3 pb-2 sm:px-4">
        <div className="flex gap-1.5 text-sm">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors ${
                  active ? "bg-white text-violet-800" : "text-white/80 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
