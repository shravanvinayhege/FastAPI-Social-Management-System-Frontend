"use client";

import React from "react";

type VoteRailProps = {
  votes: number;
  onUpvote: () => void;
  onRemove: () => void;
  isVoting?: boolean;
};

export default function VoteRail({ votes, onUpvote, onRemove, isVoting = false }: VoteRailProps) {
  return (
    <div className="flex w-14 flex-col items-center gap-2 text-center md:flex-col">
      <button
        type="button"
        onClick={onUpvote}
        disabled={isVoting}
        aria-label="Upvote"
        className="rounded-xl border border-white/10 bg-white/3 px-2 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-60 focus-visible"
      >
        ▲
      </button>
      <div className="text-sm font-semibold text-white">{votes}</div>
      <button
        type="button"
        onClick={onRemove}
        disabled={isVoting}
        aria-label="Remove vote"
        className="rounded-xl border border-white/10 bg-white/3 px-2 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-60 focus-visible"
      >
        ▽
      </button>
    </div>
  );
}
