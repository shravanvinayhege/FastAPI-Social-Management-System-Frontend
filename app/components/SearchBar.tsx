"use client";

import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (q: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [q, setQ] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(q.trim());
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search post titles"
          className="w-full rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs bg-cyan-500 text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}
