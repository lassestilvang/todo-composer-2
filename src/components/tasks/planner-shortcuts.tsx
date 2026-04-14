"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PlannerShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function fireToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 1400);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.target as HTMLElement)?.tagName === "INPUT" || (event.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("global-search-input")?.focus();
        fireToast("Search focused");
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        document.getElementById("new-task-title")?.focus();
        fireToast("Ready for a new task");
      }

      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        router.push("/today");
        fireToast("Switched to Today");
      }

      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        router.push("/all");
        fireToast("Switched to All tasks");
      }

      if (event.key === "?") {
        event.preventDefault();
        setShowHelp((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <>
      {showHelp ? (
        <div className="rounded-xl border border-zinc-200 bg-white/90 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-900/90">
          <p className="font-medium">Keyboard shortcuts</p>
          <p><kbd>/</kbd> Search, <kbd>n</kbd> New task, <kbd>t</kbd> Today, <kbd>a</kbd> All, <kbd>?</kbd> Toggle help</p>
        </div>
      ) : null}
      {toast ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          {toast}
        </div>
      ) : null}
    </>
  );
}
