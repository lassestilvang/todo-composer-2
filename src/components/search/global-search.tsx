"use client";

import { useState } from "react";

type SearchResult = {
  id: string;
  title: string;
  listName: string;
  priority: string;
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  async function runSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }

    const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    const json = await response.json();
    setResults(json.results ?? []);
  }

  return (
    <div className="space-y-2">
      <input
        value={query}
        onChange={(event) => void runSearch(event.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        placeholder="Search tasks, lists, labels..."
      />
      {results.length > 0 ? (
        <div className="rounded-md border border-zinc-200 p-2 dark:border-zinc-700">
          {results.map((item) => (
            <div key={item.id} className="rounded px-2 py-1 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800">
              {item.title} <span className="text-xs text-zinc-500">in {item.listName}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
