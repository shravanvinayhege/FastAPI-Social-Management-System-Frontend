"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";
import { getToken } from "../../lib/api";

export default function Header() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(Boolean(getToken()));
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/6 bg-transparent backdrop-blur-sm">
      <div className="vf-container flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold" aria-label="Home">
            <span style={{ color: "hsl(var(--accent))" }}>Vote</span>Flow
          </Link>
        </div>

        <nav className="hidden items-center gap-3 md:flex">
          <Link href="/" className="text-sm text-slate-200 hover:text-white">
            Feed
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="hidden md:inline-block">
            <button className="vf-btn-secondary px-3 py-1 text-sm">Sign in</button>
          </Link>
          <div className="hidden md:block">
            {isAuthed ? <Avatar size={36} email={undefined} /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
