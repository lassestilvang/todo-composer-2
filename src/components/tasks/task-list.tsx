"use client";

import { motion } from "framer-motion";

type Task = {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  deadline: string | null;
  priority: string;
  completed: number;
  list_name: string;
  list_emoji: string;
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  async function toggleTask(id: string, completed: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    window.location.reload();
  }

  if (tasks.length === 0) {
    return <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">No tasks for this view.</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <motion.article key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`text-sm font-semibold ${task.completed ? "line-through opacity-60" : ""}`}>{task.title}</h3>
              {task.description ? <p className="mt-1 text-xs text-zinc-500">{task.description}</p> : null}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{task.list_emoji} {task.list_name}</span>
                {task.scheduled_date ? <span className="rounded bg-blue-100 px-2 py-1 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100">Date: {task.scheduled_date}</span> : null}
                {task.deadline ? <span className="rounded bg-amber-100 px-2 py-1 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">Deadline: {task.deadline}</span> : null}
                {task.priority !== "none" ? <span className="rounded bg-fuchsia-100 px-2 py-1 text-fuchsia-900 dark:bg-fuchsia-900/30 dark:text-fuchsia-100">{task.priority}</span> : null}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={Boolean(task.completed)} onChange={(event) => void toggleTask(task.id, event.target.checked)} />
              Done
            </label>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
