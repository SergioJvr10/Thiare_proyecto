"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bigotes-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
    setReady(true);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    setDark(next);
  }

  if (!ready) {
    return (
      <button
        type="button"
        aria-label="Modo oscuro"
        className="h-10 w-10 rounded-full border border-stone-200 bg-white/80 dark:border-stone-600 dark:bg-stone-800"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-lg shadow-sm transition hover:border-amber-400 hover:bg-amber-50 dark:border-stone-600 dark:bg-stone-800 dark:hover:border-amber-500 dark:hover:bg-stone-700"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
