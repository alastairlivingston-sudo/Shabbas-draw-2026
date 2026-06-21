import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fantasy Draft Draw",
  description: "Live 2026 World Cup group goal standings deciding fantasy draft pick order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <nav className="mx-auto flex max-w-2xl items-center justify-between px-3 py-3 sm:px-4">
            <Link href="/" className="text-sm font-semibold sm:text-base">
              Fantasy Draft Draw
            </Link>
            <div className="flex gap-3 text-sm text-muted-foreground sm:gap-4">
              <Link href="/" className="hover:text-foreground">
                Leaderboard
              </Link>
              <Link href="/rules" className="hover:text-foreground">
                Rules
              </Link>
              <Link href="/admin" className="hover:text-foreground">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
