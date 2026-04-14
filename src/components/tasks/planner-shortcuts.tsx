"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PlannerShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.target as HTMLElement)?.tagName === "INPUT" || (event.target as HTMLElement)?.tagName === "TEXTAREA") {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("global-search-input")?.focus();
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        document.getElementById("new-task-title")?.focus();
      }

      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        router.push("/today");
      }

      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        router.push("/all");
      }

      if (event.key === "?") {
        event.preventDefault();
        setShowHelp((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return showHelp ? (
    <div className="rounded-xl border border-zinc-200 bg-white/90 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-900/90">
      <p className="font-medium">Keyboard shortcuts</p>
      <p><kbd>/</kbd> Search, <kbd>n</kbd> New task, <kbd>t</kbd> Today, <kbd>a</kbd> All, <kbd>?</kbd> Toggle help</p>
    </div>
  ) : null;
}
