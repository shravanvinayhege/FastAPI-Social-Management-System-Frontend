"use client";

import React from "react";

type AvatarProps = {
  email?: string;
  id?: number;
  size?: number;
};

function initials(text?: string) {
  if (!text) return "?";
  const parts = text.split("@")[0].split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return text[0].toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function Avatar({ email, id, size = 40 }: AvatarProps) {
  const label = initials(email ?? String(id ?? "?"));
  const hue = (email ? [...email].reduce((s, c) => s + c.charCodeAt(0), 0) : (id ?? 1) * 37) % 360;
  const bg = `hsl(${hue} 60% 30%)`;

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full font-semibold text-white"
      style={{ width: size, height: size, background: bg }}
      aria-hidden
    >
      <span className="text-sm">{label}</span>
    </div>
  );
}
