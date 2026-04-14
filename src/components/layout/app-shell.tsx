import { PlannerSidebar } from "@/components/sidebar/planner-sidebar";

type AppShellProps = {
  children: React.ReactNode;
  overdueCount: number;
};

export function AppShell({ children, overdueCount }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-900/80">
        <details className="group">
          <summary className="list-none rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">Open planner menu</summary>
          <div className="mt-2 rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <PlannerSidebar overdueCount={overdueCount} />
          </div>
        </details>
      </div>

      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 md:grid-cols-[320px_1fr]">
        <PlannerSidebar overdueCount={overdueCount} className="hidden border-r border-zinc-200 md:flex dark:border-zinc-800" />
        <main className="border-l border-zinc-200/70 bg-white/80 p-4 pb-24 backdrop-blur md:p-6 md:pb-6 dark:border-zinc-800 dark:bg-zinc-900/60">
          {children}
        </main>
      </div>
    </div>
  );
}
