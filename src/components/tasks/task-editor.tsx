"use client";

import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

type ListItem = { id: string; name: string; emoji: string };
type LabelItem = { id: string; name: string; icon: string };
type SubtaskItem = { id: string; title: string };

export function TaskEditor({ lists, labels }: { lists: ListItem[]; labels: LabelItem[] }) {
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([]);
  const [subtaskDraft, setSubtaskDraft] = useState("");
  const [reminders, setReminders] = useState<string[]>([]);
  const [reminderDraft, setReminderDraft] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const quickDates = useMemo(() => {
    const today = new Date();
    return [
      { label: "Today", value: format(today, "yyyy-MM-dd") },
      { label: "Tomorrow", value: format(addDays(today, 1), "yyyy-MM-dd") },
      { label: "Next Week", value: format(addDays(today, 7), "yyyy-MM-dd") },
    ];
  }, []);

  function addSubtask() {
    const title = subtaskDraft.trim();
    if (!title) return;
    setSubtasks((current) => [...current, { id: crypto.randomUUID(), title }]);
    setSubtaskDraft("");
  }

  function moveSubtask(from: number, to: number) {
    if (to < 0 || to >= subtasks.length || from === to) return;
    setSubtasks((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  async function onSubmit(formData: FormData) {
    try {
      setLoading(true);
      const payload = {
        listId: String(formData.get("listId") ?? "inbox"),
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? "") || null,
        scheduledDate: scheduledDate || null,
        deadline: deadline || null,
        estimateMinutes: Number(formData.get("estimateMinutes") || 0) || null,
        actualMinutes: Number(formData.get("actualMinutes") || 0) || null,
        priority: String(formData.get("priority") ?? "none"),
        recurring: String(formData.get("recurring") ?? "none"),
        recurringRule: String(formData.get("recurringRule") ?? "") || null,
        attachmentUrl: String(formData.get("attachmentUrl") ?? "") || null,
        labelIds: selectedLabels,
        subtasks: subtasks.map((item) => ({ title: item.title, completed: false })),
        reminders,
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not save task");
      }

      setStatusMessage("Task saved");
      window.setTimeout(() => window.location.reload(), 500);
    } catch {
      setStatusMessage("Failed to save task");
    } finally {
      setLoading(false);
      window.setTimeout(() => setStatusMessage(null), 1400);
    }
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <h3 className="text-sm font-medium">New Task</h3>
      <p aria-live="polite" className="text-xs text-zinc-500">{statusMessage ?? " "}</p>
      <input id="new-task-title" name="title" placeholder="Task title" required className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      <textarea name="description" placeholder="Description" className="min-h-20 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />

      <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
        <p className="mb-2 text-xs font-medium uppercase text-zinc-500">Schedule</p>
        <div className="mb-2 flex flex-wrap gap-2">
          {quickDates.map((chip) => (
            <button key={chip.label} type="button" className="pressable rounded-full border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700" onClick={() => setScheduledDate(chip.value)}>
              {chip.label}
            </button>
          ))}
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <input type="date" name="scheduledDate" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
          <input type="date" name="deadline" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
        </div>
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

      <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
        <p className="text-xs font-medium uppercase text-zinc-500">Subtasks (drag to reorder)</p>
        <div className="flex gap-2">
          <input value={subtaskDraft} onChange={(event) => setSubtaskDraft(event.target.value)} placeholder="Add subtask" className="flex-1 rounded border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700" />
          <button type="button" className="pressable rounded bg-zinc-200 p-2 dark:bg-zinc-700" onClick={addSubtask}><Plus className="h-4 w-4" /></button>
        </div>
        <ul className="space-y-2">
          {subtasks.map((item, index) => (
            <li
              key={item.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", String(index));
                event.dataTransfer.effectAllowed = "move";
                setDraggingId(item.id);
              }}
              onDragEnd={() => {
                setDraggingId(null);
                setDropTargetId(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDropTargetId(item.id);
              }}
              onDrop={(event) => {
                const from = Number(event.dataTransfer.getData("text/plain"));
                moveSubtask(from, index);
                setDropTargetId(null);
              }}
              className={`drag-item flex items-center gap-2 rounded border px-2 py-1 text-sm dark:bg-zinc-800 ${
                draggingId === item.id
                  ? "drag-item--ghost border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-900/20"
                  : dropTargetId === item.id
                    ? "border-sky-400 bg-sky-50 dark:border-sky-500 dark:bg-sky-900/20"
                    : "border-zinc-200 bg-zinc-50 dark:border-zinc-700"
              }`}
            >
              <GripVertical className="h-4 w-4 text-zinc-500" />
              <button
                type="button"
                className="flex-1 rounded px-1 py-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-label={`Subtask ${item.title}. Press Alt+Arrow to reorder.`}
                onKeyDown={(event) => {
                  if (!event.altKey) return;
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveSubtask(index, index - 1);
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveSubtask(index, index + 1);
                  }
                }}
              >
                {item.title}
              </button>
              <button type="button" className="pressable rounded p-1" onClick={() => setSubtasks((current) => current.filter((task) => task.id !== item.id))}>
                <Trash2 className="h-4 w-4 text-zinc-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
        <p className="text-xs font-medium uppercase text-zinc-500">Reminders</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input type="datetime-local" value={reminderDraft} onChange={(event) => setReminderDraft(event.target.value)} className="flex-1 rounded border border-zinc-300 bg-transparent px-2 py-1 text-sm dark:border-zinc-700" />
          <button
            type="button"
            className="pressable rounded bg-zinc-200 px-3 py-1 text-sm dark:bg-zinc-700"
            onClick={() => {
              if (!reminderDraft) return;
              setReminders((current) => [...current, new Date(reminderDraft).toISOString()]);
              setReminderDraft("");
            }}
          >
            Add reminder
          </button>
        </div>
        <ul className="space-y-1 text-xs text-zinc-500">
          {reminders.map((reminder) => (
            <li key={reminder} className="flex items-center justify-between rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              <span>{new Date(reminder).toLocaleString()}</span>
              <button type="button" className="pressable rounded px-1 py-0.5" onClick={() => setReminders((current) => current.filter((item) => item !== reminder))}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

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
      <div className="sticky bottom-2 z-20 -mx-1 rounded-xl border border-zinc-200 bg-white/90 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 dark:border-zinc-700 dark:bg-zinc-900/90">
        <button disabled={loading} className="pressable w-full rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 sm:w-auto" type="submit">
          {loading ? "Saving..." : "Create task"}
        </button>
      </div>
    </form>
  );
}
