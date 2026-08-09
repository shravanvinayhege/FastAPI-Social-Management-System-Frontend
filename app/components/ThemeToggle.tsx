"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "vf-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const initialTheme = storedTheme ?? systemTheme;
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    if (busy) return;
    setBusy(true);

    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    // optional confirmation flow (user setting)
    try {
      const confirmPref = localStorage.getItem("vf.confirmTheme");
      if (confirmPref === "1") {
        // eslint-disable-next-line no-alert
        const ok = window.confirm(
          `Switch to ${nextTheme} theme?`
        );
        if (!ok) {
          setBusy(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    setTheme(nextTheme);
    applyTheme(nextTheme);
    // prevent accidental double-switches
    setTimeout(() => setBusy(false), 300);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={theme === "light"}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="vf-theme-toggle inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
    >
      <span className="vf-theme-toggle-icon flex h-7 w-7 items-center justify-center rounded-full text-base leading-none">
        {theme === "dark" ? "☀" : "☾"}
      </span>
      <span>{theme === "dark" ? "Switch to Light" : "Switch to Dark"}</span>
    </button>
  );
}
