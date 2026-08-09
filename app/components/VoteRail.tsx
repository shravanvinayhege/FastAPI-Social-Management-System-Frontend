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
    <div className="flex flex-row items-center gap-3 text-center sm:flex-col sm:w-14">
      <button
        type="button"
        onClick={onUpvote}
        disabled={isVoting}
        aria-label="Upvote"
        title="Upvote"
        className="rounded-xl border border-white/10 bg-white/3 px-2 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-60 focus-visible"
      >
        ▲
      </button>
      <div className="text-sm font-semibold text-white tabular-nums">{votes}</div>
      <button
        type="button"
        onClick={onRemove}
        disabled={isVoting}
        aria-label="Remove vote"
        title="Remove vote"
        className="rounded-xl border border-white/10 bg-white/3 px-2 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-60 focus-visible"
      >
        ▽
      </button>
    </div>
  );
}
