"use client";

import { useState } from "react";

type ListItem = { id: string; name: string; emoji: string };
type LabelItem = { id: string; name: string; icon: string };

export function TaskEditor({ lists, labels }: { lists: ListItem[]; labels: LabelItem[] }) {
  const [subtasksText, setSubtasksText] = useState("");
  const [remindersText, setRemindersText] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload = {
      listId: String(formData.get("listId") ?? "inbox"),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      scheduledDate: String(formData.get("scheduledDate") ?? "") || null,
      deadline: String(formData.get("deadline") ?? "") || null,
      estimateMinutes: Number(formData.get("estimateMinutes") || 0) || null,
      actualMinutes: Number(formData.get("actualMinutes") || 0) || null,
      priority: String(formData.get("priority") ?? "none"),
      recurring: String(formData.get("recurring") ?? "none"),
      recurringRule: String(formData.get("recurringRule") ?? "") || null,
      attachmentUrl: String(formData.get("attachmentUrl") ?? "") || null,
      labelIds: selectedLabels,
      subtasks: subtasksText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((title) => ({ title, completed: false })),
      reminders: remindersText.split("\n").map((line) => line.trim()).filter(Boolean),
    };

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    window.location.reload();
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <h3 className="text-sm font-medium">New Task</h3>
      <input name="title" placeholder="Task title" required className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      <textarea name="description" placeholder="Description" className="min-h-20 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      <div className="grid gap-2 md:grid-cols-2">
        <input type="date" name="scheduledDate" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
        <input type="date" name="deadline" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <input type="number" name="estimateMinutes" placeholder="Estimate (minutes)" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
        <input type="number" name="actualMinutes" placeholder="Actual (minutes)" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <select name="listId" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" defaultValue="inbox">
          {lists.map((list) => (
            <option value={list.id} key={list.id}>{list.emoji} {list.name}</option>
          ))}
        </select>
        <select name="priority" defaultValue="none" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700">
          <option value="none">Priority: None</option>
          <option value="low">Priority: Low</option>
          <option value="medium">Priority: Medium</option>
          <option value="high">Priority: High</option>
        </select>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <select name="recurring" defaultValue="none" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700">
          <option value="none">No recurrence</option>
          <option value="every_day">Every day</option>
          <option value="every_week">Every week</option>
          <option value="every_weekday">Every weekday</option>
          <option value="every_month">Every month</option>
          <option value="every_year">Every year</option>
          <option value="custom">Custom</option>
        </select>
        <input name="recurringRule" placeholder="Custom recurrence rule" className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      </div>
      <input name="attachmentUrl" placeholder="Attachment URL" className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      <textarea value={subtasksText} onChange={(event) => setSubtasksText(event.target.value)} placeholder="Subtasks, one per line" className="min-h-16 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      <textarea value={remindersText} onChange={(event) => setRemindersText(event.target.value)} placeholder="Reminder ISO timestamps, one per line" className="min-h-16 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => {
          const checked = selectedLabels.includes(label.id);
          return (
            <button
              type="button"
              key={label.id}
              className={`rounded-full px-2 py-1 text-xs ${checked ? "bg-violet-600 text-white" : "bg-zinc-200 dark:bg-zinc-700"}`}
              onClick={() =>
                setSelectedLabels((current) =>
                  current.includes(label.id) ? current.filter((id) => id !== label.id) : [...current, label.id]
                )
              }
            >
              {label.icon} {label.name}
            </button>
          );
        })}
      </div>
      <button disabled={loading} className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50" type="submit">
        {loading ? "Saving..." : "Create task"}
      </button>
    </form>
  );
}
