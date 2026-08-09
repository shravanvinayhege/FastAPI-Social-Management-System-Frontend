"use client";

import React from "react";

type FeedTabsProps = {
  mode: "new" | "top";
  onChange: (mode: "new" | "top") => void;
};

export default function FeedTabs({ mode, onChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          mode === "new" ? "bg-cyan-500 text-white" : "bg-white/5 text-slate-200"
        }`}
        onClick={() => onChange("new")}
      >
        New
      </button>
      <button
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          mode === "top" ? "bg-cyan-500 text-white" : "bg-white/5 text-slate-200"
        }`}
        onClick={() => onChange("top")}
      >
        Top
      </button>
    </div>
  );
}
