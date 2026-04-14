import Link from "next/link";
import { getLabels, getLists } from "@/lib/services/list-service";
import { SidebarCreator } from "@/components/sidebar/sidebar-creator";

const views = [
  { href: "/today", label: "Today" },
  { href: "/next-7-days", label: "Next 7 Days" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/all", label: "All" },
];

export function PlannerSidebar({ overdueCount, className = "" }: { overdueCount: number; className?: string }) {
  const lists = getLists() as Array<{ id: string; name: string; emoji: string; color: string; is_inbox: number }>;
  const labels = getLabels() as Array<{ id: string; name: string; icon: string; color: string }>;

  return (
    <aside className={`flex flex-col gap-6 p-4 ${className}`}>
      <h1 className="text-xl font-semibold tracking-tight">Daily Planner</h1>
      <section className="space-y-2">
        <h2 className="text-xs uppercase text-zinc-500">Views</h2>
        {views.map((view) => (
          <Link key={view.href} href={view.href} className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-zinc-200/70 dark:hover:bg-zinc-800">
            <span>{view.label}</span>
            {view.label === "Today" && overdueCount > 0 ? (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">{overdueCount}</span>
            ) : null}
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase text-zinc-500">Lists</h2>
        {lists.map((list) => (
          <div key={list.id} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-200/70 dark:hover:bg-zinc-800">
            <span>{list.emoji}</span>
            <span>{list.name}</span>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase text-zinc-500">Labels</h2>
        {labels.length === 0 ? <p className="px-3 text-xs text-zinc-500">No labels yet.</p> : null}
        {labels.map((label) => (
          <div key={label.id} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-200/70 dark:hover:bg-zinc-800">
            <span>{label.icon}</span>
            <span>{label.name}</span>
          </div>
        ))}
      </section>
      <SidebarCreator />
    </aside>
  );
}
