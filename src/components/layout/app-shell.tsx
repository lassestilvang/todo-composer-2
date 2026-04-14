import { PlannerSidebar } from "@/components/sidebar/planner-sidebar";

type AppShellProps = {
  children: React.ReactNode;
  overdueCount: number;
};

export function AppShell({ children, overdueCount }: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 md:grid-cols-[320px_1fr]">
        <PlannerSidebar overdueCount={overdueCount} />
        <main className="border-l border-zinc-200/70 bg-white/80 p-4 backdrop-blur md:p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
          {children}
        </main>
      </div>
    </div>
  );
}
