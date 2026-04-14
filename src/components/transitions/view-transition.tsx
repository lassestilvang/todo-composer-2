"use client";

import { useEffect } from "react";

export function ViewTransitionEnhancer() {
  useEffect(() => {
    const doc = document as Document & { startViewTransition?: () => void };
    if (!doc.startViewTransition) {
      document.documentElement.classList.add("no-view-transition");
    }
  }, []);

  return null;
}
