"use client";

import React from "react";

export default function DefaultAvatarSvg({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.12" />
        <circle cx="50" cy="36" r="10" fill="currentColor" />
        <path d="M30 72c4-8 12-12 20-12s16 4 20 12" fill="currentColor" />
      </g>
    </svg>
  );
}
