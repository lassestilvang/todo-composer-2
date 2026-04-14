import Link from "next/link";
import { GlobalSearch } from "@/components/search/global-search";
import { TaskEditor } from "@/components/tasks/task-editor";
import { TaskList } from "@/components/tasks/task-list";
import { getLabels, getLists } from "@/lib/services/list-service";
import { getTaskById, getTasks } from "@/lib/services/task-service";
import { TaskHistory } from "@/components/tasks/task-history";

export async function PlannerView({ view, showCompleted, taskId }: { view: "today" | "next-7-days" | "upcoming" | "all"; showCompleted: boolean; taskId?: string; }) {
  const lists = getLists() as Array<{ id: string; name: string; emoji: string }>;
  const labels = getLabels() as Array<{ id: string; name: string; icon: string }>;
  const tasks = getTasks(view, showCompleted) as Array<{
    id: string;
    title: string;
    description: string | null;
    scheduled_date: string | null;
    deadline: string | null;
    priority: string;
    completed: number;
    list_name: string;
    list_emoji: string;
  }>;
  const selectedTask = taskId ? getTaskById(taskId) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{view === "next-7-days" ? "Next 7 Days" : view[0].toUpperCase() + view.slice(1)}</h2>
          <p className="text-sm text-zinc-500">Manage your day with quick edits, reminders, labels, and priorities.</p>
        </div>
        <Link
          href={`?showCompleted=${showCompleted ? "0" : "1"}`}
          className="rounded-md border border-zinc-300 px-3 py-2 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {showCompleted ? "Hide completed" : "Show completed"}
        </Link>
      </div>

      <GlobalSearch />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <TaskList tasks={tasks} />
        </div>
        <div className="space-y-4">
          <TaskEditor lists={lists} labels={labels} />
          {selectedTask ? <TaskHistory history={(selectedTask as { history: Array<{ id: string; action: string; field: string | null; before: string | null; after: string | null; created_at: string }> }).history} /> : null}
        </div>
      </div>
    </div>
  );
}
