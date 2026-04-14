"use client";

export default function PlannerError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-3 rounded-xl border border-rose-300 p-6 text-sm dark:border-rose-900">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p>We could not load this planner view.</p>
      <button onClick={reset} className="rounded-md bg-rose-600 px-3 py-2 text-white">Try again</button>
    </div>
  );
}
