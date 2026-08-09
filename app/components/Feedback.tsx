"use client";

import React from "react";

export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="vf-card flex items-center justify-center gap-3 p-6">
      <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2"></circle>
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      </svg>
      <div className="text-sm text-slate-200">{label}</div>
    </div>
  );
}

export function Empty({ title, message }: { title: string; message?: string }) {
  return (
    <div className="vf-card p-6 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {message ? <p className="mt-2 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-md border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
      {message}
    </div>
  );
}
