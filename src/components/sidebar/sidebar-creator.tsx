"use client";

import { useState } from "react";

export function SidebarCreator() {
  const [listName, setListName] = useState("");
  const [listColor, setListColor] = useState("#6366f1");
  const [listEmoji, setListEmoji] = useState("🗂️");
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("#22c55e");
  const [labelIcon, setLabelIcon] = useState("🏷️");

  async function createList() {
    if (!listName.trim()) return;
    await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: listName, color: listColor, emoji: listEmoji }),
    });
    window.location.reload();
  }

  async function createLabel() {
    if (!labelName.trim()) return;
    await fetch("/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: labelName, color: labelColor, icon: labelIcon }),
    });
    window.location.reload();
  }

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
      <p className="text-xs font-medium uppercase text-zinc-500">Quick add</p>
      <div className="space-y-2">
        <input value={listName} onChange={(e) => setListName(e.target.value)} placeholder="New list name" className="w-full rounded border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700" />
        <div className="flex gap-2">
          <input value={listEmoji} onChange={(e) => setListEmoji(e.target.value)} className="w-12 rounded border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700" />
          <input type="color" value={listColor} onChange={(e) => setListColor(e.target.value)} className="h-8 w-10 rounded border border-zinc-300 dark:border-zinc-700" />
          <button type="button" onClick={() => void createList()} className="rounded bg-violet-600 px-2 py-1 text-xs text-white">Add list</button>
        </div>
      </div>
      <div className="space-y-2">
        <input value={labelName} onChange={(e) => setLabelName(e.target.value)} placeholder="New label name" className="w-full rounded border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700" />
        <div className="flex gap-2">
          <input value={labelIcon} onChange={(e) => setLabelIcon(e.target.value)} className="w-12 rounded border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700" />
          <input type="color" value={labelColor} onChange={(e) => setLabelColor(e.target.value)} className="h-8 w-10 rounded border border-zinc-300 dark:border-zinc-700" />
          <button type="button" onClick={() => void createLabel()} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">Add label</button>
        </div>
      </div>
    </div>
  );
}
