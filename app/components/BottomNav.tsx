"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden border-t border-white/6 bg-slate-900/70 backdrop-blur-sm">
      <div className="vf-container flex items-center justify-around py-2">
        <Link href="/" className={`flex flex-col items-center text-xs ${path === "/" ? "text-white" : "text-slate-300"}`}>
          <span className="text-lg">🏠</span>
          <span>Feed</span>
        </Link>
        <Link href="/u/" className={`flex flex-col items-center text-xs text-slate-300`}>
          <span className="text-lg">👤</span>
          <span>My Posts</span>
        </Link>
        <Link href="/" className={`flex flex-col items-center text-xs text-slate-300`}>
          <span className="text-lg">⚡</span>
          <span>Voting</span>
        </Link>
      </div>
    </nav>
  );
}
